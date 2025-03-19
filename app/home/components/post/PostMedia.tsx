import React from 'react'
import ModalImage from '@/app/components/ModalImage/ModalImage'
import ReactPlayer from 'react-player'

interface PostMediaProps {
  images?: string[]
  videos?: string[]
}

export function PostMedia({ images = [], videos = [] }: PostMediaProps) {
  const media = [...videos, ...images]

  if (media.length === 0) return null

  return (
    <div
      className={`mt-4 grid gap-2 w-full h-[500px] 
        ${media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}
        ${media.length > 2 ? 'grid-rows-2' : ''}
      `}>
      {media.slice(0, 4).map((item, index) => (
        <div key={index} className='relative w-full h-full overflow-hidden rounded-lg'>
          {item.includes('mp4') ? (
            <ReactPlayer
              url={item}
              controls
              width='100%'
              height='100%'
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <ModalImage src={item} />
          )}
        </div>
      ))}
      {media.length > 4 && (
        <div className='relative w-full h-full overflow-hidden rounded-lg'>
          {media[4].includes('mp4') ? (
            <ReactPlayer
              url={media[4]}
              controls
              width='100%'
              height='100%'
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <ModalImage src={media[4]} />
          )}
          <div className='absolute inset-0 bg-black opacity-30'></div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <span className='text-white text-2xl font-semibold'>+{media.length - 5}</span>
          </div>
        </div>
      )}
    </div>
  )
}
