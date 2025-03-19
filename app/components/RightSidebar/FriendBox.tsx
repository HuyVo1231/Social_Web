'use client'

import { Avatar } from '@/components/ui/avatar'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import CP_Avatar from '../Avatar/Avatar'

interface FriendBoxProps {
  name: string | null
  avatarUrl: string | null
  id: string | null
}

const FriendBox: React.FC<FriendBoxProps> = ({ name, avatarUrl, id }) => {
  const router = useRouter()

  const handleNavigate = () => {
    router.push(`/profile/${id}`)
  }
  return (
    <div
      onClick={handleNavigate}
      className='flex items-center gap-3 bg-gray-100 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition'>
      <CP_Avatar src={avatarUrl || '/images/placeholder.jpg'} />
      <span className='text-sm font-medium text-gray-900'>{name || 'Unknown'}</span>
    </div>
  )
}

export default FriendBox
