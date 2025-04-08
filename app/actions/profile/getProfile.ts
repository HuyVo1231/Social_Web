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

    const isViewingOwnProfile =
      !profileId && (email === currentUser.email || (!email && !profileId))
    const whereCondition = profileId
      ? { id: profileId }
      : email
      ? { email }
      : { id: currentUser.id }

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
            where: isViewingOwnProfile
              ? {} // No filter for own profile - show all posts
              : {
                  OR: [{ isPrivate: false }, { isPrivate: null }]
                }, // Only public posts for others
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              body: true,
              image: true,
              isPrivate: true,
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
            select: {
              receiverId: true,
              status: true,
              receiver: { select: { id: true, name: true, image: true } }
            }
          },
          friendshipsReceived: {
            select: {
              initiatorId: true,
              status: true,
              initiator: { select: { id: true, name: true, image: true } }
            }
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

    // Get friendship status between current user and profile user
    let friendshipStatus: 'ACCEPTED' | 'PENDING' | 'REJECTED' | 'BLOCKED' | 'NONE' = 'NONE'
    const isOwner = user.id === currentUser.id

    if (!isOwner) {
      // Check if current user initiated friendship
      const initiatedFriendship = currentUserFriends.friendshipsInitiated.find(
        (f) => f.receiverId === user.id
      )

      // Check if current user received friendship request
      const receivedFriendship = currentUserFriends.friendshipsReceived.find(
        (f) => f.initiatorId === user.id
      )

      if (initiatedFriendship) {
        friendshipStatus = initiatedFriendship.status
      } else if (receivedFriendship) {
        friendshipStatus = receivedFriendship.status
      }
    }

    const currentUserFriendsIds = new Set(
      currentUserFriendsList
        .filter(
          (friend) =>
            currentUserFriends.friendshipsInitiated.some(
              (f) => f.receiverId === friend.id && f.status === 'ACCEPTED'
            ) ||
            currentUserFriends.friendshipsReceived.some(
              (f) => f.initiatorId === friend.id && f.status === 'ACCEPTED'
            )
        )
        .map((f) => f.id)
    )

    const mutualFriends = userFriends.filter((friend) => currentUserFriendsIds.has(friend.id))

    const photos = user.posts
      .filter((post) => post.image)
      .map((post) => ({
        postId: post.id,
        image: post.image!
      }))

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
        mutualFriends: mutualFriendsMap.has(friend.id) ? 1 : 0
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
      friendshipStatus: isOwner ? undefined : friendshipStatus
    }
  } catch (error) {
    console.error('Lỗi khi lấy hồ sơ:', error)
    return null
  }
}
