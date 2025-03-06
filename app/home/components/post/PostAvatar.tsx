import { Avatar } from '@/components/ui/avatar'
import Image from 'next/image'

interface PostAvatarProps {
  src: string
  size?: number
}

export default function PostAvatar({ src }: PostAvatarProps) {
  return (
    <Avatar className='h-[40px] w-[40px]'>
      <Image src={src || '/images/placeholder.jpg'} alt='logo' width={40} height={40} />
    </Avatar>
  )
}
