import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/users/getCurrentUser'

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 })
    }

    const { body, images } = await req.json()

    if (!body || typeof body !== 'string') {
      return NextResponse.json({ error: 'Nội dung bài viết không hợp lệ.' }, { status: 400 })
    }

    const newPost = await prisma.post.create({
      data: {
        body,
        image: images || [],
        userId: currentUser.id
      },
      include: {
        user: true
      }
    })

    return NextResponse.json({ post: newPost }, { status: 201 })
  } catch (error) {
    console.error('CREATE POST ERROR:', error)
    return NextResponse.json({ error: 'Lỗi server khi tạo bài viết.' }, { status: 500 })
  }
}
