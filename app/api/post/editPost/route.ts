import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/users/getCurrentUser'

export async function PUT(request: Request) {
  try {
    // Xác thực người dùng
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Lấy dữ liệu từ body
    const { postId, body, image, video } = await request.json()
    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }

    // Kiểm tra quyền chỉnh sửa
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true }
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (post.userId !== currentUser.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Cập nhật bài post
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        body,
        image,
        video,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(updatedPost, { status: 200 })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
