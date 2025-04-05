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
import { useSession } from 'next-auth/react'
import { pusherClient } from '@/app/libs/pusher'

const NotificationPopover = () => {
  const session = useSession()
  const currentUserId = session?.data?.user?.id
  const [notifications, setNotifications] = useState<NotificationType[]>([])
  const { addFriend } = useFriendsStore()

  useEffect(() => {
    if (!currentUserId) return

    const fetchNotifications = async () => {
      try {
        const res = await fetcher('/api/notifications')
        if (res?.notifications) {
          setNotifications(res.notifications)
        }
      } catch (error) {
        console.error('Error fetching notifications', error)
      }
    }

    fetchNotifications()
  }, [currentUserId])

  const updateNotificationStatus = (notificationId: string, newStatus: 'ACCEPTED' | 'REJECTED') => {
    setNotifications((prev) =>
      prev.map((notification) => {
        if (notification.id === notificationId && notification.friendship) {
          return {
            ...notification,
            friendship: {
              ...notification.friendship,
              status: newStatus
            }
          }
        }
        return notification
      })
    )
  }

  const handleFriendRequest = async (
    senderId: string | undefined,
    notificationId: string,
    action: 'accept_request' | 'reject_request'
  ) => {
    if (!senderId) return

    try {
      const res = await fetcher(`/api/friends`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: senderId, action })
      })

      if (action === 'reject_request') {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
        return
      }

      if (res && action === 'accept_request') {
        updateNotificationStatus(notificationId, 'ACCEPTED')
        if (res.updatedFriendship) {
          addFriend(res.updatedFriendship.initiator)
        }
      }
    } catch (error) {
      console.error(`Lỗi khi xử lý lời mời`, error)
    }
  }

  useEffect(() => {
    if (!currentUserId) return

    pusherClient.subscribe(`user-${currentUserId}`)

    const handleFriendRequestUpdate = (data: any) => {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.friendship?.id === data.friendship.id
            ? { ...notification, friendship: data.friendship }
            : notification
        )
      )

      if (data.friendship.status === 'ACCEPTED') {
        addFriend(data.receiver)
      }
    }

    const handleNewNotification = (notification: NotificationType) => {
      setNotifications((prev) => [notification.notification, ...prev])
    }

    pusherClient.bind('friend_request_update', handleFriendRequestUpdate)
    pusherClient.bind('new_notification', handleNewNotification)

    return () => {
      pusherClient.unsubscribe(`user-${currentUserId}`)
      pusherClient.unbind('friend_request_update', handleFriendRequestUpdate)
      pusherClient.unbind('new_notification', handleNewNotification)
    }
  }, [currentUserId])

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
          <div className='grid'>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div key={index}>
                  {notification.type === 'FRIEND_REQUEST' ? (
                    <UserRequestBox
                      data={notification}
                      onAccept={() =>
                        handleFriendRequest(
                          notification.sender?.id,
                          notification.id,
                          'accept_request'
                        )
                      }
                      onReject={() =>
                        handleFriendRequest(
                          notification.sender?.id,
                          notification.id,
                          'reject_request'
                        )
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
