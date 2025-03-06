import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/users/getCurrentUser'

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Chưa login.' }, { status: 401 })
    }

    const body = await request.json()
    const { userId, action } = body

    if (!action) {
      return NextResponse.json({ error: 'Missing action' }, { status: 400 })
    }

    if (action === 'send_request') {
      if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user) return NextResponse.json({ error: 'Người dùng không tồn tại.' }, { status: 404 })

      const existingFriendship = await prisma.friendship.findFirst({
        where: {
          OR: [
            { initiatorId: currentUser.id, receiverId: userId },
            { initiatorId: userId, receiverId: currentUser.id }
          ]
        }
      })

      if (existingFriendship) {
        if (existingFriendship.status === 'PENDING') {
          const updatedFriendship = await prisma.friendship.update({
            where: { id: existingFriendship.id },
            data: { status: 'ACCEPTED' }
          })
          return NextResponse.json({ updatedFriendship }, { status: 200 })
        }
        return NextResponse.json({ message: 'Bạn đã là bạn bè với người này.' }, { status: 400 })
      }

      const friendship = await prisma.friendship.create({
        data: { initiatorId: currentUser.id, receiverId: userId, status: 'PENDING' }
      })

      await prisma.notification.create({
        data: {
          type: 'FRIEND_REQUEST',
          content: `đã gửi lời mời kết bạn`,
          senderId: currentUser.id,
          receiverId: userId,
          friendshipId: friendship.id
        }
      })
      return NextResponse.json({ friendship }, { status: 201 })
    }

    if (action === 'accept_request' || action === 'reject_request') {
      if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

      const friendship = await prisma.friendship.findFirst({
        where: {
          OR: [
            { initiatorId: userId, receiverId: currentUser.id, status: 'PENDING' },
            { initiatorId: currentUser.id, receiverId: userId, status: 'PENDING' }
          ]
        }
      })

      if (!friendship) {
        return NextResponse.json(
          { error: 'Không có lời mời kết bạn hoặc đã bị xử lý.' },
          { status: 404 }
        )
      }

      const updatedFriendship = await prisma.friendship.update({
        where: { id: friendship.id },
        data: { status: action === 'accept_request' ? 'ACCEPTED' : 'REJECTED' },
        select: {
          initiator: true
        }
      })

      // **Tạo notification khi chấp nhận hoặc từ chối lời mời**
      await prisma.notification.create({
        data: {
          type: 'FRIEND_REQUEST',
          content:
            action === 'accept_request'
              ? `đã chấp nhận lời mời kết bạn`
              : `đã từ chối lời mời kết bạn`,
          senderId: currentUser.id,
          receiverId: userId,
          friendshipId: friendship.id
        }
      })

      return NextResponse.json(
        {
          message:
            action === 'accept_request' ? 'Lời mời đã được chấp nhận.' : 'Lời mời đã bị từ chối.',
          updatedFriendship
        },
        { status: 200 }
      )
    }

    return NextResponse.json({ error: 'Hành động không hợp lệ' }, { status: 400 })
  } catch (error) {
    console.error('FRIENDSHIP API ERROR', error)
    return NextResponse.json({ message: 'Lỗi internal của server', status: 500 }, { status: 500 })
  }
}
