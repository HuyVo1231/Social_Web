import CP_Avatar from '@/app/components/Avatar/Avatar'
import { format, formatDistanceToNow, isToday } from 'date-fns'
import { vi } from 'date-fns/locale'

interface PostHeaderProps {
  avatar: string
  name: string
  time: Date
}

export default function PostHeader({ avatar, name, time }: PostHeaderProps) {
  const postTime = new Date(time)

  const formattedTime = isToday(postTime)
    ? `Today at ${format(postTime, 'p')}` // Nếu là hôm nay, hiển thị "Today at 10:20PM"
    : formatDistanceToNow(postTime, { addSuffix: true, locale: vi }) // Nếu cũ hơn, hiển thị "3 ngày trước"

  return (
    <div className='flex items-center p-2 gap-2'>
      <CP_Avatar src={avatar} />
      <div>
        <p className='font-semibold text-lg'>{name}</p>
        <p className='text-sm text-gray-500'>{formattedTime}</p>
      </div>
    </div>
  )
}
