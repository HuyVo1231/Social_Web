'use client'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { FaCalendarAlt, FaImage, FaSmile, FaVideo } from 'react-icons/fa'
import { useSession } from 'next-auth/react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import PostActionButton from './post/PostActionButton'
import { fetcher } from '@/app/libs/fetcher'
import toast from 'react-hot-toast'
import { usePostStore } from '@/app/zustand/postStore'
import { ClipLoader } from 'react-spinners'
import { uploadToCloudinary } from '@/app/hooks/useUpload'
import MediaPreview from '@/app/components/Media/MediaPreview'
import CP_Avatar from '@/app/components/Avatar/Avatar'

const CreatePost = () => {
  const { data: session } = useSession()
  const user = session?.user
  const { addPost } = usePostStore()
  const [open, setOpen] = useState(false)
  const [postText, setPostText] = useState('')
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [videoPreviews, setVideoPreviews] = useState<string[]>([])
  const [privacy, setPrivacy] = useState('public')
  const [loading, setLoading] = useState(false)

  // Sử dụng React- Dropzone
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
        toast.error('Có lỗi xảy ra khi tải lên ảnh/video!')
      }
    }
    setLoading(false)
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [], 'video/*': [] },
    multiple: true,
    onDrop
  })

  const handleSubmit = async () => {
    if (!postText.trim() && imagePreviews.length === 0 && videoPreviews.length === 0) {
      return toast.error('Bạn chưa nhập nội dung hoặc chọn ảnh/video!')
    }

    const postData = {
      body: postText,
      images: imagePreviews,
      videos: videoPreviews,
      privacy
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
        setOpen(false)
      } else {
        toast.error('Lỗi khi đăng bài!')
      }
    } catch (error) {
      console.error('Lỗi:', error)
      toast.error('Có lỗi xảy ra, vui lòng thử lại!')
    }
  }

  return (
    <div className='bg-white rounded-lg p-4 '>
      <div className='flex items-center gap-3'>
        <CP_Avatar src={user?.image || '/images/placeholder.jpg'} />
        <Input
          type='text'
          placeholder={`What's on your mind, ${user?.name || 'User'}?`}
          className='w-full py-3 px-4 text-lg bg-gray-100 text-gray-800 placeholder-gray-500 rounded-full cursor-pointer border-none outline-none focus:bg-gray-100 focus:shadow-sm'
          onClick={() => setOpen(true)}
          readOnly
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild></DialogTrigger>
          <DialogTitle />

          <DialogContent className='w-full max-w-lg'>
            <h2 className='text-xl font-semibold mb-2 flex justify-center text-gray-900'>
              Create post
            </h2>

            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <CP_Avatar src={user?.image || '/images/placeholder.jpg'} size={48} />
                <div>
                  <p className='text-lg font-semibold text-gray-900'>{user?.name || 'User'}</p>
                  <Select onValueChange={setPrivacy} defaultValue={privacy}>
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
              placeholder='Bạn đang nghĩ gì?'
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className='w-full min-h-[120px] text-lg text-gray-900 bg-transparent focus:ring-0 focus:outline-none border-none placeholder-gray-500'
            />

            {/* Khu vực kéo/thả hoặc chọn file */}
            <div
              {...getRootProps()}
              className='border-2 border-dashed border-gray-300 p-4 rounded-lg text-center cursor-pointer hover:bg-gray-100 mt-3 w-full'>
              <input {...getInputProps()} />
              <p className='text-gray-600 text-sm flex items-center justify-center gap-2'>
                <FaImage className='text-green-500' /> Kéo/thả hoặc chọn ảnh/video để tải lên
              </p>
            </div>
            {/* Hiển thị loading spinner */}
            {loading && (
              <div className='flex justify-center mt-4'>
                <div>Đang upload dữ liệu.</div>
                <ClipLoader color='#3B82F6' size={30} />
              </div>
            )}

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
      </div>
      <div className='flex flex-wrap items-center justify-between mt-4 border-t pt-4'>
        <PostActionButton icon={<FaVideo />} label='Live Stream' color='blue' />
        <PostActionButton icon={<FaImage />} label='Post Image/Video' color='green' />
        <PostActionButton icon={<FaSmile />} label='Feeling/Activity' color='yellow' />
        <PostActionButton icon={<FaCalendarAlt />} label='Event' color='purple' />
      </div>
    </div>
  )
}

export default CreatePost
