import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/users/getCurrentUser'
import { User } from '@prisma/client'

type SuggestedGroup = {
  id: string
  name: string | null
  friendCount: number
  users: Pick<User, 'id' | 'name' | 'image'>[]
  lastMessageAt: Date
}

export async function getSuggestedGroupChats(): Promise<SuggestedGroup[]> {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) return []

    const userId = currentUser.id

    // Bước 1: Lấy danh sách bạn bè đã ACCEPTED
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { initiatorId: userId, status: 'ACCEPTED' },
          { receiverId: userId, status: 'ACCEPTED' }
        ]
      },
      select: { initiatorId: true, receiverId: true }
    })

    const friendIds = new Set(
      friendships.map((f) => (f.initiatorId === userId ? f.receiverId : f.initiatorId))
    )

    if (friendIds.size === 0) return []

    // Bước 2: Lấy các conversation dạng group mà có ít nhất 1 bạn bè trong đó
    const groupConversations = await prisma.conversation.findMany({
      where: {
        isGroup: true,
        userIds: {
          hasSome: [...friendIds]
        }
      },
      select: {
        id: true,
        name: true,
        lastMessageAt: true,
        userIds: true,
        users: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    // Bước 3: Lọc ra các group mà user chưa tham gia
    const filteredGroups = groupConversations.filter((group) => !group.userIds.includes(userId))

    // Bước 4: Tính số lượng bạn bè tham gia mỗi group và lọc/sắp xếp
    const suggestedGroups: SuggestedGroup[] = filteredGroups
      .map((group) => {
        const friendCount = group.users.filter((u) => friendIds.has(u.id)).length
        return {
          id: group.id,
          name: group.name,
          friendCount,
          users: group.users,
          lastMessageAt: group.lastMessageAt
        }
      })
      .filter((group) => group.friendCount >= 2)
      .sort((a, b) => b.friendCount - a.friendCount)

    return suggestedGroups
  } catch (error) {
    console.error('SUGGESTED GROUP CHATS ERROR', error)
    return []
  }
}
