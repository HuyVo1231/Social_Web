import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/users/getCurrentUser'
import { User } from '@prisma/client'

export async function getFriends(userId?: string): Promise<User[]> {
  try {
    let targetUserId = userId

    if (!targetUserId) {
      const currentUser = await getCurrentUser()
      if (!currentUser) return []
      targetUserId = currentUser.id
    }

    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { initiatorId: targetUserId, status: 'ACCEPTED' },
          { receiverId: targetUserId, status: 'ACCEPTED' }
        ]
      },
      select: {
        initiator: true,
        receiver: true
      }
    })

    const friends = friendships.map((f) =>
      f.initiator.id === targetUserId ? f.receiver : f.initiator
    )

    return friends
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bạn bè:', error)
    return []
  }
}
