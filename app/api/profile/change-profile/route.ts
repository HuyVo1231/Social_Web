import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/users/getCurrentUser'

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { imageThumbnail, coverCrop, avatar, avatarCrop } = body

    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        imageThumbnail, // Cập nhật ảnh bìa
        coverCrop, // Vị trí crop ảnh bìa
        image: avatar, // Cập nhật avatar
        imageCrop: avatarCrop // Vị trí crop avatar
      }
    })

    return NextResponse.json({ message: 'Cập nhật ảnh thành công!' })
  } catch (error) {
    console.error('Lỗi khi cập nhật ảnh:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
