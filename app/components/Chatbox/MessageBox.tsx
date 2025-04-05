'use client'

import clsx from 'clsx'
import { format } from 'date-fns'
import { useSession } from 'next-auth/react'
import { FullMessageType } from '@/app/types'
import Image from 'next/image'
import CP_Avatar from '../Avatar/Avatar'

interface MessageBoxProps {
  message: FullMessageType
}

const MessageBox: React.FC<MessageBoxProps> = ({ message }) => {
  const { data: session } = useSession()
  const yourMessage = session?.user?.email === message.sender.email

  return (
    <div className={clsx(`flex gap-3 p-2`, yourMessage && 'justify-end')}>
      {!yourMessage && (
        <div className='w-8 h-8'>
          <CP_Avatar src={message.sender.image || '/images/placeholder.jpg'} />
        </div>
      )}
      <div className={clsx(`flex flex-col gap-1`, yourMessage && 'items-end')}>
        <div className='flex items-center gap-1 text-xs text-gray-500 mb-1'>
          {!yourMessage && <span>{message.sender.name}</span>}
          <span>{format(new Date(message.createdAt), 'p')}</span>
        </div>
        <div
          className={clsx(
            `text-sm max-w-[220px] break-words overflow-hidden`,
            yourMessage ? 'bg-blue-500 text-white' : 'bg-gray-200',
            'rounded-2xl'
          )}>
          {/* Hiển thị body nếu có */}
          {message.body && (
            <div
              className={clsx(
                'p-2',
                (message.image?.length > 0 || message.video?.length > 0) && 'rounded-b-none'
              )}>
              <span className={clsx('text-sm', yourMessage ? 'text-white' : 'text-gray-800')}>
                {message.body}
              </span>
            </div>
          )}

          {/* Hiển thị hình ảnh nếu có */}
          {message?.image && message.image.length > 0 && (
            <div
              className={clsx(
                message.body && 'rounded-t-none',
                message.video?.length > 0 && 'rounded-b-none'
              )}>
              {message.image.map((img, index) => (
                <Image
                  key={index}
                  alt='Image'
                  height={120}
                  width={120}
                  src={img}
                  className='object-cover w-full cursor-pointer hover:scale-105 transition'
                  onLoad={() => {
                    setTimeout(() => {
                      const chatEnd = document.getElementById('chat-end')
                      chatEnd?.scrollIntoView({ behavior: 'smooth' })
                    }, 100)
                  }}
                />
              ))}
            </div>
          )}

          {/* Hiển thị video nếu có */}
          {message?.video && message.video.length > 0 && (
            <div className={clsx((message.body || message.image?.length > 0) && 'rounded-t-none')}>
              {message.video.map((video, index) => (
                <div key={index} className='relative'>
                  <video
                    controls
                    className='w-full h-auto max-h-60 object-cover rounded-lg'
                    preload='metadata'>
                    <source src={video} type='video/mp4' />
                    Trình duyệt của bạn không hỗ trợ video HTML5.
                  </video>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessageBox
