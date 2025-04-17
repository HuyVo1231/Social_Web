import getCurrentUser from '../users/getCurrentUser'
import prisma from '@/app/libs/prismadb'

const getGroupConversations = async () => {
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

    const filteredConversations = conversations.filter(
      (conversation) => conversation.userIds.length >= 3
    )

    return filteredConversations || []
  } catch (error) {
    console.error(error)
    return []
  }
}

export default getGroupConversations
