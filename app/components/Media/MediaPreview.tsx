'use client'

import Image from 'next/image'
import { FaTimes } from 'react-icons/fa'

interface MediaPreviewProps {
  type: 'image' | 'video'
  src: string
  onRemove: () => void
  size?: number
}

export default function MediaPreview({ type, src, onRemove, size = 100 }: MediaPreviewProps) {
  return (
    <div className='relative' style={{ width: size, height: size }}>
      {type === 'image' ? (
        <Image
          src={src}
          alt='preview'
          width={size}
          height={size}
          className='rounded-md object-cover'
        />
      ) : (
        <video src={src} className='w-full h-full rounded-md' controls />
      )}
      <button
        onClick={onRemove}
        className='absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs'>
        <FaTimes />
      </button>
    </div>
  )
}
