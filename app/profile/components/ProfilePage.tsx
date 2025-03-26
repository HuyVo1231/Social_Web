import { ProfileType } from '@/app/types'
import ProfileHeader from './ProfileHeader'
import ProfileTabs from './ProfileTabs'

export default function ProfilePage({ profile }: { profile: ProfileType }) {
  if (!profile) return <p className='text-center text-gray-500'>Hồ sơ không tồn tại</p>

  return (
    <div>
      <ProfileHeader profile={profile} />
      <ProfileTabs profile={profile} />
    </div>
  )
}
