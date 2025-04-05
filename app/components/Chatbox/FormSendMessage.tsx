'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import { MessageCircle, Loader2 } from 'lucide-react'
import { Image as ImageIcon, Video as VideoIcon } from 'lucide-react'

import { fetcher } from '@/app/libs/fetcher'
import { Input } from '@/components/ui/input'
import { uploadToCloudinary } from '@/app/hooks/useUpload'
import MediaPreview from '@/app/components/Media/MediaPreview'

export interface FormSendMessageProps {
  conversationId: string
}

const FormSendMessage: React.FC<FormSendMessageProps> = ({ conversationId }) => {
  const { register, handleSubmit, reset, setValue } = useForm<{ message: string }>()
  const [loading, setLoading] = useState(false)
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [videoPreviews, setVideoPreviews] = useState<string[]>([])

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
        console.error('Lỗi khi tải lên Cloudinary:', error)
      }
    }
    setLoading(false)
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [], 'video/*': [] },
    multiple: true,
    onDrop
  })

  const onSubmit = async (data: { message: string }) => {
    if (!data.message.trim() && imagePreviews.length === 0 && videoPreviews.length === 0) return

    setLoading(true)
    setValue('message', '')

    try {
      await fetcher('/api/messages', {
        method: 'POST',
        body: JSON.stringify({
          message: data.message,
          image: imagePreviews,
          video: videoPreviews,
          conversationId
        }),
        headers: { 'Content-Type': 'application/json' }
      })

      reset()
      setImagePreviews([])
      setVideoPreviews([])
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error)
    } finally {
      setLoading(false)
    }
  }

  const hasPreviews = imagePreviews.length > 0 || videoPreviews.length > 0

  return (
    <div className='border-t bg-gray-100 p-3'>
      {hasPreviews && (
        <div className='mb-3 flex gap-2 overflow-x-auto pb-2'>
          {imagePreviews.map((src, index) => (
            <MediaPreview
              key={index}
              type='image'
              src={src}
              onRemove={() => setImagePreviews((prev) => prev.filter((_, i) => i !== index))}
            />
          ))}
          {videoPreviews.map((src, index) => (
            <MediaPreview
              key={index}
              type='video'
              src={src}
              onRemove={() => setVideoPreviews((prev) => prev.filter((_, i) => i !== index))}
            />
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className='flex items-center'>
        <Input
          {...register('message')}
          className='flex-1 rounded-lg border p-2 text-sm'
          placeholder='Nhập tin nhắn...'
          disabled={loading}
        />
        <div {...getRootProps()} className='ml-2 flex cursor-pointer gap-1'>
          <input {...getInputProps()} />
          <ImageIcon className='text-blue-500' size={20} />
          <VideoIcon className='text-blue-500' size={20} />
        </div>
        <button type='submit' className='ml-2 text-blue-500 hover:text-blue-600' disabled={loading}>
          {loading ? <Loader2 className='animate-spin' size={20} /> : <MessageCircle size={20} />}
        </button>
      </form>
    </div>
  )
}

export default FormSendMessage
