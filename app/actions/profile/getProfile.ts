import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/users/getCurrentUser'

interface ProfileParams {
  email?: string
  profileId?: string
}

export async function getProfile({ email, profileId }: ProfileParams = {}) {
  try {
    // 1. Lấy currentUser song song với các thao tác khác nếu có thể
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      throw new Error('Unauthorized')
    }

    const whereCondition = profileId
      ? { id: profileId }
      : email
      ? { email }
      : { id: currentUser.id }

    // 2. Tối ưu truy vấn chính với select thay vì include
    const [user, currentUserFriends] = await Promise.all([
      prisma.user.findUnique({
        where: whereCondition,
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          coverCrop: true,
          imageThumbnail: true,
          phone: true,
          bio: true,
          location: true,
          work: true,
          relationship: true,
          hobbies: true,
          website: true,
          skills: true,
          education: true,
          createdAt: true,
          updatedAt: true,
          imageCrop: true,
          friendshipsInitiated: {
            where: { status: 'ACCEPTED' },
            select: { receiver: { select: { id: true, name: true, image: true } } }
          },
          friendshipsReceived: {
            where: { status: 'ACCEPTED' },
            select: { initiator: { select: { id: true, name: true, image: true } } }
          },
          posts: {
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              body: true,
              image: true,
              createdAt: true,
              updatedAt: true,
              user: { select: { id: true, name: true, image: true } },
              likes: { select: { id: true, userId: true, createdAt: true } },
              comments: {
                select: {
                  id: true,
                  body: true,
                  createdAt: true,
                  user: { select: { id: true, name: true, image: true } }
                }
              }
            }
          }
        }
      }),
      prisma.user.findUnique({
        where: { id: currentUser.id },
        select: {
          friendshipsInitiated: {
            where: { status: 'ACCEPTED' },
            select: { receiver: { select: { id: true, name: true, image: true } } }
          },
          friendshipsReceived: {
            where: { status: 'ACCEPTED' },
            select: { initiator: { select: { id: true, name: true, image: true } } }
          }
        }
      })
    ])

    if (!user) {
      throw new Error('User not found')
    }
    if (!currentUserFriends) {
      throw new Error('Current user not found')
    }

    // 3. Xử lý dữ liệu song song
    const [userFriends, currentUserFriendsList] = await Promise.all([
      Promise.resolve([
        ...user.friendshipsInitiated.map((f) => f.receiver),
        ...user.friendshipsReceived.map((f) => f.initiator)
      ]),
      Promise.resolve([
        ...currentUserFriends.friendshipsInitiated.map((f) => f.receiver),
        ...currentUserFriends.friendshipsReceived.map((f) => f.initiator)
      ])
    ])

    // 4. Tính toán mutual friends hiệu quả hơn
    const currentUserFriendsIds = new Set(currentUserFriendsList.map((f) => f.id))
    const mutualFriends = userFriends.filter((friend) => currentUserFriendsIds.has(friend.id))

    const isOwner = user.id === currentUser.id
    const isFriend = isOwner ? undefined : currentUserFriendsIds.has(user.id)

    // 5. Lọc ảnh hiệu quả
    const photos = user.posts
      .filter((post) => post.image)
      .map((post) => ({
        postId: post.id,
        image: post.image!
      }))

    // 6. Tạo map để tính mutual friends nhanh hơn
    const mutualFriendsMap = new Map(mutualFriends.map((f) => [f.id, f]))

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
        mutualFriends: mutualFriendsMap.has(friend.id) ? 1 : 0 // Giả sử mỗi bạn chỉ có 1 mutual friend
      })),
      mutualFriendsCount: mutualFriends.length,
      posts: user.posts.map((post) => ({
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        likes: post.likes.map((like) => ({
          ...like,
          createdAt: like.createdAt.toISOString()
        })),
        comments: post.comments.map((comment) => ({
          ...comment,
          createdAt: comment.createdAt.toISOString()
        }))
      })),
      photos,
      isFriend
    }
  } catch (error) {
    console.error('Lỗi khi lấy hồ sơ:', error)
    return null
  }
}
