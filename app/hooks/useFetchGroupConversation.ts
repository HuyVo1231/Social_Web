import { useState } from 'react'
import { fetcher } from '@/app/libs/fetcher'
import useChatStore from '@/app/zustand/chatStore'

const useFetchGroupConversation = () => {
  const [loading, setLoading] = useState(false)
  const { openChat, addMessage } = useChatStore()

  const fetchGroupConversation = async (id: string, name?: string) => {
    setLoading(true)
    try {
      const response = await fetcher('/api/conversations/getConversationById', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: id })
      })

      if (!response || !response.id) {
        console.error('Không tìm thấy cuộc trò chuyện:', response?.statusText)
        return
      }

      openChat(response.id, response.users, true, response.name || name)

      if (response.messages) {
        response.messages.forEach((msg) => addMessage(response.id, msg))
      }
    } catch (error) {
      console.error('Lỗi khi fetch cuộc trò chuyện:', error)
    } finally {
      setLoading(false)
    }
  }

  return { fetchGroupConversation, loading }
}

export default useFetchGroupConversation
