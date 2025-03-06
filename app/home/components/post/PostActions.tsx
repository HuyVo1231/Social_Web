import { Heart, MessageCircle } from 'lucide-react'
import ButtonAction from './ButtonAction'

interface PostActionsProps {
  likes: number
  comments: number
}

export default function PostActions({ likes, comments }: PostActionsProps) {
  return (
    <div className='flex items-center justify-between px-2'>
      <div className='flex items-center gap-2'>
        <ButtonAction icon={<Heart className='w-5 h-5' />} items={likes} />
        <ButtonAction icon={<MessageCircle className='w-5 h-5' />} items={comments} />
      </div>
    </div>
  )
}
