'use client'

import React from 'react'
import CP_Avatar from '../Avatar/Avatar'
import { MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useFetchGroupConversation from '@/app/hooks/useFetchGroupConversation'

interface GroupChatBoxProps {
  name: string
  avatarUrl: string
  id: string
  isOpen: boolean
  onToggle: () => void
}

const GroupChatBox: React.FC<GroupChatBoxProps> = ({ name, avatarUrl, id, isOpen, onToggle }) => {
  const { fetchGroupConversation, loading } = useFetchGroupConversation()

  const handleClick = () => {
    onToggle()
    fetchGroupConversation(id, name)
  }

  return (
    <div className='relative dropdown-container'>
      <div
        className='flex items-center gap-3 bg-gray-100 p-2 rounded-lg hover:bg-gray-200 cursor-pointer transition relative'
        onClick={onToggle}>
        <div className='relative'>
          <CP_Avatar src={avatarUrl || '/images/group-placeholder.png'} />
        </div>

        <span className='text-sm font-medium text-gray-900 flex-1 truncate'>
          {name || 'Nhóm không tên'}
        </span>

        <Button
          variant='ghost'
          size='icon'
          className='p-0 rounded-full hover:bg-gray-200'
          onClick={(e) => {
            e.stopPropagation()
            onToggle()
          }}>
          <MoreVertical size={18} className='text-gray-600' />
        </Button>
      </div>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10'>
          <Button
            variant='ghost'
            className='w-full justify-start px-4 py-2 text-sm hover:bg-gray-100 text-gray-700'
            onClick={handleClick}>
            {loading ? 'Đang tải...' : 'Nhắn tin'}
          </Button>
        </div>
      )}
    </div>
  )
}

export default GroupChatBox
