import { Card, CardContent } from '@/components/ui/card'
import CP_Avatar from '../Avatar/Avatar'

interface Friend {
  id: string
  name: string
  image: string | null
  mutualFriends: number
}

export default function SearchFriendBox({ friend }: { friend: Friend }) {
  return (
    <Card className='p-2 flex items-center gap-3 hover:bg-gray-100 cursor-pointer'>
      <CP_Avatar src={friend.image || '/images/placeholder.jpg'} />
      <CardContent className='p-0'>
        <p className='text-sm font-medium'>{friend.name}</p>
        <p className='text-xs text-gray-500'>{friend.mutualFriends ?? 0} mutual friends</p>
      </CardContent>
    </Card>
  )
}
