'use client'

import { Avatar as Avatar } from '@/components/ui/avatar'
import Image from 'next/image'

interface AvatarProps {
  src?: string
  size?: number
}

export default function CP_Avatar({ src, size = 40 }: AvatarProps) {
  return (
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
        layout='fill'
        objectFit='cover'
        className='absolute top-0 left-0 w-full h-full'
        style={{ clipPath: 'circle(50%)' }}
      />
    </Avatar>
  )
}
