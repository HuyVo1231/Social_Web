import CP_Avatar from '@/app/components/Avatar/Avatar'
import { format, formatDistanceToNow, isToday } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface CommentProps {
  userImage?: string
  username: string
  content: string
  createdAt: Date
}

const Comment = ({ userImage, username, content, createdAt }: CommentProps) => {
  const commentTime = new Date(createdAt)

  const formattedTime = isToday(commentTime)
    ? `Today at ${format(commentTime, 'p')}`
    : formatDistanceToNow(commentTime, { addSuffix: true, locale: vi })

  const fullTime = format(commentTime, 'PPpp', { locale: vi })

  return (
    <div className='flex items-center gap-2'>
      <CP_Avatar src={userImage || '/images/placeholder.jpg'} />
      <div className='bg-gray-100 dark:bg-gray-800 p-2 rounded-lg'>
        <div className='flex justify-center items-center gap-2'>
          <p className='font-semibold'>{username}</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <p className='text-sm text-gray-500 cursor-pointer'>{formattedTime}</p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{fullTime}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p>{content}</p>
      </div>
    </div>
  )
}

export default Comment
