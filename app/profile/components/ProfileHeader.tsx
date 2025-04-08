import { Card } from '@/components/ui/card'
import { Users } from 'lucide-react'
import ProfileCover from './ProfileCover'
import ProfileAvatar from './ProfileAvatar'
import ProfileActions from './ProfileActions'
import { ProfileType } from '@/app/types'

interface ProfileHeaderProps {
  profile: ProfileType
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <Card className='w-full max-w-5xl mx-auto overflow-hidden duration-300'>
      <ProfileCover
        coverUrl={profile.imageThumbnail || '/images/placeholder.jpg'}
        coverCrop={profile.coverCrop}
      />
      <div className='pl-10 bg-gradient-to-b from-white to-gray-50'>
        <div className='flex items-start space-x-4'>
          <ProfileAvatar
            avatarUrl={profile.image || '/images/placeholder.jpg'}
            avatarCrop={profile.imageCrop}
          />
          <div className='flex flex-col flex-grow mt-2'>
            <h2 className='text-2xl font-bold text-gray-800'>
              {profile.name || 'Người dùng ẩn danh'}
            </h2>
            <div className='flex items-center text-gray-700 text-sm mt-1'>
              <Users className='w-4 h-4 mr-2 text-red-500' />
              <span>{profile.friendsCount ?? 0} friends</span>
            </div>
          </div>
          <div className='flex flex-col items-end justify-between'>
            <ProfileActions friendshipStatus={profile.friendshipStatus} />
          </div>
        </div>
      </div>
    </Card>
  )
}
