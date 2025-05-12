'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'
import { User } from '@prisma/client'
import AvatarGroup from '@/app/components/Avatar/AvatarGroup'

interface SuggestedGroupChatBoxProps {
  groupId: string
  name: string | null
  users: Pick<User, 'id' | 'name' | 'image'>[]
  friendCount: number
  onJoinGroup: (groupId: string) => void
  loading: boolean
}

const SuggestedGroupChatBox: React.FC<SuggestedGroupChatBoxProps> = ({
  groupId,
  name,
  users,
  friendCount,
  onJoinGroup,
  loading
}) => {
  const router = useRouter()

  const handleNavigate = () => {
    router.push(`/groups/${groupId}`)
  }

  const handleJoinGroup = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!loading) onJoinGroup(groupId)
  }

  return (
    <div
      className='flex items-center justify-between gap-3 p-2 bg-white rounded-lg hover:bg-gray-100 cursor-pointer transition'
      onClick={handleNavigate}>
      <div className='flex items-center gap-3'>
        <div className='flex -space-x-2'>
          <AvatarGroup users={users} />
        </div>
        <div>
          <p className='text-sm font-medium text-gray-900'>{name || 'Unnamed Group'}</p>
          <p className='text-xs text-gray-500'>{friendCount} friends in this group</p>
        </div>
      </div>
      <Button size='sm' onClick={handleJoinGroup} disabled={loading}>
        {loading ? 'Joining...' : 'Join'}
      </Button>
    </div>
  )
}

export default SuggestedGroupChatBox
