'use client'

import React from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import { User } from '@prisma/client'
import activeUsersStore from '@/app/zustand/activeUsers'
import { useSession } from 'next-auth/react'

interface AvatarGroupProps {
  users: User[] | null
  size?: number
  avatarSize?: number
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ users, size = 40, avatarSize = 20 }) => {
  const { data: session } = useSession()
  const currentUserEmail = session?.user?.email
  const { listActiveUser } = activeUsersStore()

  const allGroupUsers = users || []
  const displayedUsers = allGroupUsers.slice(0, 3)

  // isSolo = nhóm chỉ có 1 người và người đó là chính mình
  const isSolo = allGroupUsers.length === 1 && allGroupUsers[0].email === currentUserEmail

  // Kiểm tra có bất kỳ user nào trong nhóm đang online (trừ chính mình)
  const isAnyUserOnline = allGroupUsers.some(
    (user) => user.email && user.email !== currentUserEmail && listActiveUser.includes(user.email)
  )

  const positionMap: Record<number, string> = {
    0: 'top-0 left-[12px]',
    1: 'bottom-0',
    2: 'bottom-0 right-0'
  }

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

      {/* Chỉ hiển thị nếu có người online trong nhóm và không phải là nhóm solo */}
      {!isSolo && isAnyUserOnline && (
        <div className='absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></div>
      )}
    </div>
  )
}

export default AvatarGroup
