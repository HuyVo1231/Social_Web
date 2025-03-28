'use client'

import { useMemo } from 'react'
import FriendBox from './FriendBox'
import { User } from '@prisma/client'

interface ListFriendsProps {
  friends: User[]
}

const ListFriends: React.FC<ListFriendsProps> = ({ friends }) => {
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
