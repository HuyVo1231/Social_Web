import prisma from '@/app/libs/prismadb'
import getCurrentUser from '../users/getCurrentUser'

export async function getPosts() {
  try {
    // Lấy thông tin người dùng hiện tại
    const currentUser = await getCurrentUser()

    // Nếu không có người dùng hiện tại, trả về mảng rỗng
    if (!currentUser) return []

    // Lấy danh sách các bài post đã được người dùng xem
    const seenPostIds = currentUser.seenPostIds || []

    // Lấy tất cả các bài post
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' }, // Sắp xếp theo thời gian tạo mới nhất
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

    // Phân loại bài post thành đã xem và chưa xem
    const unseenPosts = posts.filter((post) => !seenPostIds.includes(post.id)) // Bài chưa xem
    const seenPosts = posts.filter((post) => seenPostIds.includes(post.id)) // Bài đã xem

    // Sắp xếp lại để các bài chưa xem ưu tiên ở đầu
    const sortedPosts = [...unseenPosts, ...seenPosts]

    // Đánh dấu bài post là đã xem hay chưa xem
    const postsWithSeenStatus = sortedPosts.map((post) => ({
      ...post,
      seen: seenPostIds.includes(post.id) // Kiểm tra xem bài post có trong danh sách đã xem không
    }))

    return postsWithSeenStatus
  } catch (error) {
    console.error('GET POSTS ERROR:', error)
    return []
  }
}
