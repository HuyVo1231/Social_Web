import prisma from '@/app/libs/prismadb'
import getCurrentUser from '../users/getCurrentUser'

export async function getPosts() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) return []

    const seenPostIds = currentUser.seenPostIds || []

    // Get current user's posts (regardless of isPrivate status)
    const myPosts = await prisma.post.findMany({
      where: {
        userId: currentUser.id
      },
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
    })

    // Get other users' posts where:
    // - isPrivate is false OR
    // - isPrivate is not set (null/undefined)
    const otherPosts = await prisma.post.findMany({
      where: {
        userId: { not: currentUser.id },
        OR: [{ isPrivate: false }, { isPrivate: null }]
      },
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
    })

    // Combine and sort by creation time (newest first)
    const allPosts = [...myPosts, ...otherPosts].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )

    // Get all friendships where currentUser is either initiator or receiver
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ initiatorId: currentUser.id }, { receiverId: currentUser.id }]
      }
    })

    // Mark seen posts and add friendship status
    const postsWithSeenStatusAndFriendship = await Promise.all(
      allPosts.map(async (post) => {
        // Check if the post belongs to current user
        if (post.userId === currentUser.id) {
          return {
            ...post,
            seen: seenPostIds.includes(post.id),
            friendshipStatus: 'SELF' // Special status for own posts
          }
        }

        // Find friendship between current user and post owner
        const friendship = friendships.find(
          (f) =>
            (f.initiatorId === currentUser.id && f.receiverId === post.userId) ||
            (f.initiatorId === post.userId && f.receiverId === currentUser.id)
        )

        return {
          ...post,
          seen: seenPostIds.includes(post.id),
          friendshipStatus: friendship ? friendship.status : null
        }
      })
    )

    return postsWithSeenStatusAndFriendship
  } catch (error) {
    console.error('GET POSTS ERROR:', error)
    return []
  }
}
