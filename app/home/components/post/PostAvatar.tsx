'use client'

import { Avatar } from '@/components/ui/avatar'
import Image from 'next/image'

interface PostAvatarProps {
  src?: string
  size?: number
  outline?: boolean
}

export default function PostAvatar({ src, size = 40, outline = false }: PostAvatarProps) {
  return (
    <Avatar
      className={`relative border-2 ${outline ? 'border-blue-500' : 'border-white'}`}
      style={{
        width: size,
        height: size,
        overflow: 'hidden',
        borderRadius: '50%'
      }}>
      <Image
        src={src || '/images/placeholder.jpg'}
        alt='avatar'
        width={size}
        height={size}
        objectFit='cover'
        className='absolute top-0 left-0 w-full h-full'
      />
    </Avatar>
  )
}
