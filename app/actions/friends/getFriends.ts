import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/users/getCurrentUser'

export async function getFriends(userId?: string) {
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

    if (friends.length === 0) return []

    // Lấy conversationId nếu có
    const conversations = await prisma.conversation.findMany({
      where: {
        isGroup: false,
        userIds: { has: targetUserId }
      },
      select: {
        id: true,
        userIds: true
      }
    })

    // Tạo map để tra cứu conversation nhanh hơn
    const conversationMap = new Map<string, string>()
    conversations.forEach((conv) => {
      const friendId = conv.userIds.find((id) => id !== targetUserId)
      if (friendId) {
        conversationMap.set(friendId, conv.id)
      }
    })

    // Trả về danh sách bạn bè kèm conversationId nếu có
    return friends.map((friend) => ({
      ...friend,
      conversationId: conversationMap.get(friend.id) || null
    }))
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bạn bè:', error)
    return []
  }
}
