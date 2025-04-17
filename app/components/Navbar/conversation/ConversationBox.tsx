'use client'

import { FC, useState, useEffect } from 'react'
import { FullConversationType } from '@/app/types'
import useOtherUser from '@/app/hooks/useOtherUser'
import CP_Avatar from '../../Avatar/Avatar'
import { format, formatDistanceToNow, isToday } from 'date-fns'
import { vi } from 'date-fns/locale'
import useActiveUsersStore from '@/app/zustand/activeUsers'
import { pusherClient } from '@/app/libs/pusher'
import useChat from '@/app/hooks/useChat'
import useFetchGroupConversation from '@/app/hooks/useFetchGroupConversation'

interface ConversationBoxProps {
  conversation: FullConversationType
}

const ConversationBox: FC<ConversationBoxProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation)
  const [updatedConversation, setUpdatedConversation] = useState(conversation)
  const { handleChat } = useChat()
  const { fetchGroupConversation } = useFetchGroupConversation()
  const { listActiveUser } = useActiveUsersStore()

  const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1]
  const commentTime = lastMessage?.createdAt ? new Date(lastMessage.createdAt) : new Date()
  const formattedTime = isToday(commentTime)
    ? `Hôm nay lúc ${format(commentTime, 'p', { locale: vi })}`
    : formatDistanceToNow(commentTime, { addSuffix: true, locale: vi })

  const isOnline =
    !conversation.isGroup && otherUser?.email ? listActiveUser.includes(otherUser.email) : false

  // Hiển thị avatar
  const displayAvatar = conversation.isGroup
    ? '/images/placeholder.jpg'
    : otherUser?.image || '/images/placeholder.jpg'

  // Hiển thị tên
  const displayName = conversation.isGroup
    ? conversation.name || 'Nhóm'
    : otherUser?.name || 'Người dùng'

  // Hiển thị nội dung tin nhắn
  const displayMessage = lastMessage?.body || 'Hình ảnh'

  const handleClick = () => {
    if (conversation.isGroup) {
      fetchGroupConversation(conversation.id, conversation.name!)
    } else {
      handleChat(otherUser?.id || '')
    }
  }

  useEffect(() => {
    const channel = pusherClient.subscribe(conversation.id)

    const handleNewMessage = (newMessage: any) => {
      setUpdatedConversation((prevConversation) => {
        if (prevConversation.id === newMessage.conversationId) {
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

    return () => {
      channel.unbind('newMessage', handleNewMessage)
      pusherClient.unsubscribe(conversation.id)
    }
  }, [conversation.id])

  return (
    <li
      className='flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition cursor-pointer'
      onClick={handleClick}>
      <CP_Avatar src={displayAvatar} isOnline={isOnline} />

      <div className='flex-1'>
        <p className='text-sm font-medium text-gray-900 truncate'>{displayName}</p>
        <p className='text-xs text-gray-500 truncate max-w-xs'>{displayMessage}</p>
      </div>
      <span className='text-xs text-gray-400'>{formattedTime}</span>
    </li>
  )
}

export default ConversationBox
