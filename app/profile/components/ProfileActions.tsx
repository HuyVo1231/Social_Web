'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { UserPlus, UserCheck, MessageCircle, Clock } from 'lucide-react'
import useProfile from '@/app/hooks/useProfile'
import useChat from '@/app/hooks/useChat'
import { useParams } from 'next/navigation'
import { fetcher } from '@/app/libs/fetcher'
import useFriendsStore from '@/app/zustand/friendsStore'
import toast from 'react-hot-toast'
import { FaUserFriends } from 'react-icons/fa'

export default function ProfileActions({
  friendshipStatus
}: {
  friendshipStatus?: 'ACCEPTED' | 'PENDING' | null
}) {
  const [status, setStatus] = useState(friendshipStatus)
  const { isOwnProfile } = useProfile()
  const { handleChat } = useChat()
  const { profileId } = useParams()
  const removeFriend = useFriendsStore((state) => state.removeFriend)

  const handleAddFriend = async () => {
    if (!profileId) return

    try {
      const response = await fetcher('/api/friends', {
        method: 'POST',
        body: JSON.stringify({ userId: profileId, action: 'send_request' })
      })

      if (!response) {
        throw new Error('Lỗi khi gửi yêu cầu kết bạn')
      }

      setStatus('PENDING')
      toast.success('Đã gửi yêu cầu kết bạn')
    } catch (error) {
      console.error(error)
      toast.error('Gửi yêu cầu thất bại')
    }
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
      setStatus(null)
      toast.success('Đã hủy kết bạn')
    } catch (error) {
      console.error(error)
    }
  }

  const handleCancelRequest = async () => {
    if (!profileId) return

    try {
      const response = await fetcher('/api/friends/unfriend', {
        method: 'POST',
        body: JSON.stringify({ userId: profileId })
      })

      if (!response) {
        throw new Error('Lỗi khi hủy yêu cầu kết bạn')
      }

      setStatus(null)
      toast.success('Đã hủy yêu cầu kết bạn')
    } catch (error) {
      console.error(error)
    }
  }

  if (isOwnProfile) {
    return null
  }

  return (
    <div className='mt-6 flex gap-3'>
      {status === 'ACCEPTED' ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='flex items-center'>
              <UserCheck className='w-4 h-4 mr-2' /> Bạn bè
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='center'>
            <DropdownMenuItem onClick={handleRemoveFriend}>
              <FaUserFriends className='w-4 h-4 mr-2' />
              Hủy kết bạn
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleChat((profileId as string) || '')}>
              <MessageCircle className='w-4 h-4 mr-2' /> Nhắn tin
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : status === 'PENDING' ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='flex items-center'>
              <Clock className='w-4 h-4 mr-2' /> Đã gửi lời mời
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='center'>
            <DropdownMenuItem onClick={handleCancelRequest}>
              <FaUserFriends className='w-4 h-4 mr-2' />
              Hủy yêu cầu
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Button onClick={handleAddFriend} className='flex items-center'>
            <UserPlus className='w-4 h-4 mr-2' /> Thêm bạn
          </Button>
        </>
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
