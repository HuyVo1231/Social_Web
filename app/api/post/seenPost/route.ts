import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'

export async function POST(req: Request) {
  try {
    const { userId, postId } = await req.json()

    // Kiểm tra xem userId và postId có hợp lệ không
    if (!userId || !postId) {
      return NextResponse.json({ error: 'Missing userId or postId' }, { status: 400 })
    }

    // Lấy thông tin người dùng hiện tại để kiểm tra bài post đã xem
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { seenPostIds: true }
    })

    // Nếu không tìm thấy người dùng, trả về lỗi
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Kiểm tra xem bài post đã được xem chưa
    if (user.seenPostIds.includes(postId)) {
      return NextResponse.json({ message: 'Post already marked as seen' })
    }

    // Nếu chưa, cập nhật danh sách bài post đã xem
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        seenPostIds: {
          push: postId // Thêm postId vào danh sách bài post đã xem
        }
      }
    })

    return NextResponse.json({ message: 'Post marked as seen', user: updatedUser })
  } catch (error) {
    console.error('Error marking post as seen:', error)
    return NextResponse.json({ error: 'Error marking post as seen' }, { status: 500 })
  }
}
