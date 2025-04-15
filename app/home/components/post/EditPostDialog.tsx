'use client'

import { useState, useEffect, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { FaImage, FaVideo } from 'react-icons/fa'
import toast from 'react-hot-toast'
import MediaPreview from '@/app/components/Media/MediaPreview'
import { uploadToCloudinary } from '@/app/hooks/useUpload'
import { fetcher } from '@/app/libs/fetcher'
import PostActionButton from '../post/PostActionButton'

interface EditPostDialogProps {
  isOpen: boolean
  onClose: () => void
  post: {
    id: string
    body: string
    image?: string[]
    video?: string[]
  }
  onUpdate?: (updatedPost: { id: string; body: string; image?: string[]; video?: string[] }) => void
}

export default function EditPostDialog({ isOpen, onClose, post, onUpdate }: EditPostDialogProps) {
  const [text, setText] = useState(post.body)
  const [images, setImages] = useState<string[]>(post.image || [])
  const [videos, setVideos] = useState<string[]>(post.video || [])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setText(post.body)
      setImages(post.image || [])
      setVideos(post.video || [])
    }
  }, [isOpen, post])

  const handleImageUpload = useCallback(async (newImages: File[]) => {
    setIsLoading(true)
    try {
      const uploadedImageUrls = await Promise.all(newImages.map((file) => uploadToCloudinary(file)))
      setImages((prevImages) => [...prevImages, ...uploadedImageUrls])
    } catch (error) {
      toast.error('Lỗi khi tải ảnh lên!')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleVideoUpload = useCallback(async (newVideos: File[]) => {
    setIsLoading(true)
    try {
      const uploadedVideoUrls = await Promise.all(newVideos.map((file) => uploadToCloudinary(file)))
      setVideos((prevVideos) => [...prevVideos, ...uploadedVideoUrls])
    } catch (error) {
      toast.error('Lỗi khi tải video lên!')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleUpdate = async () => {
    setIsLoading(true)
    try {
      const res = await fetcher(`/api/post/editPost`, {
        method: 'PUT',
        body: JSON.stringify({
          postId: post.id,
          body: text,
          image: images,
          video: videos
        })
      })

      // Cập nhật bài viết mới bằng onUpdate
      onUpdate?.(res)
      toast.success('Đã cập nhật bài viết')
      onClose()
    } catch (error) {
      toast.error('Cập nhật thất bại')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-xl'>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
        </DialogHeader>

        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          className='w-full py-3 px-4 text-lg bg-gray-100 text-gray-800 placeholder-gray-500 rounded-lg'
        />

        {/* Image previews */}
        {images.length > 0 && (
          <div className='grid grid-cols-2 gap-2 mt-2'>
            {images.map((img, idx) => (
              <MediaPreview
                key={idx}
                type='image'
                src={img}
                onRemove={() => {
                  setImages((prevImages) => prevImages.filter((_, i) => i !== idx))
                }}
                size={120}
              />
            ))}
          </div>
        )}

        {/* Video previews */}
        {videos.length > 0 && (
          <div className='grid grid-cols-1 gap-2 mt-2'>
            {videos.map((video, idx) => (
              <MediaPreview
                key={idx}
                type='video'
                src={video}
                onRemove={() => {
                  setVideos((prevVideos) => prevVideos.filter((_, i) => i !== idx))
                }}
                size={200}
              />
            ))}
          </div>
        )}

        {/* Add media buttons */}
        <div className='mt-4'>
          <PostActionButton
            icon={<FaImage />}
            label='Chọn ảnh'
            color='green'
            onClick={() => document.getElementById('image-upload')?.click()}
          />
          <input
            type='file'
            id='image-upload'
            className='hidden'
            accept='image/*'
            multiple
            onChange={(e) => handleImageUpload(e.target.files ? Array.from(e.target.files) : [])}
          />

          <PostActionButton
            icon={<FaVideo />}
            label='Chọn video'
            color='blue'
            onClick={() => document.getElementById('video-upload')?.click()}
          />
          <input
            type='file'
            id='video-upload'
            className='hidden'
            accept='video/*'
            multiple
            onChange={(e) => handleVideoUpload(e.target.files ? Array.from(e.target.files) : [])}
          />
        </div>

        {/* Update / Cancel buttons */}
        <div className='flex justify-end mt-4 gap-2'>
          <Button variant='ghost' onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleUpdate} disabled={isLoading}>
            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
