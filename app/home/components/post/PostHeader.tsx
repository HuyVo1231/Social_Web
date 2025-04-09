'use client'

import CP_Avatar from '@/app/components/Avatar/Avatar'
import { format, formatDistanceToNow, isToday } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { fetcher } from '@/app/libs/fetcher'
import toast from 'react-hot-toast'

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
  const [isLoading, setIsLoading] = useState(false)

  const isSelf = session?.user?.id === userId
  const [currentStatus, setCurrentStatus] = useState<'ACCEPTED' | 'PENDING' | 'SELF' | null>(
    isSelf ? 'SELF' : friendShip
  )

  const formattedTime = isToday(postTime)
    ? `Hôm nay lúc ${format(postTime, 'HH:mm')}`
    : formatDistanceToNow(postTime, { addSuffix: true, locale: vi })

  const handleClick = () => {
    router.push(`/profile/${userId}`)
  }

  const handleAddFriend = async () => {
    if (!session?.user?.id) return

    setIsLoading(true)
    try {
      const response = await fetcher('/api/friends', {
        method: 'POST',
        body: JSON.stringify({ userId: userId, action: 'send_request' })
      })

      if (!response) {
        throw new Error('Lỗi khi gửi yêu cầu kết bạn')
      }

      toast.success('Đã gửi yêu cầu kết bạn')
      setCurrentStatus('PENDING')
    } catch (error) {
      console.error('Error sending friend request:', error)
      toast.error('Gửi yêu cầu thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-between p-2 gap-2'>
      <div className='flex items-center gap-2 flex-1 min-w-0'>
        <div onClick={handleClick} className='cursor-pointer'>
          <CP_Avatar src={avatar} />
        </div>

        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-2'>
            <p
              onClick={handleClick}
              className='font-semibold text-lg truncate cursor-pointer hover:underline'>
              {name}
            </p>

            {/* Friend status / actions */}
            {!isSelf && currentStatus === null && (
              <Button
                variant='ghost'
                size='sm'
                onClick={handleAddFriend}
                disabled={isLoading}
                className='h-6 px-2 text-xs text-blue-500 hover:text-blue-600 hover:bg-blue-50'>
                {isLoading ? 'Đang gửi...' : 'Thêm bạn'}
              </Button>
            )}

            {!isSelf && currentStatus === 'PENDING' && (
              <span className='text-xs text-gray-500 px-2'>• Đã gửi lời mời</span>
            )}

            {!isSelf && currentStatus === 'ACCEPTED' && (
              <span className='text-xs text-gray-500 px-2'>• Bạn bè</span>
            )}
          </div>

          <p className='text-sm text-gray-500'>{formattedTime}</p>
        </div>
      </div>
    </div>
  )
}
