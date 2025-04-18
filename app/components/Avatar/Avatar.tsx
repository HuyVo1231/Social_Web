'use client'

import { Avatar as Avatar } from '@/components/ui/avatar'
import Image from 'next/image'

interface AvatarProps {
  src?: string
  size?: number
  isOnline?: boolean
}

export default function CP_Avatar({ src, size = 40, isOnline = false }: AvatarProps) {
  return (
    <div className='relative' style={{ width: size, height: size }}>
      <Avatar
        style={{
          width: size,
          height: size,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '50%'
        }}>
        <Image
          src={src || '/images/placeholder.jpg'}
          alt='avatar'
          fill
          style={{ objectFit: 'cover', clipPath: 'circle(50%)' }}
        />
      </Avatar>
      {isOnline && (
        <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full' />
      )}
    </div>
  )
}
