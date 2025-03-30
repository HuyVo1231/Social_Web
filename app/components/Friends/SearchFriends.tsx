import { Skeleton } from '@/components/ui/skeleton'
import SearchFriendBox from './SearchFriendBox'

interface Friend {
  id: string
  name: string
  image: string
  mutualFriend: number
}

interface SearchFriendsProps {
  friends: Friend[]
  loading: boolean
  query: string
}

export default function SearchFriends({ friends, loading, query }: SearchFriendsProps) {
  if (!query) return null

  return (
    <div className='absolute w-full bg-white shadow-md rounded-lg mt-2 p-2 max-h-60 overflow-y-auto'>
      {loading ? (
        <div className='space-y-2'>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className='h-16 w-full' />
          ))}
        </div>
      ) : friends.length > 0 ? (
        friends.map((friend) => <SearchFriendBox key={friend.id} friend={friend} />)
      ) : (
        <p className='text-center text-sm text-gray-500'>No friends found</p>
      )}
    </div>
  )
}
