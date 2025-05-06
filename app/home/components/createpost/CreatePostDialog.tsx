'use client'

import { useState, useCallback } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { FaImage } from 'react-icons/fa'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { ClipLoader } from 'react-spinners'
import CP_Avatar from '@/app/components/Avatar/Avatar'
import useUserStore from '@/app/zustand/userStore'
import { uploadToCloudinary } from '@/app/hooks/useUpload'
import MediaPreview from '@/app/components/Media/MediaPreview'
import { fetcher } from '@/app/libs/fetcher'
import { usePostStore } from '@/app/zustand/postStore'
import { Input } from '@/components/ui/input'

interface CreatePostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CreatePostDialog = ({ open, onOpenChange }: CreatePostDialogProps) => {
  const MAX_IMAGES = 5
  const { user } = useUserStore()
  const { addPost } = usePostStore()
  const [postText, setPostText] = useState('')
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [videoPreviews, setVideoPreviews] = useState<string[]>([])
  const [isPrivate, setIsPrivate] = useState(false)
  const [suggestedCaption, setSuggestedCaption] = useState('')
  const [loading, setLoading] = useState(false)
  const [imagePrompt, setImagePrompt] = useState('')
  const [aiImageCount, setAiImageCount] = useState(1)
  const [videoPrompt, setVideoPrompt] = useState('')

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setLoading(true)
    for (const file of acceptedFiles) {
      try {
        const url = await uploadToCloudinary(file)
        if (file.type.startsWith('image/')) {
          setImagePreviews((prev) => [...prev, url])
        } else if (file.type.startsWith('video/')) {
          setVideoPreviews((prev) => [...prev, url])
        }
      } catch (error) {
        console.error('Upload error:', error)
        toast.error('Lỗi khi tải ảnh/video lên!')
      }
    }
    setLoading(false)
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [], 'video/*': [] },
    multiple: true,
    onDrop
  })

  const generateImage = async () => {
    const remaining = MAX_IMAGES - imagePreviews.length
    if (!imagePrompt.trim()) return toast.error('Vui lòng nhập mô tả để tạo hình ảnh!')
    if (remaining <= 0) return toast.error(`Bạn chỉ có thể thêm tối đa ${MAX_IMAGES} ảnh!`)

    const numToGenerate = Math.min(aiImageCount, remaining)
    setLoading(true)

    try {
      const response = await fetcher('/api/generate-image', {
        method: 'POST',
        body: JSON.stringify({ prompt: imagePrompt, num_images: numToGenerate })
      })

      const urls = response?.data?.images?.map((img: any) => img.url).filter(Boolean)
      if (urls?.length) {
        setImagePreviews((prev) => [...prev, ...urls.slice(0, remaining)])
        toast.success('Tạo hình ảnh thành công!')
      } else {
        toast.error('Không thể tạo hình ảnh!')
      }
    } catch (error: any) {
      console.error('Error generating image:', error)
      toast.error(`Lỗi khi tạo hình ảnh: ${error.message}`)
    } finally {
      setLoading(false)
      setImagePrompt('')
    }
  }

  const generateVideo = async () => {
    if (!videoPrompt.trim()) return toast.error('Vui lòng nhập mô tả để tạo video!')
    setLoading(true)

    try {
      const response = await fetcher('/api/generate-video', {
        method: 'POST',
        body: JSON.stringify({ prompt: videoPrompt })
      })

      const url = response?.data?.video?.url || response?.data?.videos?.[0]?.url
      if (url) {
        setVideoPreviews((prev) => [...prev, url])
        toast.success('Tạo video thành công!')
      } else {
        toast.error('Không thể tạo video!')
      }
    } catch (error: any) {
      console.error('Error generating video:', error)
      toast.error(`Lỗi khi tạo video: ${error.message}`)
    } finally {
      setLoading(false)
      setVideoPrompt('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && suggestedCaption) {
      e.preventDefault()
      setPostText(suggestedCaption)
      setSuggestedCaption('')
    }
  }

  const handleSubmit = async () => {
    if (!postText.trim() && imagePreviews.length === 0 && videoPreviews.length === 0) {
      return toast.error('Bạn chưa nhập nội dung hoặc chọn ảnh/video!')
    }

    const postData = {
      body: postText,
      images: imagePreviews,
      videos: videoPreviews,
      isPrivate
    }

    try {
      const response = await fetcher(`/api/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      })

      if (response?.post) {
        addPost(response.post)
        toast.success('Đăng bài thành công!')
        setPostText('')
        setImagePreviews([])
        setVideoPreviews([])
        onOpenChange(false)
      } else {
        toast.error('Lỗi khi đăng bài!')
      }
    } catch (error) {
      console.error(error)
      toast.error('Có lỗi xảy ra, vui lòng thử lại!')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild />
      <DialogTitle />
      <DialogContent className='w-full max-w-lg max-h-[90vh] overflow-y-auto'>
        <h2 className='text-xl font-semibold mb-2 flex justify-center text-gray-900'>
          Create post
        </h2>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <CP_Avatar src={user?.image || '/images/placeholder.jpg'} size={48} />
            <div>
              <p className='text-lg font-semibold text-gray-900'>{user?.name || 'User'}</p>
              <Select
                onValueChange={(value) => setIsPrivate(value === 'private')}
                defaultValue='public'>
                <SelectTrigger className='w-28 text-sm'>
                  <SelectValue placeholder='Chọn quyền riêng tư' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='public'>🌍 Public</SelectItem>
                  <SelectItem value='private'>🔒 Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Textarea
          placeholder={suggestedCaption || 'Bạn đang nghĩ gì?'}
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          onKeyDown={handleKeyDown}
          className='w-full min-h-[120px] text-lg text-gray-900 bg-transparent focus:ring-0 focus:outline-none border-none placeholder-gray-500'
          style={{ color: postText ? 'inherit' : suggestedCaption ? 'gray' : 'inherit' }}
        />

        {/* IMAGE GENERATE */}
        <div className='mt-3 space-y-2'>
          <div className='flex items-center gap-2'>
            <Input
              placeholder='Nhập mô tả để tạo hình ảnh...'
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              className='flex-1'
            />
            <div className='flex items-center gap-1'>
              <label className='text-sm text-gray-700 whitespace-nowrap'>Số ảnh:</label>
              <Input
                type='number'
                min={1}
                max={3}
                value={aiImageCount}
                onChange={(e) =>
                  setAiImageCount(Math.min(Math.max(1, parseInt(e.target.value) || 1), 3))
                }
                className='w-16 h-9 px-2 text-sm'
              />
            </div>
          </div>

          <Button
            onClick={generateImage}
            disabled={loading || !imagePrompt.trim()}
            className='w-full'>
            {loading ? <ClipLoader color='#fff' size={20} /> : 'Tạo hình ảnh bằng AI'}
          </Button>
        </div>

        {/* VIDEO GENERATE */}
        <div className='mt-4 space-y-2'>
          <Input
            placeholder='Nhập mô tả để tạo video'
            value={videoPrompt}
            onChange={(e) => setVideoPrompt(e.target.value)}
            className='w-full'
          />
          <Button
            disabled={loading || !videoPrompt.trim()}
            onClick={generateVideo}
            className='w-full'>
            Tạo video bằng AI
          </Button>
        </div>

        {/* UPLOAD */}
        <div
          {...getRootProps()}
          className='border-2 border-dashed border-gray-300 p-4 rounded-lg text-center cursor-pointer hover:bg-gray-100 mt-3 w-full'>
          <input {...getInputProps()} />
          <p className='text-gray-600 text-sm flex items-center justify-center gap-2'>
            <FaImage className='text-green-500' /> Kéo/thả hoặc chọn ảnh/video để tải lên
          </p>
        </div>

        {loading && (
          <div className='flex justify-center mt-4 gap-2 items-center'>
            <span>Đang xử lý...</span>
            <ClipLoader color='#3B82F6' size={24} />
          </div>
        )}

        {/* MEDIA PREVIEW */}
        <div className='max-h-[200px] overflow-y-auto flex gap-2 flex-wrap mt-3'>
          {imagePreviews.map((preview, index) => (
            <MediaPreview
              key={index}
              type='image'
              src={preview}
              onRemove={() => {
                setImagePreviews((prev) => prev.filter((_, i) => i !== index))
              }}
              size={120}
            />
          ))}
          {videoPreviews.map((preview, index) => (
            <MediaPreview
              key={index}
              type='video'
              src={preview}
              onRemove={() => {
                setVideoPreviews((prev) => prev.filter((_, i) => i !== index))
              }}
              size={200}
            />
          ))}
        </div>

        <Button className='w-full mt-3' onClick={handleSubmit}>
          Đăng bài viết
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default CreatePostDialog
