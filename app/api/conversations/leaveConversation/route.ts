import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/users/getCurrentUser'

export async function POST(req: Request) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const body = await req.json()
    const { conversationId } = body

    // Kiểm tra nếu thiếu conversationId
    if (!conversationId) {
      return new NextResponse('Missing conversationId', { status: 400 })
    }

    // Kiểm tra nếu cuộc trò chuyện không tồn tại
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        users: true // Lấy thông tin tất cả người dùng tham gia cuộc trò chuyện
      }
    })

    if (!conversation) {
      return new NextResponse('Conversation not found', { status: 404 })
    }

    // Kiểm tra nếu người dùng có tham gia cuộc trò chuyện
    const isUserInConversation = conversation.users.some((user) => user.id === currentUser.id)

    if (!isUserInConversation) {
      return new NextResponse('User is not part of this conversation', { status: 400 })
    }

    // Xóa người dùng khỏi cuộc trò chuyện
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        users: {
          disconnect: {
            id: currentUser.id // Xóa người dùng khỏi cuộc trò chuyện
          }
        }
      }
    })

    // Nếu nhóm không còn thành viên nào, xóa cuộc trò chuyện
    const remainingUsers = await prisma.conversation.count({
      where: {
        id: conversationId,
        users: {
          some: {}
        }
      }
    })

    if (remainingUsers === 0) {
      await prisma.conversation.delete({
        where: { id: conversationId }
      })
    }

    return NextResponse.json({ message: 'User has left the conversation' }, { status: 200 })
  } catch (error) {
    console.error('Error in leaveGroup:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
