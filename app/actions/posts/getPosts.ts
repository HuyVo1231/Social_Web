import prisma from '@/app/libs/prismadb'

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
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
    return posts
  } catch (error) {
    console.error('GET POSTS ERROR:', error)
    return []
  }
}
