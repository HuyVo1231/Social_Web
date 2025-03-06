'use client'

import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

interface PostBoxProps {
  postAuthor: string
  postAuthorAvatar: string
  postContent: string
  postUrl: string
}

const PostBox = ({ postAuthor, postAuthorAvatar, postContent, postUrl }: PostBoxProps) => {
  return (
    <div className='flex items-center space-x-4 p-4 border-b border-gray-200'>
      <Avatar src={postAuthorAvatar} alt={postAuthor} className='w-12 h-12' />
      <div className='flex-1'>
        <p className='font-semibold'>{postAuthor} đã nhắc đến bạn trong bài post</p>
        <p className='text-sm text-gray-600 mt-1'>{postContent}</p>
        <Button
          variant='link'
          className='mt-2 text-blue-600'
          onClick={() => window.open(postUrl, '_blank')}>
          Xem bài viết
        </Button>
      </div>
    </div>
  )
}

export default PostBox
