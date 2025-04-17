'use client'

import { useEffect, useState } from 'react'
import FriendBox from './FriendBox'
import activeUsersStore from '@/app/zustand/activeUsers'
import { fetcher } from '@/app/libs/fetcher'
import useFriendsStore from '@/app/zustand/friendsStore'

const ListFriends = () => {
  const { listActiveUser } = activeUsersStore()
  const { friends, setFriends } = useFriendsStore()

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  const handleDropdownToggle = (id: string | null) => {
    setOpenDropdownId((prev) => (prev === id ? null : id))
  }

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetcher('/api/friends/getFriends', {
          method: 'GET'
        })
        if (!response) {
          throw new Error('Failed to fetch friends')
        }
        setFriends(response)
      } catch (error) {
        console.error('Error fetching friends:', error)
      }
    }

    fetchFriends()
  }, [setFriends])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.dropdown-container')) {
        setOpenDropdownId(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const friendList =
    friends.length === 0 ? (
      <p className='text-gray-500 text-sm'>No friends.</p>
    ) : (
      <div className='space-y-1'>
        {friends.map((user) => (
          <FriendBox
            key={user.id}
            name={user.name}
            avatarUrl={user.image}
            id={user.id}
            isOnline={listActiveUser.includes(user.email!)}
            isOpen={openDropdownId === user.id}
            onToggle={() => handleDropdownToggle(user.id)}
          />
        ))}
      </div>
    )

  return (
    <div>
      <h2 className='text-sm font-semibold text-black mb-3 -tracking-tighter'>List Friends</h2>
      {friendList}
    </div>
  )
}

export default ListFriends
