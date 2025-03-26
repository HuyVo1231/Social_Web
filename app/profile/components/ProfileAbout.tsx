'use client'

import { Briefcase, GraduationCap, MapPin } from 'lucide-react'
import { ProfileType } from '@/app/types'

interface ProfileAboutProps {
  profile: ProfileType
}

export default function ProfileAbout({ profile }: ProfileAboutProps) {
  return (
    <div className='space-y-2 text-gray-700 pt-4'>
      <div className='flex items-center p-2 hover:bg-gray-100 rounded transition-colors duration-200'>
        <MapPin className='w-4 h-4 mr-2 text-blue-500' />{' '}
        <span>{profile.location || 'Rạch Giá, Viet Nam'}</span>
      </div>
      <div className='flex items-center p-2 hover:bg-gray-100 rounded transition-colors duration-200'>
        <Briefcase className='w-4 h-4 mr-2 text-green-500' />{' '}
        <span>{profile.work || 'Student of Kien Giang University'}</span>
      </div>
      <div className='flex items-center p-2 hover:bg-gray-100 rounded transition-colors duration-200'>
        <GraduationCap className='w-4 h-4 mr-2 text-purple-500' />
        <span>{profile.education || 'Master'}</span>
      </div>
    </div>
  )
}
