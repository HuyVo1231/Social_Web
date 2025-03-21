import CP_Avatar from '@/app/components/Avatar/Avatar'
import { format } from 'date-fns'

interface PostHeaderProps {
  avatar: string
  name: string
  time: Date
}

export default function PostHeader({ avatar, name, time }: PostHeaderProps) {
  return (
    <div className='flex items-center p-2 gap-2'>
      <CP_Avatar src={avatar} />
      <div>
        <p className='font-semibold text-lg'>{name}</p>
        <p className='text-sm text-gray-500'>{format(new Date(time), 'p')}</p>
      </div>
    </div>
  )
}
