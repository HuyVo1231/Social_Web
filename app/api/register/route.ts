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

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ message: 'Tài khoản đã tồn tại.', status: 409 }, { status: 409 })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create a verification token
    const verificationToken = uuidv4() // Sử dụng UUID để tạo token xác minh

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        hashPassword: hashedPassword,
        verificationToken
      }
    })

    // Lưu token vào cơ sở dữ liệu (ví dụ: lưu vào một bảng hoặc trong field user)
    await prisma.user.update({
      where: { id: newUser.id },
      data: { emailVerified: null, verificationToken } // Giả sử bạn đã thêm `verificationToken` vào bảng User
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
