'use client'

import { useEffect, useCallback, useMemo } from 'react'
import useFriendsStore from '@/app/zustand/friendsStore'
import { fetcher } from '@/app/libs/fetcher'
import FriendBox from './FriendBox'

const ListFriends = () => {
  const { friends, setFriends } = useFriendsStore()

  const fetchFriends = useCallback(async () => {
    try {
      const res = await fetcher('/api/friends/getFriends', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      setFriends(res)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bạn bè:', error)
    }
  }, [setFriends])

  useEffect(() => {
    fetchFriends()
  }, [fetchFriends])

  const friendList = useMemo(() => {
    if (!friends || friends.length === 0) {
      return <p className='text-gray-500 text-sm'>Không có bạn bè nào.</p>
    }

    return (
      <div className='space-y-1'>
        {friends.map((user) => (
          <FriendBox key={user.id} name={user.name} avatarUrl={user.image} id={user.id} />
        ))}
      </div>
    )
  }, [friends])

  return (
    <div>
      <h2 className='text-sm font-semibold text-black mb-3 -tracking-tighter'>List Friends</h2>
      {friendList}
    </div>
  )
}

export default ListFriends
