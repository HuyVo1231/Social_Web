import prisma from '@/app/libs/prismadb'
import getCurrentUser from '../users/getCurrentUser'

export async function getPosts() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) return []

    // 1. Lấy danh sách bạn bè đã chấp nhận
    const acceptedFriendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { initiatorId: currentUser.id, status: 'ACCEPTED' },
          { receiverId: currentUser.id, status: 'ACCEPTED' }
        ]
      }
    })

    const friendIds = acceptedFriendships.map((friendship) =>
      friendship.initiatorId === currentUser.id ? friendship.receiverId : friendship.initiatorId
    )

    // 2. Lấy danh sách người bị chặn hoặc từ chối
    const blockedOrRejected = await prisma.friendship.findMany({
      where: {
        OR: [
          { initiatorId: currentUser.id, status: { in: ['BLOCKED', 'REJECTED'] } },
          { receiverId: currentUser.id, status: { in: ['BLOCKED', 'REJECTED'] } }
        ]
      }
    })

    const blockedUserIds = blockedOrRejected.map((friendship) =>
      friendship.initiatorId === currentUser.id ? friendship.receiverId : friendship.initiatorId
    )

    // 3. Lấy bài viết với logic:
    // - Bài viết từ bạn bè: hiển thị cả private và public
    // - Bài viết từ người không phải bạn bè: CHỈ hiển thị public (isPrivate = false hoặc null/undefined)
    // - KHÔNG hiển thị bài từ người bị chặn/từ chối
    const posts = await prisma.post.findMany({
      where: {
        AND: [
          { userId: { not: currentUser.id } }, // Không lấy bài của chính mình
          { userId: { notIn: blockedUserIds } }, // Không lấy bài từ người bị chặn
          {
            OR: [
              // Bài từ bạn bè - hiển thị cả private và public
              { userId: { in: friendIds } },
              // Bài từ người không phải bạn bè - chỉ hiển thị public
              {
                AND: [
                  { userId: { notIn: friendIds } },
                  {
                    OR: [
                      { isPrivate: false },
                      { isPrivate: null },
                      { isPrivate: { equals: undefined } }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      include: {
        user: true,
        likes: true,
        comments: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // 4. Thêm metadata về tương tác (để sau này có thể sắp xếp theo độ tương tác)
    const postsWithMetadata = posts.map((post) => {
      // Kiểm tra quan hệ bạn bè
      const isFriend = friendIds.includes(post.userId)

      // Tính toán số lượng like và comment
      const likeCount = post.likes.length
      const commentCount = post.comments.length

      // Kiểm tra xem currentUser đã like bài này chưa
      const isLiked = post.likes.some((like) => like.userId === currentUser.id)

      return {
        ...post,
        isFriend,
        likeCount,
        commentCount,
        isLiked
        // Có thể thêm các metadata khác nếu cần
      }
    })

    // 5. Sắp xếp lại theo logic ưu tiên:
    // - Bài từ bạn bè
    // - Bài có nhiều tương tác (like + comment)
    // - Bài mới nhất
    return postsWithMetadata.sort((a, b) => {
      // Ưu tiên bài từ bạn bè
      if (a.isFriend && !b.isFriend) return -1
      if (!a.isFriend && b.isFriend) return 1

      // Nếu cùng là bạn bè hoặc không, xét theo tương tác
      const aInteraction = a.likeCount + a.commentCount
      const bInteraction = b.likeCount + b.commentCount
      if (aInteraction !== bInteraction) return bInteraction - aInteraction

      // Cuối cùng xét theo thời gian
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  } catch (error) {
    console.error('GET POSTS ERROR:', error)
    return []
  }
}
