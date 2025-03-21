'use client'

import { Card } from '@/components/ui/card'
import { Briefcase, GraduationCap, MapPin, Users } from 'lucide-react'
import ProfileCover from './ProfileCover'
import ProfileAvatar from './ProfileAvatar'
import ProfileActions from './ProfileActions'
import { ProfileType } from '@/app/types'
import { useMemo } from 'react'

interface ProfileHeaderProps {
  profile: ProfileType
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const name = useMemo(() => profile.name || 'Người dùng ẩn danh', [profile.name])

  const location = useMemo(
    () => profile.location || 'Không có thông tin địa điểm',
    [profile.location]
  )
  const education = useMemo(
    () => profile.education || 'Chưa cập nhật thông tin học vấn',
    [profile.education]
  )
  const work = useMemo(() => profile.work || 'Chưa cập nhật thông tin công việc', [profile.work])
  const friendsCount = useMemo(() => profile.friendsCount ?? 0, [profile.friendsCount])
  const isFriend = useMemo(() => profile.isFriend ?? false, [profile.isFriend])
  const avatarUrl = useMemo(() => profile.image || '/images/placeholder.jpg', [profile.image])
  const coverUrl = useMemo(() => profile.image || '/images/placeholder.jpg', [profile.image])

  return (
    <Card className='w-full max-w-3xl mx-auto rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300'>
      {/* Ảnh bìa */}
      <ProfileCover coverUrl={coverUrl} />

      {/* Thông tin hồ sơ */}
      <div className='p-6 flex flex-col items-center bg-gradient-to-b from-white to-gray-50'>
        {/* Avatar */}
        <ProfileAvatar avatarUrl={avatarUrl} />
        {/* Tên và thông tin cơ bản */}
        <h2 className='text-2xl font-bold mt-4 text-gray-800'>{name}</h2>
        <p className='text-sm text-gray-500 mt-2'>Cho đi là nhận lại</p>
        {/* Thông tin chi tiết */}
        <div className='mt-4 space-y-2 text-gray-700 w-full'>
          <div className='flex items-center p-2 hover:bg-gray-100 rounded transition-colors duration-200'>
            <MapPin className='w-4 h-4 mr-2 text-blue-500' /> <span>{location}</span>
          </div>
          <div className='flex items-center p-2 hover:bg-gray-100 rounded transition-colors duration-200'>
            <Briefcase className='w-4 h-4 mr-2 text-green-500' /> <span>{work}</span>
          </div>
          <div className='flex items-center p-2 hover:bg-gray-100 rounded transition-colors duration-200'>
            <GraduationCap className='w-4 h-4 mr-2 text-purple-500' /> <span>{education}</span>
          </div>
          <div className='flex items-center p-2 hover:bg-gray-100 rounded transition-colors duration-200'>
            <Users className='w-4 h-4 mr-2 text-red-500' /> <span>{friendsCount} bạn bè</span>
          </div>
        </div>
        <ProfileActions isFriend={isFriend} />
      </div>
    </Card>
  )
}
