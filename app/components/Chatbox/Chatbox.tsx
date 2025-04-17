'use client'

import { motion } from 'framer-motion'
import useChatStore from '@/app/zustand/chatStore'
import activeUsersStore from '@/app/zustand/activeUsers'
import MessageList from './MessageList'
import FormSendMessage from './FormSendMessage'
import HeaderChatBox from './HeaderChatbox'
import { pusherClient } from '@/app/libs/pusher'
import { useEffect, useMemo } from 'react'
import { Message } from '@prisma/client'
export interface ChatBoxProps {
  conversationId: string
  index: number
  isGroup?: boolean
}

const ChatBox: React.FC<ChatBoxProps> = ({ conversationId, index, isGroup }) => {
  const { messages, addMessage, closeChat, openChats } = useChatStore()
  const { listActiveUser } = activeUsersStore()

  useEffect(() => {
    const channel = pusherClient.subscribe(conversationId)
    channel.bind('newMessage', (newMessage: Message) => {
      addMessage(conversationId, newMessage)
    })

    return () => {
      pusherClient.unsubscribe(conversationId)
    }
  }, [conversationId, addMessage])

  const chatInfo = useMemo(
    () => openChats.find((chat) => chat.conversationId === conversationId),
    [openChats, conversationId]
  )

  if (!chatInfo) return null

  const { user, group, conversationName } = chatInfo
  const isOnline = user?.email ? listActiveUser.includes(user.email) : false
  const rightOffset = 240 + index * 320

  const title = group ? conversationName || 'Nhóm không tên' : user?.name || 'Người dùng'

  return (
    <motion.div
      className='w-[320px] bg-white shadow-lg rounded-lg flex flex-col fixed bottom-5 pointer-events-auto'
      style={{ right: `${rightOffset}px`, minHeight: '400px', maxHeight: '400px' }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}>
      <HeaderChatBox
        user={user}
        isGroup={isGroup}
        members={user || []}
        title={title}
        isOnline={isOnline}
        conversationId={conversationId}
        closeChat={closeChat}
      />

      <MessageList messages={messages[conversationId] || []} />
      <FormSendMessage conversationId={conversationId} />
    </motion.div>
  )
}

export default ChatBox
