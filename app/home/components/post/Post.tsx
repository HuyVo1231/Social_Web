'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import PostHeader from './PostHeader'
import PostContent from './PostContent'
import PostActions from './PostActions'
import { PostType } from '@/app/types'
import { useSession } from 'next-auth/react'
import { fetcher } from '@/app/libs/fetcher'

interface PostProps {
  post: PostType
}

export default function Post({ post }: PostProps) {
  const [hasSeen, setHasSeen] = useState(false)
  const { data: session } = useSession()

  const markPostAsSeen = async (userId: string, postId: string) => {
    try {
      const response = await fetcher('/api/post/seenPost', {
        method: 'POST',
        body: JSON.stringify({ userId, postId })
      })

      if (response) {
      } else {
        console.error(response)
      }
    } catch (error) {
      console.error('Error marking post as seen:', error)
    }
  }

  const handlePostClick = async () => {
    if (!hasSeen) {
      await markPostAsSeen(session?.user?.id as string, post.id)
      setHasSeen(true)
    }
  }

  return (
    <div className='w-full mx-auto rounded-xl'>
      <Card className='bg-gray-100 rounded-2xl p-2'>
        <PostHeader
          avatar={post.user.image!}
          name={post.user.name || 'Anonymous'}
          time={post.createdAt}
          userId={post.user.id}
          friendShip={post.friendshipStatus}
        />
        <div onClick={handlePostClick}>
          <PostContent text={post.body} images={post.image} videos={post.video} />
          <PostActions
            postId={post.id}
            initialLikes={post.likes.length}
            initialComments={post.comments.length}
            likesData={post.likes}
            commentsData={post.comments}
          />
        </div>
      </Card>
    </div>
  )
}
