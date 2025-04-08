'use client'

import CP_Avatar from '@/app/components/Avatar/Avatar'
import { format, formatDistanceToNow, isToday } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

interface PostHeaderProps {
  avatar: string
  name: string
  time: Date
  userId: string
  friendShip: 'ACCEPTED' | 'PENDING' | 'SELF' | null
}

export default function PostHeader({ avatar, name, time, userId, friendShip }: PostHeaderProps) {
  const postTime = new Date(time)
  const router = useRouter()
  const { data: session } = useSession()
  const [currentStatus, setCurrentStatus] = useState(friendShip)
  const [isLoading, setIsLoading] = useState(false)

  const formattedTime = isToday(postTime)
    ? `Today at ${format(postTime, 'p')}`
    : formatDistanceToNow(postTime, { addSuffix: true, locale: vi })

  const handleClick = () => {
    router.push(`/profile/${userId}`)
  }

  const handleAddFriend = async () => {
    if (!session?.user?.id) return

    setIsLoading(true)
    try {
      // await sendFriendRequest(session.user.id, userId)
      setCurrentStatus('PENDING')
    } catch (error) {
      console.error('Error sending friend request:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Không hiển thị nút nếu là bài của chính mình hoặc đã là bạn
  if (currentStatus === 'SELF' || currentStatus === 'ACCEPTED') {
    return (
      <div className='flex items-center justify-between p-2 gap-2'>
        <div className='flex items-center gap-2'>
          <div onClick={handleClick} className='cursor-pointer'>
            <CP_Avatar src={avatar} />
          </div>
          <div>
            <p className='font-semibold text-lg'>{name}</p>
            <p className='text-sm text-gray-500'>{formattedTime}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex items-center justify-between p-2 gap-2'>
      <div className='flex items-center gap-2'>
        <div onClick={handleClick} className='cursor-pointer'>
          <CP_Avatar src={avatar} />
        </div>
        <div>
          <p className='font-semibold text-lg'>{name}</p>
          <p className='text-sm text-gray-500'>{formattedTime}</p>
        </div>
      </div>

      {currentStatus === 'PENDING' ? (
        <Button variant='outline' size='sm' disabled>
          Đã gửi lời mời
        </Button>
      ) : (
        <Button variant='default' size='sm' onClick={handleAddFriend}>
          Thêm bạn
        </Button>
      )}
    </div>
  )
}
