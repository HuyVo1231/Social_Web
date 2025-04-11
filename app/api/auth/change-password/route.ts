import bcrypt from 'bcrypt'
import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/users/getCurrentUser'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const currentUser = await getCurrentUser()

  if (!currentUser || !currentUser.email) {
    return new NextResponse('User or email not found', { status: 404 })
  }

  const { oldPassword, newPassword } = await req.json()

  if (!oldPassword || !newPassword) {
    return new NextResponse('Old password and new password are required', { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: currentUser.email },
    select: { hashPassword: true }
  })

  if (!user || !user.hashPassword) {
    return new NextResponse('User not found or password not available', { status: 404 })
  }

  const isPasswordMatch = await bcrypt.compare(oldPassword, user.hashPassword)

  if (!isPasswordMatch) {
    return new NextResponse('Incorrect old password', { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12)

  await prisma.user.update({
    where: { email: currentUser.email },
    data: { hashPassword: hashedPassword }
  })

  return new NextResponse('Password updated successfully', { status: 200 })
}
