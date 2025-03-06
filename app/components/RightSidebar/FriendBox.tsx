'use client'

import { Avatar } from '@/components/ui/avatar'
import Image from 'next/image'
import React from 'react'

interface FriendBoxProps {
  name: string | null
  avatarUrl: string | null
}

const FriendBox: React.FC<FriendBoxProps> = ({ name, avatarUrl }) => {
  return (
    <div className='flex items-center gap-3 bg-gray-100 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition'>
      <Avatar>
        <Image src={avatarUrl || '/images/placeholder.jpg'} alt='logo' width={40} height={40} />
      </Avatar>
      <span className='text-sm font-medium text-gray-900'>{name || 'Unknown'}</span>
    </div>
  )
}

export default FriendBox
