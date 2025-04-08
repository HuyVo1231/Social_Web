import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const token = url.searchParams.get('token')

  if (!token) {
    return NextResponse.json({ message: 'Token không hợp lệ' }, { status: 400 })
  }

  try {
    // Tìm người dùng bằng verificationToken
    const user = await prisma.user.findFirst({
      where: { verificationToken: token }
    })

    if (!user) {
      return NextResponse.json({ message: 'Token không hợp lệ hoặc đã hết hạn' }, { status: 400 })
    }

    // Cập nhật emailVerified và xóa verificationToken
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date(), verificationToken: null }
    })

    return NextResponse.json({ message: 'Xác minh email thành công!' }, { status: 200 })
  } catch (error) {
    console.error('Lỗi khi xác minh email:', error)
    return NextResponse.json({ message: 'Lỗi khi xác minh email' }, { status: 500 })
  }
}
