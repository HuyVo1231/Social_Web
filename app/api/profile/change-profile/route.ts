import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/users/getCurrentUser'

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      imageThumbnail,
      coverCrop,
      avatar,
      avatarCrop,
      location,
      work,
      education,
      relationship,
      hobbies,
      bio,
      website,
      skills,
      name
    } = body
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        imageThumbnail,
        coverCrop,
        image: avatar,
        imageCrop: avatarCrop,
        location,
        work,
        education,
        relationship,
        hobbies,
        bio,
        website,
        skills,
        name
      }
    })

    return NextResponse.json({ message: 'Cập nhật thông tin thành công!' })
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
