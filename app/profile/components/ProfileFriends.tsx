'use client'

import SearchFriendBox from '@/app/components/Friends/SearchFriendBox'
import { ProfileType } from '@/app/types'

interface ProfileFriendsProps {
  profile: ProfileType
}

export default function ProfileFriends({ profile }: ProfileFriendsProps) {
  const { friends } = profile

  if (!friends || friends.length === 0) {
    return <p className='p-4 text-gray-600'>Chưa có bạn bè nào.</p>
  }

  return (
    <div className='p-4'>
      <h3 className='text-lg font-bold text-gray-800 mb-2'>Bạn bè ({friends.length})</h3>
      <ul className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4'>
        {friends.map((user) => (
          <SearchFriendBox key={user.id} friend={user} />
        ))}
      </ul>
    </div>
  )
}
