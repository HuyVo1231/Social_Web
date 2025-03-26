import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/users/getCurrentUser'

interface ProfileParams {
  email?: string
  profileId?: string
}

export async function getProfile({ email, profileId }: ProfileParams = {}) {
  try {
    // Lấy người dùng hiện tại từ session
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      throw new Error('Unauthorized')
    }

    // Xác định điều kiện truy vấn dựa trên email hoặc profileId
    const whereCondition = profileId
      ? { id: profileId }
      : email
      ? { email }
      : { id: currentUser.id }

    // Truy vấn thông tin người dùng từ cơ sở dữ liệu
    const user = await prisma.user.findUnique({
      where: whereCondition,
      include: {
        friendshipsInitiated: {
          where: { status: 'ACCEPTED' },
          include: { receiver: true }
        },
        friendshipsReceived: {
          where: { status: 'ACCEPTED' },
          include: { initiator: true }
        },
        posts: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: true,
            likes: true,
            comments: {
              include: {
                user: true
              }
            }
          }
        }
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    // Kiểm tra xem người dùng hiện tại có phải là chủ sở hữu profile không
    const isOwner = user.id === currentUser.id

    // Tính tổng số bạn bè
    const friendsCount =
      (user.friendshipsInitiated?.length || 0) + (user.friendshipsReceived?.length || 0)

    // Tạo danh sách bạn bè
    const friends = [
      ...user.friendshipsInitiated.map((f) => f.receiver),
      ...user.friendshipsReceived.map((f) => f.initiator)
    ]

    // Kiểm tra xem người dùng hiện tại có phải là bạn bè không
    const isFriend = isOwner ? undefined : friends.some((friend) => friend.id === currentUser.id)

    // Trả về dữ liệu profile
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified?.toISOString() || null,
      image: user.image,
      coverCrop: user.coverCrop,
      imageThumbnail: user.imageThumbnail,
      phone: user.phone,
      bio: user.bio,
      location: user.location,
      work: user.work,
      education: user.education,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      friendsCount,
      imageCrop: user.imageCrop,
      friends: friends.map((friend) => ({
        id: friend.id,
        name: friend.name,
        image: friend.image
      })),
      posts: user.posts.map((post) => ({
        id: post.id,
        body: post.body,
        image: post.image,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        user: {
          id: post.user.id,
          name: post.user.name,
          image: post.user.image
        },
        likes: post.likes.map((like) => ({
          id: like.id,
          userId: like.userId,
          createdAt: like.createdAt.toISOString()
        })),
        comments: post.comments.map((comment) => ({
          id: comment.id,
          body: comment.body,
          createdAt: comment.createdAt.toISOString(),
          user: {
            id: comment.user.id,
            name: comment.user.name,
            image: comment.user.image
          }
        }))
      })),
      isFriend
    }
  } catch (error) {
    console.error('Lỗi khi lấy hồ sơ:', error)
    return null
  }
}
