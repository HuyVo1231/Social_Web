'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { fetcher } from '@/app/libs/fetcher'
import ProfilePage from '../components/ProfilePage'
import ClipLoader from 'react-spinners/ClipLoader'

export default function Profile() {
  const { profileId } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!profileId) return

    const fetchProfile = async () => {
      try {
        setLoading(true)
        const data = await fetcher('/api/profile', {
          method: 'POST',
          body: JSON.stringify({ profileId })
        })
        setProfile(data)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra'
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [profileId])

  if (loading)
    return (
      <div className='flex justify-center items-center h-screen'>
        <ClipLoader size={50} color='#3498db' />
      </div>
    )

  if (!profile) return <p className='text-center'>Không tìm thấy hồ sơ</p>

  return <ProfilePage profile={profile} />
}
