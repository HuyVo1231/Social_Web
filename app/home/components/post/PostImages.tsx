'use client'

import ModalImage from '@/app/components/ModalImage/ModalImage'

interface PostImagesProps {
  images?: string[]
}

export default function PostImages({ images = [] }: PostImagesProps) {
  if (images.length === 0) return null

  return (
    <div
      className={`mt-4 grid gap-2 w-full h-[600px] ${
        images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
      }`}>
      {images.slice(0, 2).map((img, index) => (
        <div key={index} className='relative w-full h-full overflow-hidden rounded-lg'>
          <ModalImage src={img} />
        </div>
      ))}

      {images.length === 3 && (
        <div className='relative col-span-2 w-full h-full overflow-hidden rounded-lg'>
          <ModalImage src={images[2]} />
        </div>
      )}

      {images.length > 4 && (
        <>
          <div className='relative w-full h-full overflow-hidden rounded-lg'>
            <ModalImage src={images[2]} />
          </div>
          <div className='relative w-full h-full overflow-hidden rounded-lg'>
            <ModalImage src={images[3]} className='brightness-50' />
            <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-40'>
              <span className='text-white text-2xl font-semibold'>+{images.length - 3}</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
