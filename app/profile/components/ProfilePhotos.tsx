'use client'

import { ProfileType } from '@/app/types'
import Image from 'next/image'

interface ProfilePhotosProps {
  profile: ProfileType
}

export default function ProfilePhotos({ profile }: ProfilePhotosProps) {
  return (
    <div className='grid grid-cols-3 gap-4 p-4'>
      {profile.photos && profile.photos.length > 0 ? (
        profile.photos.map((photo, index) => (
          <Image
            key={index}
            src={photo}
            alt={`Photo ${index}`}
            className='w-full h-auto rounded-lg'
          />
        ))
      ) : (
        <p className='text-gray-500'>Chưa có ảnh nào.</p>
      )}
    </div>
  )
}
