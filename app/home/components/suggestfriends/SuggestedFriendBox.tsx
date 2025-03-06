import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
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
  const handleAddFriend = () => {
    onAddFriend(id)
  }

  return (
    <div className='flex items-center justify-between gap-3 p-2 bg-white rounded-lg hover:bg-gray-100 cursor-pointer transition '>
      <div className='flex items-center gap-3'>
        <Avatar>
          <Image src={avatarUrl || '/images/placeholder.jpg'} alt='logo' width={40} height={40} />
        </Avatar>
        <span className='text-sm font-medium text-gray-900'>{name}</span>
      </div>
      <Button size={'sm'} onClick={handleAddFriend}>
        Add Friend
      </Button>
    </div>
  )
}

export default SuggestedFriendBox
