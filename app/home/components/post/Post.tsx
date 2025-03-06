import { Card } from '@/components/ui/card'
import PostHeader from './PostHeader'
import PostContent from './PostContent'
import PostActions from './PostActions'
import PostComment from './PostComment'

interface PostProps {
  avatar: string
  name: string
  time: Date
  text: string
  images: string[]
  likes: number
  comments: number
}

export default function Post({ avatar, name, time, text, images, likes, comments }: PostProps) {
  return (
    <div className='w-full mx-auto rounded-xl'>
      <Card className='bg-gray-100 rounded-2xl p-2'>
        <PostHeader avatar={avatar} name={name} time={time} />
        <PostContent text={text} images={images} />
        <PostActions likes={likes} comments={comments} />
        <PostComment />
      </Card>
    </div>
  )
}
