import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/users/getCurrentUser'
import { User } from '@prisma/client'

export async function getFriends(): Promise<User[]> {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) return []

    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { initiatorId: currentUser.id, status: 'ACCEPTED' },
          { receiverId: currentUser.id, status: 'ACCEPTED' }
        ]
      },
      select: {
        initiator: true,
        receiver: true
      }
    })

    const friends = friendships.map((f) =>
      f.initiator.id === currentUser.id ? f.receiver : f.initiator
    )

    return friends
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bạn bè:', error)
    return []
  }
}
