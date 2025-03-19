import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/users/getCurrentUser'

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 })
    }

    const { postId, type, commentBody } = await req.json()
    if (!postId || typeof postId !== 'string') {
      return NextResponse.json({ error: 'ID bài viết không hợp lệ.' }, { status: 400 })
    }

    let response

    if (type === 'like') {
      // Kiểm tra xem đã like chưa
      const existingLike = await prisma.like.findFirst({
        where: { userId: currentUser.id, postId }
      })

      if (existingLike) {
        // Nếu đã like, thì unlike
        await prisma.like.delete({ where: { id: existingLike.id } })
        response = { message: 'Đã bỏ thích.' }
      } else {
        // Nếu chưa like, thì thêm like
        const newLike = await prisma.like.create({
          data: { userId: currentUser.id, postId }
        })
        response = { like: newLike }
      }
    } else if (type === 'comment') {
      if (!commentBody || typeof commentBody !== 'string') {
        return NextResponse.json({ error: 'Nội dung bình luận không hợp lệ.' }, { status: 400 })
      }

      // Thêm bình luận và trả về kèm user
      const newComment = await prisma.comment.create({
        data: {
          body: commentBody,
          userId: currentUser.id,
          postId
        },
        include: {
          user: true
        }
      })

      response = { comment: newComment }
    } else {
      return NextResponse.json({ error: 'Loại hành động không hợp lệ.' }, { status: 400 })
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('LIKE/COMMENT ERROR:', error)
    return NextResponse.json({ error: 'Lỗi server.' }, { status: 500 })
  }
}
