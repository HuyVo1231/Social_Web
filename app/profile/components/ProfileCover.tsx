'use client'

import { useState, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { FaCamera } from 'react-icons/fa'
import { fetcher } from '@/app/libs/fetcher'
import ClipLoader from 'react-spinners/ClipLoader'
import { uploadToCloudinary } from '@/app/hooks/useUpload'
import Image from 'next/image'
import useProfile from '@/app/hooks/useProfile'

export default function ProfileCover({
  coverUrl,
  coverCrop
}: {
  coverUrl: string
  coverCrop?: { x: number; y: number }
}) {
  const { isOwnProfile } = useProfile()
  const containerHeight = 400

  const [currentCoverUrl, setCurrentCoverUrl] = useState(coverUrl)
  const [loading, setLoading] = useState(false)
  const [newCover, setNewCover] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [currentY, setCurrentY] = useState(coverCrop?.y || 0)
  const [canDrag, setCanDrag] = useState(false)

  const imageRef = useRef<HTMLImageElement>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    const url = await uploadToCloudinary(file)

    if (url) {
      setNewCover(url)
      setCurrentY(0)
      setCanDrag(true)
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    onDrop
  })

  const handleSaveCover = async () => {
    if (!newCover) return

    try {
      setLoading(true)

      await fetcher('/api/profile/change-profile', {
        method: 'PUT',
        body: JSON.stringify({
          imageThumbnail: newCover,
          coverCrop: { x: 0, y: currentY }
        })
      })

      toast.success('Cập nhật ảnh bìa thành công!')

      setCurrentCoverUrl(newCover)
      setNewCover(null)
      setCanDrag(false)
    } catch (error) {
      console.error(error)
      toast.error('Lỗi khi cập nhật ảnh bìa!')
    } finally {
      setLoading(false)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canDrag) return
    e.preventDefault()
    setDragging(true)
    setStartY(e.clientY)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !imageRef.current || !canDrag) return

    const deltaY = e.clientY - startY
    const newY = currentY + deltaY

    const imageHeight = imageRef.current.clientHeight
    const maxY = 0
    const minY = containerHeight - imageHeight

    const clampedY = Math.max(minY, Math.min(maxY, newY))

    setCurrentY(clampedY)
    setStartY(e.clientY)
  }

  const handleMouseUp = () => {
    setDragging(false)
  }

  return (
    <div
      className='relative w-full overflow-hidden mx-auto rounded-lg select-none'
      style={{ height: containerHeight }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}>
      <div
        className={`absolute inset-0 w-full h-full ${
          canDrag ? 'cursor-pointer active:cursor-grabbing' : ''
        }`}
        onMouseDown={handleMouseDown}>
        <Image
          src={newCover || currentCoverUrl}
          alt='Cover'
          width={900}
          height={600}
          className='absolute w-full h-auto transition-transform'
          style={{ transform: `translateY(${currentY}px)`, objectFit: 'cover' }}
          onDragStart={(e) => e.preventDefault()}
          ref={imageRef}
        />
      </div>

      {isOwnProfile && (
        <div className='absolute bottom-4 right-4 flex gap-3'>
          <div
            {...getRootProps()}
            className='bg-black/50 text-white px-3 py-1 rounded cursor-pointer hover:bg-black/70 flex items-center gap-2'>
            <input {...getInputProps()} />
            <FaCamera />
            <span>Upload</span>
          </div>

          <Button onClick={handleSaveCover} disabled={loading || !newCover}>
            {loading ? <ClipLoader color='#fff' size={18} /> : 'Save'}
          </Button>
        </div>
      )}
    </div>
  )
}
