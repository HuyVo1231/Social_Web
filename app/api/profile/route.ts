import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/users/getCurrentUser'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, profileId } = body

    if (!email && !profileId) {
      return NextResponse.json({ error: 'Missing email or profileId' }, { status: 400 })
    }

    // Lấy người dùng hiện tại từ session
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const whereCondition = email ? { email } : { id: profileId }

    const user = await prisma.user.findUnique({
      where: whereCondition,
      include: {
        friendshipsInitiated: { where: { status: 'ACCEPTED' } },
        friendshipsReceived: { where: { status: 'ACCEPTED' } },
        posts: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: true,
            likes: true,
            comments: { include: { user: true } }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Nếu là chính mình thì không cần isFriend
    const isOwner = user.email === currentUser.email

    const friendsCount =
      (user.friendshipsInitiated?.length || 0) + (user.friendshipsReceived?.length || 0)

    return NextResponse.json({
      name: user.name,
      image: user.image,
      location: user.location,
      work: user.work,
      education: user.education,
      friendsCount,
      posts: user.posts,
      isFriend: isOwner ? undefined : true
    })
  } catch (error) {
    console.error('Lỗi khi lấy hồ sơ:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
