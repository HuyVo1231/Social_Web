'use client'

import { Avatar as Avatar } from '@/components/ui/avatar'
import Image from 'next/image'

interface AvatarProps {
  src?: string
  size?: number
}

export default function CP_Avatar({ src, size = 40 }: AvatarProps) {
  return (
    <Avatar style={{ width: size, height: size }}>
      <Image
        src={src || '/images/placeholder.jpg'}
        alt='avatar'
        width={size}
        height={size}
        className='rounded-full'
      />
    </Avatar>
  )
}
