import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/users/getCurrentUser'

interface ProfileParams {
  email?: string
  profileId?: string
}

export async function getProfile({ email, profileId }: ProfileParams = {}) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      throw new Error('Unauthorized')
    }

    const whereCondition = profileId
      ? { id: profileId }
      : email
      ? { email }
      : { id: currentUser.id }

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

    const isOwner = user.id === currentUser.id

    const userFriends = [
      ...user.friendshipsInitiated.map((f) => f.receiver),
      ...user.friendshipsReceived.map((f) => f.initiator)
    ]

    const currentUserFriends = await prisma.user.findUnique({
      where: { id: currentUser.id },
      include: {
        friendshipsInitiated: {
          where: { status: 'ACCEPTED' },
          include: { receiver: true }
        },
        friendshipsReceived: {
          where: { status: 'ACCEPTED' },
          include: { initiator: true }
        }
      }
    })

    if (!currentUserFriends) {
      throw new Error('Current user not found')
    }

    const currentUserFriendsList = [
      ...currentUserFriends.friendshipsInitiated.map((f) => f.receiver),
      ...currentUserFriends.friendshipsReceived.map((f) => f.initiator)
    ]

    // Tính số bạn chung
    const mutualFriends = userFriends.filter((friend) =>
      currentUserFriendsList.some((f) => f.id === friend.id)
    )

    const isFriend = isOwner
      ? undefined
      : userFriends.some((friend) => friend.id === currentUser.id)

    // Lấy danh sách ảnh từ bài viết (lọc những bài có ảnh hợp lệ)
    const photos = user.posts
      .filter((post) => post.image) // Chỉ lấy post có ảnh
      .map((post) => ({
        postId: post.id,
        image: post.image!
      }))

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
      work: user.work || 'Đang làm student',
      relationship: user.relationship,
      hobbies: user.hobbies,
      website: user.website,
      skills: user.skills,
      education: user.education,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      friendsCount: userFriends.length,
      imageCrop: user.imageCrop,
      friends: userFriends.map((friend) => ({
        id: friend.id,
        name: friend.name,
        image: friend.image,
        mutualFriends: mutualFriends.filter((mf) => mf.id === friend.id).length // Số bạn chung với từng bạn bè
      })),
      mutualFriendsCount: mutualFriends.length, // Tổng số bạn chung
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
      photos, // ✅ Thêm danh sách ảnh từ bài viết
      isFriend
    }
  } catch (error) {
    console.error('Lỗi khi lấy hồ sơ:', error)
    return null
  }
}
