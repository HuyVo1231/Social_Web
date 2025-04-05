'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import PostHeader from './PostHeader'
import PostContent from './PostContent'
import PostActions from './PostActions'
import { PostType } from '@/app/types'
import { markPostAsSeen } from '@/app/utils/postAPI'
import { useSession } from 'next-auth/react'

interface PostProps {
  post: PostType
}

export default function Post({ post }: PostProps) {
  const [hasSeen, setHasSeen] = useState(false)
  const { data: session } = useSession()

  const handlePostClick = async () => {
    if (!hasSeen) {
      // Gọi API đánh dấu bài post là đã xem
      await markPostAsSeen(session?.user?.id as string, post.id)

      // Cập nhật state để đánh dấu bài post đã được xem
      setHasSeen(true)
    }
  }

  return (
    <div className='w-full mx-auto rounded-xl' onClick={handlePostClick}>
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
