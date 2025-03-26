import CP_Avatar from '@/app/components/Avatar/Avatar'
import { format } from 'date-fns'

interface CommentProps {
  userImage?: string
  username: string
  content: string
  createdAt: Date
}

const Comment = ({ userImage, username, content, createdAt }: CommentProps) => {
  return (
    <div className='flex items-center gap-2'>
      <CP_Avatar src={userImage || '/images/placeholder.jpg'} />
      <div className='bg-gray-100 dark:bg-gray-800 p-2 rounded-lg'>
        <div className='flex justify-center items-center gap-2'>
          <p className='font-semibold'>{username}</p>
          <p className='text-sm text-gray-500'>{format(new Date(createdAt), 'p')}</p>
        </div>
        <p>{content}</p>
      </div>
    </div>
  )
}

export default Comment
