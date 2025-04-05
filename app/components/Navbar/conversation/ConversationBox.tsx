'use client'

import { FC, useState, useEffect } from 'react'
import { FullConversationType } from '@/app/types'
import useOtherUser from '@/app/hooks/useOtherUser'
import CP_Avatar from '../../Avatar/Avatar'
import useChat from '@/app/hooks/useChat'
import { format, formatDistanceToNow, isToday } from 'date-fns'
import { vi } from 'date-fns/locale'
import useActiveUsersStore from '@/app/zustand/activeUsers'
import { pusherClient } from '@/app/libs/pusher'

interface ConversationBoxProps {
  conversation: FullConversationType
}

const ConversationBox: FC<ConversationBoxProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation)
  const { handleChat } = useChat()
  const { listActiveUser } = useActiveUsersStore()

  const [updatedConversation, setUpdatedConversation] = useState(conversation)

  const lastMessage = updatedConversation.messages[0]

  // Kiểm tra thời gian comment
  const commentTime = lastMessage?.createdAt ? new Date(lastMessage.createdAt) : new Date()

  // Định dạng thời gian hiển thị
  const formattedTime = isToday(commentTime)
    ? `Hôm nay lúc ${format(commentTime, 'p', { locale: vi })}`
    : formatDistanceToNow(commentTime, { addSuffix: true, locale: vi })

  const isOnline = otherUser?.email ? listActiveUser.includes(otherUser.email) : false

  useEffect(() => {
    // Đăng ký Pusher cho mỗi conversationId
    const channel = pusherClient.subscribe(conversation.id)

    // Lắng nghe sự kiện 'newMessage' từ Pusher
    const handleNewMessage = (newMessage: any) => {
      setUpdatedConversation((prevConversation) => {
        if (prevConversation.id === newMessage.conversationId) {
          // Cập nhật lại messages và thời gian của tin nhắn cuối cùng
          return {
            ...prevConversation,
            messages: [newMessage, ...prevConversation.messages],
            lastMessageAt: new Date()
          }
        }
        return prevConversation
      })
    }

    channel.bind('newMessage', handleNewMessage)

    // Dọn dẹp khi component unmount
    return () => {
      channel.unbind('newMessage', handleNewMessage)
      pusherClient.unsubscribe(conversation.id)
    }
  }, [conversation.id])

  return (
    <li
      className='flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition cursor-pointer'
      onClick={() => handleChat(otherUser?.id || '')}>
      <CP_Avatar src={otherUser?.image || '/images/placeholder.jpg'} isOnline={isOnline} />

      <div className='flex-1'>
        <p className='text-sm font-medium text-gray-900 truncate'>
          {otherUser?.name || 'Người dùng'}
        </p>
        <p className='text-xs text-gray-500 truncate max-w-xs'>{lastMessage?.body || 'Hình ảnh'}</p>
      </div>
      <span className='text-xs text-gray-400'>{formattedTime}</span>
    </li>
  )
}

export default ConversationBox
