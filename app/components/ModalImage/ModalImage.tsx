'use client'

import Image from 'next/image'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import { useState } from 'react'

interface ModalImageProps {
  src: string
  alt?: string
  className?: string
}

export default function ModalImage({ src, alt = 'Image', className }: ModalImageProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className={`cursor-pointer ${className}`} onClick={() => setOpen(true)}>
          <Image src={src} alt={alt} layout='fill' objectFit='cover' className='rounded-lg' />
        </div>
      </DialogTrigger>
      <DialogContent className='max-w-2xl p-4 flex flex-col items-center'>
        <DialogTitle />
        <div className='relative w-[600px] h-[600px] max-w-full max-h-full overflow-hidden rounded-lg'>
          <Image src={src} alt={alt} layout='fill' objectFit='contain' className='rounded-lg' />
        </div>
      </DialogContent>
    </Dialog>
  )
}
