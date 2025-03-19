'use client'

import ModalImage from '@/app/components/ModalImage/ModalImage'
import { Avatar } from '@/components/ui/avatar'

export default function ProfileAvatar({ avatarUrl }: { avatarUrl: string }) {
  return (
    <Avatar className='w-32 h-32 border-4 border-white -mt-16'>
      <ModalImage src={avatarUrl} />
    </Avatar>
  )
}
