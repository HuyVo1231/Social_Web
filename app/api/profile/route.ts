import { NextRequest, NextResponse } from 'next/server'
import { getProfile } from '@/app/actions/profile/getProfile'

export async function POST(req: NextRequest) {
  try {
    // Lấy dữ liệu từ body của request
    const body = await req.json()
    const { email, profileId } = body

    console.log('profileId:', profileId)

    if (!email && !profileId) {
      return NextResponse.json({ error: 'Missing email or profileId' }, { status: 400 })
    }

    const userProfile = await getProfile({ email, profileId })

    if (!userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(userProfile)
  } catch (error) {
    console.error('Lỗi khi lấy hồ sơ:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
