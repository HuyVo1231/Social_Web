'use client'

import { useState } from 'react'
import { MessagesSquare } from 'lucide-react'
import { FullConversationType } from '@/app/types'
import ConversationBox from './ConversationBox'

interface ListConversationProps {
  conversations: FullConversationType[]
}

const ListConversation: React.FC<ListConversationProps> = ({ conversations }) => {
  const [isOpen, setIsOpen] = useState(false)

  const filteredConversations = conversations.filter(
    (conversation) => conversation.messages.length > 0
  )

  return (
    <div className='relative'>
      <button
        className='relative p-2 rounded-full hover:bg-blue-100'
        onClick={() => setIsOpen(!isOpen)}>
        <MessagesSquare className='w-6 h-6 text-gray-800 mt-2' />
      </button>
      {isOpen && (
        <div className='absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-2 max-h-96 overflow-y-auto border'>
          <h3 className='text-lg font-semibold px-2'>Tin nhắn</h3>
          {filteredConversations.length === 0 ? (
            <p className='text-gray-500 text-center py-4'>Không có cuộc trò chuyện nào</p>
          ) : (
            <ul>
              {filteredConversations.map((conversation) => (
                <ConversationBox key={conversation.id} conversation={conversation} />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default ListConversation
