import { getProfile } from '../actions/profile/getProfile'
import ProfilePage from './components/ProfilePage'

export default async function Page() {
  const profile = await getProfile()

  if (!profile) {
    return (
      <div className='flex justify-center items-center h-screen'>Không tìm thấy hồ sơ của bạn.</div>
    )
  }

  return <ProfilePage profile={profile} />
}
