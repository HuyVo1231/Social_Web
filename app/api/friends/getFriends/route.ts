import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/users/getCurrentUser'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Get the current user, if not found, return an empty array
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json([])

    // Fetch friendships where the user is either the initiator or receiver and the status is ACCEPTED
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

    // Get the friends by checking the initiator or receiver based on the current user's role
    const friends = friendships.map((f) =>
      f.initiator.id === currentUser.id ? f.receiver : f.initiator
    )

    if (friends.length === 0) return NextResponse.json([])

    // Fetch the conversations where the current user is part of the conversation
    const conversations = await prisma.conversation.findMany({
      where: {
        isGroup: false,
        userIds: { has: currentUser.id }
      },
      select: {
        id: true,
        userIds: true
      }
    })

    // Create a map of friendId to conversationId for fast lookup
    const conversationMap = new Map<string, string>()
    conversations.forEach((conv) => {
      const friendId = conv.userIds.find((id) => id !== currentUser.id)
      if (friendId) {
        conversationMap.set(friendId, conv.id)
      }
    })

    // Return the list of friends along with their conversationId if available
    const friendsWithConversationId = friends.map((friend) => ({
      ...friend,
      conversationId: conversationMap.get(friend.id) || null
    }))

    return NextResponse.json(friendsWithConversationId || [])
  } catch (error) {
    console.error('Error fetching friends list:', error)
    return NextResponse.json([])
  }
}
