'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import PostHeader from './PostHeader'
import PostContent from './PostContent'
import PostActions from './PostActions'
import { PostType } from '@/app/types'
import { useSession } from 'next-auth/react'
import { fetcher } from '@/app/libs/fetcher'
import EditPostDialog from './EditPostDialog'

interface PostProps {
  post: PostType
}

export default function Post({ post }: PostProps) {
  const [hasSeen, setHasSeen] = useState(false)
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [postData, setPostData] = useState<PostType>(post)

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
          avatar={postData.user?.image || '/images/placeholder.jpg'}
          name={postData.user?.name || 'Anonymous'}
          time={postData.createdAt}
          userId={postData.user?.id || ''}
          onEdit={() => setIsEditing(true)}
          friendShip={postData.friendshipStatus}
        />
        <div onClick={handlePostClick}>
          <PostContent text={postData.body} images={postData.image} videos={postData.video} />
          <PostActions
            postId={postData.id}
            initialLikes={postData.likes.length}
            initialComments={postData.comments.length}
            likesData={postData.likes}
            commentsData={postData.comments}
          />
        </div>
      </Card>
      <EditPostDialog
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        post={postData}
        onUpdate={(updatedPost) => {
          setPostData((prevPostData) => ({
            ...prevPostData,
            ...updatedPost,
            updatedAt: new Date()
          }))
          setIsEditing(false)
        }}
      />
    </div>
  )
}
