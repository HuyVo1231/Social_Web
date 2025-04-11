import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/users/getCurrentUser'

export async function GET(req: Request) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')?.trim() || ''

    // Lấy danh sách bạn bè của người dùng hiện tại
    const currentUserFriendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { initiatorId: currentUser.id, status: 'ACCEPTED' },
          { receiverId: currentUser.id, status: 'ACCEPTED' }
        ]
      }
    })

    const currentUserFriendIds = currentUserFriendships.map((f) =>
      f.initiatorId === currentUser.id ? f.receiverId : f.initiatorId
    )

    // Tìm người dùng theo tên nếu có query, ngược lại trả về gợi ý
    const users = await prisma.user.findMany({
      where: {
        id: { not: currentUser.id },
        ...(query && { name: { contains: query, mode: 'insensitive' } })
      },
      include: {
        friendshipsInitiated: true,
        friendshipsReceived: true
      },
      take: 5
    })

    // Tính số bạn chung
    const usersWithMutualFriends = users.map((user) => {
      const userFriendIds = [
        ...user.friendshipsInitiated.map((f) => f.receiverId),
        ...user.friendshipsReceived.map((f) => f.initiatorId)
      ]

      const mutualFriends = userFriendIds.filter((id) => currentUserFriendIds.includes(id))

      return {
        id: user.id,
        name: user.name,
        image: user.image,
        mutualFriends: mutualFriends.length
      }
    })

    // Sắp xếp theo số bạn chung
    usersWithMutualFriends.sort((a, b) => b.mutualFriends - a.mutualFriends)

    return NextResponse.json({ friends: usersWithMutualFriends }, { status: 200 })
  } catch (error) {
    console.error('SEARCH FRIENDS API ERROR', error)
    return NextResponse.json({ message: 'Lỗi internal của server' }, { status: 500 })
  }
}
