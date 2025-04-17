import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/users/getCurrentUser'
import { FullConversationType } from '@/app/types'

export async function POST(req: Request) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const body = await req.json()
    const { conversationId } = body

    if (!conversationId) {
      return new NextResponse('Missing conversationId', { status: 400 })
    }

    const conversation: FullConversationType | null = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
            sender: true
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    if (!conversation) {
      return new NextResponse('Conversation not found', { status: 404 })
    }

    return NextResponse.json(conversation)
  } catch (error) {
    console.error('Error in getConversationById:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
