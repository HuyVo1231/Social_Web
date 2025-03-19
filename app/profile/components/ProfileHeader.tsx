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
    <Card className='w-full max-w-3xl mx-auto rounded-lg overflow-hidden'>
      {/* Ảnh bìa */}
      <ProfileCover coverUrl={coverUrl} />

      {/* Thông tin hồ sơ */}
      <div className='p-6 flex flex-col items-center bg-white'>
        {/* Avatar */}
        <ProfileAvatar avatarUrl={avatarUrl} />
        {/* Tên và thông tin cơ bản */}
        <h2 className='text-2xl font-bold mt-4 text-gray-800'>{name}</h2>
        <div className='flex items-center text-gray-600 mt-1'>
          <p className='text-sm text-gray-500 mt-2'>Cho đi là nhận lại</p>
        </div>
        {/* Thông tin chi tiết */}
        <div className='mt-4 space-y-2 text-gray-700'>
          <div className='flex items-center'>
            <MapPin className='w-4 h-4 mr-1' /> <span>{location}</span>
          </div>
          <div className='flex items-center'>
            <Briefcase className='w-4 h-4 mr-2' /> <span>{work}</span>
          </div>
          <div className='flex items-center'>
            <GraduationCap className='w-4 h-4 mr-2' /> <span>{education}</span>
          </div>
          <div className='flex items-center'>
            <Users className='w-4 h-4 mr-2' /> <span>{friendsCount} bạn bè</span>
          </div>
        </div>
        {/* Nút thao tác */}
        <ProfileActions isFriend={isFriend} />
      </div>
    </Card>
  )
}
