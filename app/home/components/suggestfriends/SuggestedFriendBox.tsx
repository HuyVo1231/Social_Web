'use client'

import CP_Avatar from '@/app/components/Avatar/Avatar'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

interface SuggestedFriendBoxProps {
  id: string
  name: string | null
  avatarUrl: string | null
  onAddFriend: (id: string) => void
}

const SuggestedFriendBox: React.FC<SuggestedFriendBoxProps> = ({
  id,
  name,
  avatarUrl,
  onAddFriend
}) => {
  const router = useRouter()

  const handleNavigate = () => {
    router.push(`/profile/${id}`)
  }

  const handleAddFriend = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddFriend(id)
  }

  return (
    <div className='flex items-center justify-between gap-3 p-2 bg-white rounded-lg hover:bg-gray-100 cursor-pointer transition'>
      <div className='flex items-center gap-3' onClick={handleNavigate}>
        <CP_Avatar src={avatarUrl || '/images/placeholder.jpg'} />
        <span className='text-sm font-medium text-gray-900'>{name}</span>
      </div>
      <Button size={'sm'} onClick={handleAddFriend}>
        Add Friend
      </Button>
    </div>
  )
}

export default SuggestedFriendBox
