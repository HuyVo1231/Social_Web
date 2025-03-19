import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        likes: true,
        comments: { include: { user: true } }
      }
    })

    return NextResponse.json({ posts }, { status: 200 })
  } catch (error) {
    console.error('GET POSTS ERROR:', error)
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 })
  }
}
