import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import PostAvatar from './PostAvatar'
import useUserStore from '@/app/zustand/userStore'

export default function PostComment() {
  const user = useUserStore((state) => state.user)
  return (
    <div className='flex items-center p-2 gap-2'>
      <PostAvatar src={user?.image || ''} size={32} />
      <Input placeholder='Viết bình luận...' className='flex-1' />
      <Button size='sm'>Gửi</Button>
    </div>
  )
}
