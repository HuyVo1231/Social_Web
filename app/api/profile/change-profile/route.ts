import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/users/getCurrentUser'

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, image, location, work, education } = body
    console.log('Image:', image)
    // Lấy người dùng hiện tại từ session
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Cập nhật thông tin người dùng trong database
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name,
        image,
        location,
        work,
        education
      }
    })

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        name: updatedUser.name,
        image: updatedUser.image,
        location: updatedUser.location,
        work: updatedUser.work,
        education: updatedUser.education
      }
    })
  } catch (error) {
    console.error('Lỗi khi cập nhật hồ sơ:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
