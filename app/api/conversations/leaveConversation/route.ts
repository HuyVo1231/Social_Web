import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/users/getCurrentUser'
import { pusherServer } from '@/app/libs/pusher'

export async function POST(req: Request) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const body = await req.json()
    const { conversationId } = body

    if (!conversationId) {
      return new NextResponse('Missing conversationId', { status: 400 })
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        users: true
      }
    })

    if (!conversation) {
      return new NextResponse('Conversation not found', { status: 404 })
    }

    const isUserInConversation = conversation.users.some((user) => user.id === currentUser.id)
    if (!isUserInConversation) {
      return new NextResponse('User is not part of this conversation', { status: 400 })
    }

    // Xóa người dùng khỏi cuộc trò chuyện
    const updatedConversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        users: {
          disconnect: {
            id: currentUser.id
          }
        }
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true
          }
        }
      }
    })

    // Nếu nhóm không còn ai, xóa cuộc trò chuyện
    const remainingUsers = updatedConversation.users.length
    if (remainingUsers === 0) {
      await prisma.conversation.delete({
        where: { id: conversationId }
      })
    }

    // Gửi cập nhật conversation tới những người còn lại qua Pusher
    await Promise.all(
      updatedConversation.users.map((user) =>
        user.email
          ? pusherServer.trigger(user.email, 'conversation:update', {
              conversation: updatedConversation,
              action: 'user_left',
              userId: currentUser.id
            })
          : Promise.resolve()
      )
    )

    return NextResponse.json({ message: 'User has left the conversation' }, { status: 200 })
  } catch (error) {
    console.error('Error in leaveGroup:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
