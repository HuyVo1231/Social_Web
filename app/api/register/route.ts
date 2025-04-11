import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import prisma from '@/app/libs/prismadb'
import { sendVerificationEmail } from '@/app/libs/email'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, password } = body

    if (!email || !name || !password) {
      return NextResponse.json(
        { message: 'Vui lòng điền đầy đủ thông tin.', status: 400 },
        { status: 400 }
      )
    }

    // Kiểm tra user đã tồn tại
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ message: 'Tài khoản đã tồn tại.', status: 409 }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // Sử dụng UUID để tạo token xác minh
    const verificationToken = uuidv4()

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        hashPassword: hashedPassword,
        verificationToken
      }
    })

    // Lưu token vào cơ sở dữ liệu
    await prisma.user.update({
      where: { id: newUser.id },
      data: { emailVerified: null, verificationToken }
    })

    // Gửi email xác nhận
    await sendVerificationEmail(email, verificationToken)

    return NextResponse.json(
      {
        message: 'Đăng ký tài khoản thành công. Vui lòng kiểm tra email của bạn để xác nhận.',
        status: 201
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('REGISTRATION ERROR', error)
    return NextResponse.json({ message: 'Lỗi internal của server', status: 500 }, { status: 500 })
  }
}
