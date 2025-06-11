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
        <div
          className={`cursor-pointer relative w-full h-full ${className}`}
          onClick={() => setOpen(true)}>
          <Image src={src} alt={alt} fill className='rounded-lg object-cover' />
        </div>
      </DialogTrigger>
      <DialogContent className='max-w-full p-4 flex flex-col items-center'>
        <DialogTitle />
        <div className='relative w-[90vw] max-w-[800px] h-[90vh] max-h-[800px]'>
          <Image src={src} alt={alt} fill className='rounded-lg object-contain' />
        </div>
      </DialogContent>
    </Dialog>
  )
}
