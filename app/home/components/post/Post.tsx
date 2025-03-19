import { Card } from '@/components/ui/card'
import PostHeader from './PostHeader'
import PostContent from './PostContent'
import PostActions from './PostActions'
import { PostType } from '@/app/types'

interface PostProps {
  post: PostType
}

export default function Post({ post }: PostProps) {
  return (
    <div className='w-full mx-auto rounded-xl'>
      <Card className='bg-gray-100 rounded-2xl p-2'>
        <PostHeader
          avatar={post.user.image!}
          name={post.user.name || 'Anonymous'}
          time={post.createdAt}
        />
        <PostContent text={post.body} images={post.image} videos={post.video} />
        <PostActions
          postId={post.id}
          initialLikes={post.likes.length}
          initialComments={post.comments.length}
          likesData={post.likes}
          commentsData={post.comments}
        />
      </Card>
    </div>
  )
}
