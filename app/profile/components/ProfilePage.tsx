import { ProfileType } from '@/app/types'
import ProfileHeader from './ProfileHeader'
import ProfilePosts from './ProfilePosts'

export default function ProfilePage({ profile }: { profile: ProfileType }) {
  if (!profile) return <p className='text-center text-gray-500'>Hồ sơ không tồn tại</p>

  return (
    <div>
      <ProfileHeader profile={profile} />
      <ProfilePosts initPosts={profile.posts} />
    </div>
  )
}
