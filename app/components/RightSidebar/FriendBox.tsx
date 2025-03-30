import { useRouter } from 'next/navigation'
import React from 'react'
import CP_Avatar from '../Avatar/Avatar'

interface FriendBoxProps {
  name: string | null
  avatarUrl: string | null
  id: string | null
  isOnline?: boolean
}

const FriendBox: React.FC<FriendBoxProps> = ({ name, avatarUrl, id, isOnline }) => {
  const router = useRouter()

  const handleNavigate = () => {
    router.push(`/profile/${id}`)
  }

  return (
    <div
      onClick={handleNavigate}
      className='flex items-center gap-3 bg-gray-100 p-2 rounded-lg hover:bg-gray-200 cursor-pointer transition relative'>
      <div className='relative'>
        <CP_Avatar src={avatarUrl || '/images/placeholder.jpg'} />
        {isOnline && (
          <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full'></span>
        )}
      </div>

      <span className='text-sm font-medium text-gray-900'>{name || 'Unknown'}</span>
    </div>
  )
}

export default FriendBox
