import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import prisma from '@/app/libs/prismadb'

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

    // Create the new user
    await prisma.user.create({
      data: {
        email,
        name,
        hashPassword: hashedPassword
      }
    })

    return NextResponse.json(
      { message: 'Đăng ký tài khoản thành công', status: 201 },
      { status: 201 }
    )
  } catch (error) {
    console.error('REGISTRATION ERROR', error)
    return NextResponse.json({ message: 'Lỗi internal của server', status: 500 }, { status: 500 })
  }
}
