import getCurrentUser from '../users/getCurrentUser'
import prisma from '@/app/libs/prismadb'

const getConversations = async () => {
  const currentUser = await getCurrentUser()

  if (!currentUser?.id) {
    return []
  }

  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: 'desc'
      },
      where: {
        userIds: {
          has: currentUser.id
        }
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true
          }
        }
      }
    })

    // Loại bỏ trùng theo id
    const uniqueConversations = Array.from(new Map(conversations.map((c) => [c.id, c])).values())
    return uniqueConversations
  } catch (error) {
    console.error(error)
    return []
  }
}

export default getConversations
