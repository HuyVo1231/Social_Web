'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { UserPlus, UserCheck, MessageCircle } from 'lucide-react'
import useProfile from '@/app/hooks/useProfile'
import useChat from '@/app/hooks/useChat'
import { useParams } from 'next/navigation'
import { fetcher } from '@/app/libs/fetcher'
import useFriendsStore from '@/app/zustand/friendsStore'
import toast from 'react-hot-toast'
import { FaUserFriends } from 'react-icons/fa'

export default function ProfileActions({ isFriend }: { isFriend?: boolean }) {
  const [friend, setFriend] = useState(isFriend)
  const { isOwnProfile } = useProfile()
  const { handleChat } = useChat()
  const { profileId } = useParams()
  const removeFriend = useFriendsStore((state) => state.removeFriend)

  const handleAddFriend = () => {
    setFriend(true)
  }

  const handleRemoveFriend = async () => {
    if (!profileId) return

    try {
      const response = await fetcher('/api/friends/unfriend', {
        method: 'POST',
        body: JSON.stringify({ userId: profileId })
      })

      if (!response) {
        throw new Error('Lỗi khi hủy kết bạn')
      }

      removeFriend(profileId as string)
      setFriend(false)
      toast.success('Đã hủy kết bạn')
    } catch (error) {
      console.error(error)
    }
  }

  if (isOwnProfile) {
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
            <DropdownMenuItem onClick={handleRemoveFriend}>
              {' '}
              <FaUserFriends />
              Hủy kết bạn
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleChat((profileId as string) || '')}>
              <MessageCircle className='w-4 h-4 mr-2' /> Nhắn tin
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={handleAddFriend} className='flex items-center'>
          <UserPlus className='w-4 h-4 mr-2' /> Thêm bạn
        </Button>
      )}
      <Button
        variant='outline'
        className='flex items-center'
        onClick={() => handleChat((profileId as string) || '')}>
        <MessageCircle className='w-4 h-4 mr-2' /> Nhắn tin
      </Button>
    </div>
  )
}
