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
    const { userId, action } = body

    if (!userId) {
      return NextResponse.json({ error: 'Thiếu userId' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'Người dùng không tồn tại.' }, { status: 404 })
    }

    if (action === 'send_request') {
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
          return NextResponse.json({ message: 'Lời mời đã được gửi trước đó.' }, { status: 400 })
        }
        return NextResponse.json({ message: 'Bạn đã là bạn bè với người này.' }, { status: 400 })
      }

      const friendship = await prisma.friendship.create({
        data: { initiatorId: currentUser.id, receiverId: userId, status: 'PENDING' }
      })

      const newNotification = await prisma.notification.create({
        data: {
          type: 'FRIEND_REQUEST',
          content: 'đã gửi lời mời kết bạn.',
          senderId: currentUser.id,
          receiverId: userId,
          friendshipId: friendship.id
        },
        include: {
          sender: true,
          receiver: true,
          friendship: true
        }
      })

      await pusherServer.trigger(`user-${userId}`, 'new_notification', {
        notification: newNotification,
        initiator: newNotification.sender // Thêm initiator vào đây
      })
      return NextResponse.json({ friendship }, { status: 201 })
    }

    if (action === 'accept_request' || action === 'reject_request') {
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

      if (action === 'reject_request') {
        await prisma.friendship.delete({
          where: { id: friendship.id }
        })

        await prisma.notification.deleteMany({
          where: {
            senderId: userId,
            receiverId: currentUser.id,
            type: 'FRIEND_REQUEST'
          }
        })

        return NextResponse.json({ message: 'Đã từ chối lời mời kết bạn.' }, { status: 200 })
      }

      // Xử lý khi chấp nhận lời mời
      const updatedFriendship = await prisma.friendship.update({
        where: { id: friendship.id },
        data: { status: 'ACCEPTED' },
        include: {
          initiator: true,
          receiver: true
        }
      })

      const newNotification = await prisma.notification.create({
        data: {
          type: 'FRIEND_REQUEST',
          content: 'đã chấp nhận lời mời kết bạn.',
          senderId: currentUser.id,
          receiverId: userId,
          friendshipId: friendship.id
        },
        include: {
          sender: true,
          receiver: true,
          friendship: true
        }
      })

      await pusherServer.trigger(`user-${userId}`, 'friend_request_update', {
        message: 'Lời mời kết bạn đã được chấp nhận.',
        friendship: updatedFriendship,
        initiator: updatedFriendship.initiator,
        receiver: updatedFriendship.receiver
      })

      await pusherServer.trigger(`user-${userId}`, 'new_notification', {
        notification: newNotification,
        initiator: newNotification.sender
      })
      return NextResponse.json(
        { message: 'Đã chấp nhận kết bạn.', updatedFriendship },
        { status: 200 }
      )
    }

    return NextResponse.json({ error: 'Hành động không hợp lệ' }, { status: 400 })
  } catch (error) {
    console.error('FRIENDSHIP API ERROR', error)
    return NextResponse.json({ message: 'Lỗi internal của server' }, { status: 500 })
  }
}
