import getCurrentUser from '@/app/actions/users/getCurrentUser'
import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import { pusherServer } from '@/app/libs/pusher'

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()
    const body = await request.json()

    const { message, conversationId, image, video } = body
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Chưa xác thực', { status: 401 })
    }

    const [newMessage, updatedConversation] = await Promise.all([
      prisma.message.create({
        data: {
          body: message,
          image: image,
          video: video,
          conversation: { connect: { id: conversationId } },
          sender: { connect: { id: currentUser.id } },
          seen: { connect: { id: currentUser.id } }
        },
        include: {
          seen: true,
          sender: true
        }
      }),
      prisma.conversation.update({
        where: { id: conversationId },
        data: {
          lastMessageAt: new Date()
        }
      })
    ])

    pusherServer
      .trigger(conversationId, 'newMessage', newMessage)
      .catch((error) => console.error('Lỗi Pusher', error))

    return NextResponse.json(newMessage)
  } catch (error) {
    console.error('REGISTRATION ERROR', error)
    return NextResponse.json({ message: 'Lỗi internal của server', status: 500 }, { status: 500 })
  }
}
