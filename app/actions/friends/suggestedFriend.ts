import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/users/getCurrentUser'
import { User } from '@prisma/client'

export async function getSuggestedFriends(): Promise<User[]> {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return []
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
      select: { initiatorId: true, receiverId: true }
    })

    const friendIds = new Set(friendships.flatMap((f) => [f.initiatorId, f.receiverId]))
    friendIds.delete(userId)

    // Lấy danh sách user đã gửi hoặc nhận lời mời kết bạn
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
      // Lấy danh sách bạn của bạn bè
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

      // Loại bỏ user hiện tại, bạn bè đã có, và những người đã gửi hoặc nhận lời mời kết bạn
      potentialFriendIds.delete(userId)
      friendIds.forEach((id) => potentialFriendIds.delete(id))
      sentRequestIds.forEach((id) => potentialFriendIds.delete(id))

      suggestedFriends = await prisma.user.findMany({
        where: { id: { in: [...potentialFriendIds] } },
        take: 4
      })
    }

    // Nếu chưa đủ 4, lấy thêm user khác
    if (suggestedFriends.length < 4) {
      const remaining = 4 - suggestedFriends.length
      const existingUserIds = new Set([
        ...friendIds,
        ...sentRequestIds,
        userId,
        ...suggestedFriends.map((user) => user.id)
      ])

      const additionalUsers = await prisma.user.findMany({
        where: { id: { notIn: [...existingUserIds] } },
        take: remaining,
        orderBy: { createdAt: 'desc' }
      })

      suggestedFriends = [...suggestedFriends, ...additionalUsers]
    }

    return suggestedFriends
  } catch (error) {
    console.error('SUGGESTED FRIENDS ERROR', error)
    return []
  }
}
