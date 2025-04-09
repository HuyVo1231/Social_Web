import prisma from '@/app/libs/prismadb'
import getCurrentUser from '../users/getCurrentUser'

export async function getPosts() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) return []

    // Lấy các bài viết của người khác và là công khai (isPrivate = false/null/undefined)
    const publicPostsFromOthers = await prisma.post.findMany({
      where: {
        userId: { not: currentUser.id },
        OR: [{ isPrivate: false }, { isPrivate: null }, { isPrivate: { equals: undefined } }]
      },
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

    // Lấy thông tin friendship
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ initiatorId: currentUser.id }, { receiverId: currentUser.id }]
      }
    })

    // Thêm metadata: friendshipStatus
    const postsWithMetadata = publicPostsFromOthers.map((post) => {
      const friendship = friendships.find(
        (f) =>
          (f.initiatorId === currentUser.id && f.receiverId === post.userId) ||
          (f.initiatorId === post.userId && f.receiverId === currentUser.id)
      )

      return {
        ...post,
        friendshipStatus: friendship ? friendship.status : null
      }
    })

    // Lọc trùng bài viết theo post.id
    const uniquePosts = Array.from(
      new Map(postsWithMetadata.map((post) => [post.id, post])).values()
    )

    // Sắp xếp theo thời gian giảm dần
    const sortedPosts = uniquePosts.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return sortedPosts
  } catch (error) {
    console.error('GET POSTS ERROR:', error)
    return []
  }
}
