import getCurrentUser from '@/app/actions/users/getCurrentUser'
import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import { pusherServer } from '@/app/libs/pusher'

export async function POST(request: Request) {
  try {
    const [currentUser, body] = await Promise.all([getCurrentUser(), request.json()])

    const { userId, isGroup, members, name } = body

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Chưa xác thực', { status: 401 })
    }

    // Trường hợp tạo Group Conversation.
    if (isGroup) {
      if (!members || members.length < 2 || !name) {
        return new NextResponse('Dữ liệu không hợp lệ', { status: 400 })
      }

      const newConversation = await prisma.conversation.create({
        data: {
          isGroup,
          name,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({ id: member.value })),
              { id: currentUser.id }
            ]
          }
        },
        include: { users: true }
      })

      await Promise.all(
        newConversation.users.map((user) =>
          user.email
            ? pusherServer.trigger(user.email, 'newConversation', newConversation)
            : Promise.resolve()
        )
      ).catch((error) => console.error('Lỗi Pusher:', error))

      return NextResponse.json(newConversation)
    }

    // Kiểm tra và tạo conversation song song nếu cần
    const [existingConversation] = await Promise.all([
      prisma.conversation.findFirst({
        where: {
          isGroup: false,
          AND: [{ users: { some: { id: currentUser.id } } }, { users: { some: { id: userId } } }]
        },
        include: {
          users: true,
          messages: {
            include: { sender: true, seen: true },
            orderBy: { createdAt: 'asc' }
          }
        }
      })
    ])

    if (existingConversation) {
      const chattingUser = existingConversation.users.find((user) => user.id !== currentUser.id)
      return NextResponse.json({ ...existingConversation, chattingUser })
    }

    // Tạo conversation mới
    const newConversation = await prisma.conversation.create({
      data: {
        isGroup: false,
        users: { connect: [{ id: currentUser.id }, { id: userId }] }
      },
      include: {
        users: true,
        messages: {
          include: { sender: true, seen: true }
        }
      }
    })

    const chattingUser = newConversation.users.find((user) => user.id !== currentUser.id)

    await Promise.all(
      newConversation.users.map((user) =>
        user.email
          ? pusherServer.trigger(user.email, 'newConversation', newConversation)
          : Promise.resolve()
      )
    ).catch((error) => console.error('Lỗi Pusher:', error))

    return NextResponse.json({ ...newConversation, chattingUser })
  } catch (error) {
    console.error('Lỗi khi tạo cuộc trò chuyện:', error)
    return NextResponse.json({ message: 'Lỗi server nội bộ', status: 500 }, { status: 500 })
  }
}
