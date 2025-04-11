import { memo } from 'react'
import { Users } from 'lucide-react'
import { Card } from '@/components/ui/card'
import ProfileCover from './ProfileCover'
import ProfileAvatar from './ProfileAvatar'
import ProfileActions from './ProfileActions'
import { ProfileType } from '@/app/types'

interface ProfileHeaderProps {
  profile: ProfileType
}

const DEFAULT_AVATAR = '/images/placeholder.jpg'
const DEFAULT_NAME = 'Người dùng ẩn danh'

function ProfileHeader({ profile }: ProfileHeaderProps) {
  const {
    imageThumbnail,
    coverCrop,
    image,
    imageCrop,
    name,
    friendsCount = 0,
    friendshipStatus
  } = profile

  return (
    <Card className='w-full max-w-5xl mx-auto overflow-hidden'>
      <ProfileCover coverUrl={imageThumbnail || DEFAULT_AVATAR} coverCrop={coverCrop} />
      <div className='pl-10 bg-gradient-to-b from-white to-gray-50'>
        <div className='flex items-start gap-4'>
          <ProfileAvatar avatarUrl={image || DEFAULT_AVATAR} avatarCrop={imageCrop} />

          <div className='flex-1 mt-2 space-y-1'>
            <h2 className='text-2xl font-bold text-gray-800 line-clamp-1'>
              {name || DEFAULT_NAME}
            </h2>
            <div className='flex items-center text-sm text-gray-700'>
              <Users className='w-4 h-4 mr-2 text-red-500 flex-shrink-0' />
              <span>{friendsCount} friends</span>
            </div>
          </div>

          <div className='flex flex-col items-end'>
            <ProfileActions friendshipStatus={friendshipStatus} />
          </div>
        </div>
      </div>
    </Card>
  )
}

export default memo(ProfileHeader)
