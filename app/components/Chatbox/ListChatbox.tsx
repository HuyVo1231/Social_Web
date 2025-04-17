'use client'

import useChatStore from '@/app/zustand/chatStore'
import ChatBox from './Chatbox'

export default function ListChatBox() {
  const { openChats } = useChatStore()
  return (
    <>
      {openChats.map((chat, index) => (
        <ChatBox
          key={chat.conversationId}
          conversationId={chat.conversationId}
          index={index}
          isGroup={chat.group}
        />
      ))}
    </>
  )
}
