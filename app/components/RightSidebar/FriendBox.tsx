'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import CP_Avatar from '../Avatar/Avatar'
import { MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useChat from '@/app/hooks/useChat'

interface FriendBoxProps {
  name: string | null
  avatarUrl: string | null
  id: string | null
  isOnline?: boolean
  isOpen: boolean
  onToggle: () => void
}

const FriendBox: React.FC<FriendBoxProps> = ({
  name,
  avatarUrl,
  id,
  isOnline,
  isOpen,
  onToggle
}) => {
  const router = useRouter()
  const { handleChat } = useChat()

  const handleNavigate = () => {
    router.push(`/profile/${id}`)
  }

  return (
    <div className='relative dropdown-container'>
      <div
        className='flex items-center gap-3 bg-gray-100 p-2 rounded-lg hover:bg-gray-200 cursor-pointer transition relative'
        onClick={onToggle}>
        <div className='relative'>
          <CP_Avatar src={avatarUrl || '/images/placeholder.jpg'} isOnline={isOnline} />
        </div>

        <span className='text-sm font-medium text-gray-900 flex-1 truncate'>
          {name || 'Unknown'}
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
            onClick={() => {
              handleNavigate()
              onToggle()
            }}>
            Xem trang cá nhân
          </Button>
          <Button
            variant='ghost'
            className='w-full justify-start px-4 py-2 text-sm hover:bg-gray-100 text-gray-700'
            onClick={() => {
              handleChat(id || '')
              onToggle()
            }}>
            Nhắn tin
          </Button>
        </div>
      )}
    </div>
  )
}

export default FriendBox
