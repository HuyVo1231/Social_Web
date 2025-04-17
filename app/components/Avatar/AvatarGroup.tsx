'use client'

import React from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import { User } from '@prisma/client'
import activeUsersStore from '@/app/zustand/activeUsers'

interface AvatarGroupProps {
  users: User[] | null
  size?: number
  avatarSize?: number
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ users, size = 40, avatarSize = 20 }) => {
  const displayedUsers = users?.slice(0, 3) || []
  const { listActiveUser } = activeUsersStore()

  const positionMap: Record<number, string> = {
    0: 'top-0 left-[12px]',
    1: 'bottom-0',
    2: 'bottom-0 right-0'
  }

  const isAnyUserOnline = displayedUsers.some((user) => listActiveUser.includes(user.email!))

  return (
    <div className='relative' style={{ width: size, height: size }}>
      {displayedUsers.map((user, index) => (
        <div
          key={user.id}
          className={clsx('absolute rounded-full overflow-hidden', positionMap[index])}
          style={{ width: avatarSize, height: avatarSize }}>
          <Image
            src={user.image || '/images/placeholder.jpg'}
            alt='avatar'
            fill
            className='object-cover'
          />
        </div>
      ))}
      {isAnyUserOnline && (
        <div className='absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></div>
      )}
    </div>
  )
}

export default AvatarGroup
