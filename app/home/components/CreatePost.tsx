import { Avatar } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { FaVideo, FaImage, FaSmile, FaCalendarAlt } from 'react-icons/fa'
import PostActionButton from './post/PostActionButton'

const CreatePost = () => {
  return (
    <div className='bg-white rounded-lg p-4'>
      <div className='flex gap-3'>
        <Avatar>
          <Image src={'/images/placeholder.jpg'} alt='logo' width={40} height={40} />
        </Avatar>
        <Input
          type='text'
          placeholder={`What's on your mind?`}
          className='w-full py-3 px-4 text-2xl bg-gray-100 text-gray-800 placeholder-gray-500 rounded-full cursor-pointer border-none outline-none focus:bg-gray-100 focus:shadow-sm focus:border-none
          ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0'
        />
      </div>

      {/* Button action  */}
      <div className='flex flex-wrap items-center justify-between mt-4 border-t pt-4'>
        <PostActionButton icon={<FaVideo />} label='Live Stream' color='blue' />
        <PostActionButton icon={<FaImage />} label='Post Image' color='green' />
        <PostActionButton icon={<FaSmile />} label='Feeling/Activity' color='yellow' />
        <PostActionButton icon={<FaCalendarAlt />} label='Event' color='purple' />
      </div>
    </div>
  )
}

export default CreatePost
