'use client'

import { useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-hot-toast'
import ModalImage from '@/app/components/ModalImage/ModalImage'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { fetcher } from '@/app/libs/fetcher'
import ClipLoader from 'react-spinners/ClipLoader'
import Image from 'next/image'
import { uploadToCloudinary } from '@/app/hooks/useUpload'

export default function ProfileCover({ coverUrl }: { coverUrl: string }) {
  const pathname = usePathname()
  const isOwnProfile = pathname === '/profile'

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newCover, setNewCover] = useState<string | null>(null)

  // Khi người dùng chọn ảnh
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    const url = await uploadToCloudinary(file)

    if (url) {
      setNewCover(url)
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    onDrop
  })

  // Lưu ảnh bìa mới vào database
  const handleSaveCover = async () => {
    if (!newCover) return

    try {
      setLoading(true)
      await fetcher('/api/profile/change-profile', {
        method: 'PUT',
        body: JSON.stringify({ image: newCover })
      })
      toast.success('Cập nhật ảnh bìa thành công!')
      setOpen(false)
    } catch (error) {
      console.log(error)
      toast.error('Lỗi khi cập nhật ảnh bìa!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='relative h-60 w-full bg-gray-200'>
      <ModalImage src={newCover || coverUrl} />

      {isOwnProfile && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className='absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded'>
              Thay đổi ảnh bìa
            </Button>
          </DialogTrigger>
          <DialogContent className='w-full max-w-lg'>
            <DialogTitle>Thay đổi ảnh bìa</DialogTitle>

            {/* Kéo/thả hoặc chọn ảnh */}
            <div
              {...getRootProps()}
              className='border-2 border-dashed border-gray-300 p-4 rounded-lg text-center cursor-pointer hover:bg-gray-100 mt-3 w-full'>
              <input {...getInputProps()} />
              <p className='text-gray-600 text-sm'>Kéo/thả hoặc chọn ảnh để tải lên</p>
            </div>

            {/* Hiển thị ảnh mới nếu có */}
            {newCover && (
              <div className='flex justify-center mt-4'>
                <Image
                  src={newCover}
                  alt='cover preview'
                  className='w-full max-h-60 object-cover rounded-lg'
                  width={200}
                  height={200}
                />
              </div>
            )}

            {/* Hiển thị loading spinner */}
            {loading && (
              <div className='flex justify-center mt-4'>
                <ClipLoader color='#3B82F6' size={30} />
              </div>
            )}

            <div className='flex justify-end gap-2 mt-4'>
              <Button variant='outline' onClick={() => setOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleSaveCover} disabled={!newCover || loading}>
                Lưu ảnh bìa
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
