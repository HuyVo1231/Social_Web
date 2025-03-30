'use client'

import { useState, useRef, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { uploadToCloudinary } from '@/app/hooks/useUpload'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Pencil } from 'lucide-react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import useProfile from '@/app/hooks/useProfile'
import { fetcher } from '@/app/libs/fetcher'

interface ProfileAvatarProps {
  avatarUrl: string
  avatarCrop?: { x: number; y: number; zoom?: number }
}

export default function ProfileAvatar({ avatarUrl, avatarCrop }: ProfileAvatarProps) {
  const { isOwnProfile } = useProfile()
  const [image, setImage] = useState<string>(avatarUrl)
  const [crop, setCrop] = useState({ x: avatarCrop?.x || 0, y: avatarCrop?.y || 0 })
  const [zoom, setZoom] = useState(avatarCrop?.zoom || 1)
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setSelectedFile(file)
      setPreview(previewUrl)
      setImage(previewUrl)
    }
  }

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleSave = async () => {
    if (!selectedFile || !croppedAreaPixels) return
    setLoading(true)

    try {
      const url = await uploadToCloudinary(selectedFile)
      await fetcher('/api/profile/change-profile', {
        method: 'PUT',
        body: JSON.stringify({
          avatar: url,
          avatarCrop: { x: crop.x, y: crop.y, zoom }
        })
      })
      setImage(url)
      setPreview(null)
      setSelectedFile(null)
    } catch (error) {
      console.error('Error saving avatar:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='relative w-40 h-40 -mt-16'>
      {preview && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg flex flex-col items-center'>
            <h2 className='text-lg font-semibold mb-4'>Chỉnh sửa ảnh</h2>
            <div className='relative w-[300px] h-[300px] bg-gray-200 overflow-hidden'>
              <Cropper
                image={preview}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                restrictPosition
              />
            </div>
            <div className='w-full mt-4'>
              <label className='text-sm font-medium'>Zoom</label>
              <Slider
                value={[zoom]}
                min={1}
                max={3}
                step={0.1}
                onValueChange={(val) => setZoom(val[0])}
              />
            </div>
            <div className='mt-4 flex gap-4'>
              <Button onClick={() => setPreview(null)} variant='secondary'>
                Hủy
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? 'Đang lưu...' : 'Lưu ảnh'}
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className='w-40 h-40 border-4 border-white rounded-full overflow-hidden relative'>
        <Image
          src={image}
          width={160}
          height={160}
          alt='Avatar'
          className='w-full h-full object-cover'
          style={{ transform: `translate(${crop.x}px, ${crop.y}px) scale(${zoom})` }}
        />
      </div>
      {isOwnProfile && (
        <Button
          variant='secondary'
          size='icon'
          className='absolute bottom-2 right-2 w-10 h-10 rounded-full bg-white shadow-md hover:bg-gray-100 z-10'
          onClick={() => fileInputRef.current?.click()}>
          <Pencil className='w-5 h-5 text-gray-600' />
        </Button>
      )}
      <Input
        type='file'
        accept='image/*'
        ref={fileInputRef}
        className='hidden'
        onChange={handleFileChange}
      />
    </div>
  )
}
