'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { FaCalendarAlt, FaImage, FaSmile, FaVideo } from 'react-icons/fa'
import CP_Avatar from '@/app/components/Avatar/Avatar'
import CreatePostDialog from './CreatePostDialog'
import useUserStore from '@/app/zustand/userStore'
import PostActionButton from '../post/PostActionButton'

const CreatePost = () => {
  const { user } = useUserStore()
  const [open, setOpen] = useState(false)

  return (
    <div className='bg-white rounded-lg p-4'>
      <div className='flex items-center gap-3'>
        <CP_Avatar src={user?.image || '/images/placeholder.jpg'} />
        <Input
          type='text'
          placeholder={`What's on your mind, ${user?.name || 'User'}?`}
          className='w-full py-3 px-4 text-lg bg-gray-100 text-gray-800 placeholder-gray-500 rounded-full cursor-pointer border-none outline-none'
          onClick={() => setOpen(true)}
          readOnly
        />
        <CreatePostDialog open={open} onOpenChange={setOpen} />
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
