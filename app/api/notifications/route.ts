import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/users/getCurrentUser'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Chưa login.' }, { status: 401 })
    }

    const userId = currentUser.id

    const notifications = await prisma.notification.findMany({
      where: {
        receiverId: userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        sender: true,
        receiver: true,
        friendship: true
      }
    })

    return NextResponse.json({ notifications }, { status: 200 })
  } catch (error) {
    console.error('NOTIFICATIONS ERROR', error)
    return NextResponse.json({ error: 'Lỗi internal của server' }, { status: 500 })
  }
}
