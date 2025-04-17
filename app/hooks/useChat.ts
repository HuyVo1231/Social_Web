import { fetcher } from '@/app/libs/fetcher'
import { Message } from '@prisma/client'
import useChatStore from '../zustand/chatStore'

const useChat = () => {
  const { openChats, messages, openChat, addMessage } = useChatStore.getState()

  const handleChat = async (userId: string) => {
    if (!userId) return

    let chat = openChats.find((chat) => chat.user.id === userId)
    let newMessages: Message[] = []

    if (!chat) {
      const response = await fetcher('/api/conversations', {
        method: 'POST',
        body: JSON.stringify({ userId })
      })

      if (response?.id) {
        chat = { conversationId: response.id, user: response.chattingUser }
        openChat(response.id, response.chattingUser)
        newMessages = response.messages ? response.messages : []
      }
    } else {
      openChat(chat.conversationId, chat.user)
    }

    if (chat) {
      const existingMessages = messages[chat.conversationId] || []
      const filteredMessages = newMessages.filter(
        (msg: Message) => !existingMessages.some((existingMsg) => existingMsg.id === msg.id)
      )
      filteredMessages.forEach((msg: Message) => addMessage(chat!.conversationId, msg))
    }
  }

  return { handleChat }
}

export default useChat
