'use client'

import { fetcher } from '@/app/libs/fetcher'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Bell } from 'lucide-react'
import { useEffect, useState } from 'react'
import UserRequestBox from './UserRequestBox'
import PostBox from './PostBox'
import { NotificationType } from '@/app/types'
import { Separator } from '@/components/ui/separator'
import useFriendsStore from '@/app/zustand/friendsStore'

const NotificationPopover = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([])
  const { addFriend } = useFriendsStore()

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetcher('/api/notifications')
        if (res && res.notifications) {
          setNotifications(res.notifications)
        }
      } catch (error) {
        console.error('Error fetching notifications', error)
      }
    }

    fetchNotifications()
  }, [])

  const updateNotificationStatus = (notificationId: string, newStatus: 'ACCEPTED' | 'REJECTED') => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? {
              ...notification,
              friendship: {
                ...notification.friendship,
                status: newStatus
              }
            }
          : notification
      )
    )
  }

  const handleAcceptFriendRequest = async (
    senderId: string | undefined,
    notificationId: string
  ) => {
    if (!senderId) return

    try {
      const res = await fetcher(`/api/friends`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: senderId, action: 'accept_request' })
      })
      if (res) {
        updateNotificationStatus(notificationId, 'ACCEPTED')
        addFriend({
          id: senderId,
          name: res.updatedFriendship.initiator.name,
          image: res.updatedFriendship.initiator.image
        })
      }
    } catch (error) {
      console.error('Lỗi khi chấp nhận lời mời kết bạn', error)
    }
  }

  const handleRejectFriendRequest = async (
    senderId: string | undefined,
    notificationId: string
  ) => {
    if (!senderId) return

    try {
      const res = await fetcher(`/api/friends`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: senderId, action: 'reject_request' })
      })

      if (res) {
        updateNotificationStatus(notificationId, 'REJECTED')
      }
    } catch (error) {
      console.error('Lỗi khi từ chối lời mời kết bạn', error)
    }
  }

  return (
    <div className='flex items-center'>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='ghost' className='relative p-2 rounded-full'>
            <Bell className='w-5 h-5 text-gray-600' />
            {notifications.length > 0 && (
              <span className='absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full' />
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className='w-auto'>
          <div className='grid '>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification.id}>
                  {notification.type === 'FRIEND_REQUEST' ? (
                    <UserRequestBox
                      data={notification}
                      onAccept={() =>
                        handleAcceptFriendRequest(notification.sender?.id, notification.id)
                      }
                      onReject={() =>
                        handleRejectFriendRequest(notification.sender?.id, notification.id)
                      }
                    />
                  ) : (
                    <PostBox
                      postAuthor={notification.sender?.name || 'Unknown'}
                      postAuthorAvatar={notification.sender?.image || '/images/placeholder.jpg'}
                      postContent={notification.content}
                      postUrl='#'
                    />
                  )}
                </div>
              ))
            ) : (
              <p className='text-sm text-muted-foreground'>Không có thông báo nào</p>
            )}
          </div>
          <Separator />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default NotificationPopover
