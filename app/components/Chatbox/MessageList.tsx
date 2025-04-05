'use client'

import { Message } from '@prisma/client'
import { useEffect, useRef } from 'react'
import MessageBox from './MessageBox'

interface MessageListProps {
  messages: Message[]
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
    <div className='flex-1 p-3 overflow-y-auto space-y-2'>
      {messages.length > 0 ? (
        messages.map((msg: any, index) => <MessageBox key={index} message={msg} />)
      ) : (
        <p className='text-gray-500 text-center'>Chưa có tin nhắn nào.</p>
      )}
      <div ref={chatEndRef} id='chat-end'></div>
    </div>
  )
}

export default MessageList
