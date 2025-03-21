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
    <div className='relative overflow-hidden rounded-md' style={{ width: size, height: size }}>
      {type === 'image' ? (
        <Image
          src={src}
          alt='preview'
          width={size}
          height={size}
          className='rounded-md object-cover'
          style={{ maxWidth: `${size}px`, maxHeight: `${size}px` }}
        />
      ) : (
        <video
          src={src}
          className='rounded-md'
          style={{
            width: `${size}px`,
            height: `${size}px`,
            objectFit: 'cover'
          }}
          controls
        />
      )}
      <button
        onClick={onRemove}
        className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs'>
        <FaTimes />
      </button>
    </div>
  )
}
