import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/users/getCurrentUser'

interface User {
  id: string
  name: string | null
  image: string | null
}

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Chưa login.' }, { status: 401 })
    }

    const userId = currentUser.id

    // Lấy danh sách bạn bè hiện tại
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { initiatorId: userId, status: 'ACCEPTED' },
          { receiverId: userId, status: 'ACCEPTED' }
        ]
      },
      select: {
        initiatorId: true,
        receiverId: true
      }
    })

    const friendIds = new Set(friendships.flatMap((f) => [f.initiatorId, f.receiverId]))
    friendIds.delete(userId)

    // Lấy danh sách người đã gửi hoặc nhận lời mời kết bạn từ user
    const sentRequests = await prisma.friendship.findMany({
      where: {
        OR: [
          { initiatorId: userId, status: 'PENDING' },
          { receiverId: userId, status: 'PENDING' }
        ]
      },
      select: { initiatorId: true, receiverId: true }
    })

    const sentRequestIds = new Set(sentRequests.flatMap((f) => [f.initiatorId, f.receiverId]))
    sentRequestIds.delete(userId)

    let suggestedFriends: User[] = []

    if (friendIds.size > 0) {
      // Lấy danh sách bạn bè của bạn bè
      const friendsOfFriends = await prisma.friendship.findMany({
        where: {
          OR: [...friendIds].map((id) => ({
            OR: [
              { initiatorId: id, status: 'ACCEPTED' },
              { receiverId: id, status: 'ACCEPTED' }
            ]
          }))
        },
        select: { initiatorId: true, receiverId: true }
      })

      const potentialFriendIds = new Set(
        friendsOfFriends.flatMap((f) => [f.initiatorId, f.receiverId])
      )

      // Loại bỏ user hiện tại, bạn bè đã có, và những người đã có lời mời kết bạn
      potentialFriendIds.delete(userId)
      friendIds.forEach((id) => potentialFriendIds.delete(id))
      sentRequestIds.forEach((id) => potentialFriendIds.delete(id))

      suggestedFriends = await prisma.user.findMany({
        where: {
          id: { in: [...potentialFriendIds] }
        },
        take: 4,
        select: { id: true, name: true, image: true }
      })
    }

    if (suggestedFriends.length === 0) {
      suggestedFriends = await prisma.user.findMany({
        where: {
          id: { notIn: [...friendIds, ...sentRequestIds, userId] }
        },
        take: 4,
        select: { id: true, name: true, image: true }
      })
    }

    return NextResponse.json(suggestedFriends, { status: 200 })
  } catch (error) {
    console.error('SUGGESTED FRIENDS ERROR', error)
    return NextResponse.json({ message: 'Lỗi internal của server', status: 500 }, { status: 500 })
  }
}
