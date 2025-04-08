import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/users/getCurrentUser'

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 })
    }

    const { body, images, videos, isPrivate } = await req.json()

    // Kiểm tra dữ liệu hợp lệ
    if (!body && (!images || images.length === 0) && (!videos || videos.length === 0)) {
      return NextResponse.json({ error: 'Bài viết trống.' }, { status: 400 })
    }

    const newPost = await prisma.post.create({
      data: {
        body: body || '',
        image: images || [],
        video: videos || [],
        isPrivate: isPrivate,
        userId: currentUser.id
      },
      include: {
        user: true,
        likes: true,
        comments: {
          include: {
            user: true
          }
        }
      }
    })

    return NextResponse.json({ post: newPost }, { status: 201 })
  } catch (error) {
    console.error('❌ CREATE POST ERROR:', error)
    return NextResponse.json({ error: 'Lỗi server khi tạo bài viết.' }, { status: 500 })
  }
}
