import { NextResponse } from 'next/server'
import getCurrentUser from '@/app/actions/users/getCurrentUser'
import prisma from '@/app/libs/prismadb'

export async function GET() {
  const currentUser = await getCurrentUser()

  if (!currentUser?.id) {
    return NextResponse.json([], { status: 401 })
  }

  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: 'desc'
      },
      where: {
        userIds: {
          has: currentUser.id
        }
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true
          }
        }
      }
    })

    const filteredConversations = conversations.filter(
      (conversation) => conversation.userIds.length >= 3
    )

    return NextResponse.json(filteredConversations)
  } catch (error) {
    console.error('[GET_GROUP_CONVERSATIONS_ERROR]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
