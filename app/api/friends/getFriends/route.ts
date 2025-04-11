import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/users/getCurrentUser'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json([])

    // Lấy tất cả các mối quan hệ bạn bè đã được chấp nhận
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

    // Lọc ra danh sách bạn bè: nếu currentUser là initiator thì bạn là receiver, ngược lại
    const friends = friendships.map((f) =>
      f.initiator.id === currentUser.id ? f.receiver : f.initiator
    )

    if (friends.length === 0) return NextResponse.json([])

    // Lấy danh sách các cuộc trò chuyện 1-1 mà currentUser đang tham gia
    const conversations = await prisma.conversation.findMany({
      where: {
        isGroup: false, // Chỉ lấy các cuộc trò chuyện cá nhân
        userIds: { has: currentUser.id }
      },
      select: {
        id: true,
        userIds: true
      }
    })

    // Tạo map để ánh xạ bạn bè với conversationId (nếu có)
    const conversationMap = new Map<string, string>()
    conversations.forEach((conv) => {
      const friendId = conv.userIds.find((id) => id !== currentUser.id)
      if (friendId) {
        conversationMap.set(friendId, conv.id)
      }
    })

    // Gắn conversationId tương ứng (nếu có) cho từng người bạn
    const friendsWithConversationId = friends.map((friend) => ({
      ...friend,
      conversationId: conversationMap.get(friend.id) || null
    }))

    return NextResponse.json(friendsWithConversationId || [])
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bạn bè:', error)
    return NextResponse.json([])
  }
}
