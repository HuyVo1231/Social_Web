import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/users/getCurrentUser'
import { pusherServer } from '@/app/libs/pusher'

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) return new NextResponse('Unauthorized', { status: 401 })

    const body = await req.json()
    const { conversationId } = body

    if (!conversationId) {
      return new NextResponse('Thiếu conversationId', { status: 400 })
    }

    const existing = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: {
        userIds: true,
        users: true
      }
    })

    if (!existing) return new NextResponse('Conversation không tồn tại', { status: 404 })
    if (existing.userIds.includes(currentUser.id)) {
      return new NextResponse('Bạn đã ở trong nhóm này rồi', { status: 400 })
    }

    // Cập nhật: thêm user mới
    const updatedConversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        users: {
          connect: { id: currentUser.id }
        }
      },
      include: {
        users: true
      }
    })

    const newMemberId = currentUser.id

    // Gửi sự kiện Pusher đến toàn bộ users
    await Promise.all(
      updatedConversation.users.map(async (user) => {
        if (!user.email) return

        const isNewMember = user.id === newMemberId
        const eventName = isNewMember ? 'conversation:add' : 'conversation:update'
        const payload = isNewMember
          ? { conversation: updatedConversation }
          : {
              conversation: updatedConversation,
              action: 'member_joined',
              newMemberIds: [newMemberId]
            }

        try {
          await pusherServer.trigger(user.email, eventName, payload)
        } catch (error) {
          console.error(`Pusher error for ${user.email}:`, error)
        }
      })
    )

    return NextResponse.json(updatedConversation)
  } catch (error) {
    console.error('[JOIN_GROUP_ERROR]', error)
    return new NextResponse('Lỗi server', { status: 500 })
  }
}
