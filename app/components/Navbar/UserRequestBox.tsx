'use client'

import { NotificationType } from '@/app/types'
import { Button } from '@/components/ui/button'
import CP_Avatar from '../Avatar/Avatar'

interface UserRequestBoxProps {
  data: NotificationType
  onAccept: () => void
  onReject: () => void
}

const UserRequestBox = ({ onAccept, onReject, data }: UserRequestBoxProps) => {
  const { sender, friendship } = data
  const status = friendship?.status

  return (
    <div className='flex items-center space-x-2 py-1 border-gray-200 bg-white rounded-lg'>
      <CP_Avatar src={sender?.image || '/images/placeholder.jpg'} />
      <div className='w-full'>
        {status === 'PENDING' && (
          <>
            <span className='font-semibold text-gray-800'>{sender?.name} </span>
            <span className='text-sm font-medium text-gray-600'>
              đã gửi lời mời kết bạn cho bạn.
            </span>
            <div className='flex mt-1 gap-1'>
              <Button
                variant='outline'
                onClick={onAccept}
                size='sm'
                className='bg-green-500 hover:bg-green-700 text-white hover:text-white'>
                Chấp nhận
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={onReject}
                className='text-black hover:bg-green-500 hover:text-white'>
                Từ chối
              </Button>
            </div>
          </>
        )}
        {status === 'ACCEPTED' && (
          <span className='font-semibold text-sm text-gray-800'>
            Bạn và {sender?.name} đã trở thành bạn bè!
          </span>
        )}
      </div>
    </div>
  )
}

export default UserRequestBox
