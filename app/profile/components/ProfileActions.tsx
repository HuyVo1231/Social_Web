'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { UserPlus, UserCheck, MessageCircle } from 'lucide-react'

export default function ProfileActions({ isFriend }: { isFriend?: boolean }) {
  console.log('isFriend', isFriend)
  const [friend, setFriend] = useState(isFriend)
  const pathname = usePathname()

  const isCurrentUserProfile = pathname === '/profile'

  const handleAddFriend = () => {
    setFriend(true)
  }

  const handleRemoveFriend = () => {
    setFriend(false)
  }

  const handleMessage = () => {
    console.log('Nhắn tin')
  }

  if (isCurrentUserProfile) {
    return null
  }

  return (
    <div className='mt-6 flex gap-3'>
      {friend ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='flex items-center'>
              <UserCheck className='w-4 h-4 mr-2' /> Bạn bè
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='center'>
            <DropdownMenuItem onClick={handleRemoveFriend}>Hủy kết bạn</DropdownMenuItem>
            <DropdownMenuItem onClick={handleMessage}>
              <MessageCircle className='w-4 h-4 mr-2' /> Nhắn tin
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={handleAddFriend} className='flex items-center'>
          <UserPlus className='w-4 h-4 mr-2' /> Thêm bạn
        </Button>
      )}
      <Button variant='outline' className='flex items-center' onClick={handleMessage}>
        <MessageCircle className='w-4 h-4 mr-2' /> Nhắn tin
      </Button>
    </div>
  )
}
