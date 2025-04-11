'use client'

import { useState } from 'react'
import { User } from '@prisma/client'
import SuggestedFriendBox from './SuggestedFriendBox'
import { Separator } from '@/components/ui/separator'
import { fetcher } from '@/app/libs/fetcher'

interface SuggestedFriendsProps {
  friends: User[]
}

export default function SuggestedFriends({ friends: initialFriends }: SuggestedFriendsProps) {
  const [friends, setFriends] = useState<User[]>(initialFriends)
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({})

  const handleAddFriend = async (userId: string) => {
    if (loading[userId]) return

    setLoading((prev) => ({ ...prev, [userId]: true }))

    try {
      const res = await fetcher(`/api/friends`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'send_request' })
      })
      if (res) {
        setFriends((prevFriends) => prevFriends.filter((friend) => friend.id !== userId))
      } else {
        console.error('Failed to add friend')
      }
    } catch (error) {
      console.error('Error adding friend:', error)
    } finally {
      setLoading((prev) => ({ ...prev, [userId]: false }))
    }
  }

  return (
    <div className='bg-gray-100 rounded-md py-2 px-4 w-full h-auto max-h-[300px] overflow-y-auto lg:block hidden'>
      <h3 className='font-medium text-sm text-gray-900 -tracking-tighter mb-2'>Maybe you know</h3>
      <Separator />
      <div className='flex flex-col gap-2'>
        {friends.length > 0 ? (
          friends.map((user) => (
            <SuggestedFriendBox
              key={user.id}
              id={user.id}
              name={user.name}
              avatarUrl={user.image || '/images/placeholder.jpg'}
              onAddFriend={handleAddFriend}
              loading={loading[user.id] || false}
            />
          ))
        ) : (
          <p className='text-gray-500 text-sm mt-2'>Không có gợi ý bạn bè nào.</p>
        )}
      </div>
    </div>
  )
}
