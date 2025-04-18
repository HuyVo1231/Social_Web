import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import { pusherServer } from '@/app/libs/pusher'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { conversationId, newMemberIds } = body

    if (!conversationId || !newMemberIds?.length) {
      return new NextResponse('Thiếu dữ liệu', { status: 400 })
    }

    // Cập nhật cuộc trò chuyện, thêm các thành viên mới
    const updatedConversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        users: {
          connect: newMemberIds.map((id: string) => ({ id }))
        }
      },
      include: { users: true }
    })

    // Gửi sự kiện Pusher
    await Promise.all(
      updatedConversation.users.map(async (user) => {
        if (!user.email) {
          console.log(`No email for user ${user.id}`)
          return Promise.resolve()
        }
        try {
          await pusherServer.trigger(
            user.email,
            newMemberIds.includes(user.id) ? 'add_member' : 'conversation:update',
            {
              conversation: updatedConversation,
              ...(newMemberIds.includes(user.id) ? {} : { action: 'member_added', newMemberIds })
            }
          )
          console.log(
            `Triggered ${
              newMemberIds.includes(user.id) ? 'add_member' : 'conversation:update'
            } to ${user.email}`
          )
        } catch (error) {
          console.error(`Pusher error for ${user.email}:`, error)
        }
      })
    )

    return NextResponse.json(updatedConversation)
  } catch (error) {
    console.error('[ADD_MEMBERS_ERROR]', error)
    return new NextResponse('Lỗi server', { status: 500 })
  }
}
