'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import ProfilePage from './components/ProfilePage'
import { toast } from 'react-hot-toast'
import { fetcher } from '../libs/fetcher'
import ClipLoader from 'react-spinners/ClipLoader'

export default function Page() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!session?.user?.email) return

    const fetchProfile = async () => {
      try {
        setLoading(true)
        const data = await fetcher('/api/profile', {
          method: 'POST',
          body: JSON.stringify({ email: session.user.email })
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
  }, [session?.user?.email])

  if (loading)
    return (
      <div className='flex justify-center items-center h-screen'>
        <ClipLoader size={50} color='#3498db' />
      </div>
    )

  if (!profile) return null

  return <ProfilePage profile={profile} />
}
