import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/users/getCurrentUser'
import { pusherServer } from '@/app/libs/pusher'

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 })
    }

    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'Thiếu userId' }, { status: 400 })
    }

    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { initiatorId: currentUser.id, receiverId: userId, status: 'ACCEPTED' },
          { initiatorId: userId, receiverId: currentUser.id, status: 'ACCEPTED' }
        ]
      }
    })

    if (!friendship) {
      return NextResponse.json(
        { error: 'Bạn không có kết nối với người dùng này.' },
        { status: 404 }
      )
    }

    await prisma.friendship.delete({
      where: { id: friendship.id }
    })

    await prisma.notification.deleteMany({
      where: {
        OR: [
          { senderId: currentUser.id, receiverId: userId, type: 'FRIEND_REQUEST' },
          { senderId: userId, receiverId: currentUser.id, type: 'FRIEND_REQUEST' }
        ]
      }
    })

    await pusherServer.trigger(`user-${userId}`, 'friend_removed', {
      message: 'Bạn đã bị hủy kết bạn.',
      userId: currentUser.id
    })

    return NextResponse.json({ message: 'Đã hủy kết bạn.' }, { status: 200 })
  } catch (error) {
    console.error('UNFRIEND API ERROR', error)
    return NextResponse.json({ message: 'Lỗi internal của server' }, { status: 500 })
  }
}
