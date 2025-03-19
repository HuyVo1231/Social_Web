'use client'

import { useState, useEffect } from 'react'
import { Heart, MessageCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'
import ButtonAction from './ButtonAction'
import toast from 'react-hot-toast'
import { fetcher } from '@/app/libs/fetcher'
import { Like } from '@prisma/client'
import PostComment from './PostComment'
import { Comment as CommentType, User } from '@prisma/client'

interface PostActionsProps {
  postId: string
  initialLikes: number
  initialComments: number
  likesData: Like[]
  commentsData: (CommentType & { user: User })[]
}

export default function PostActions({
  postId,
  initialLikes,
  initialComments,
  likesData,
  commentsData
}: PostActionsProps) {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [commentsCount, setCommentsCount] = useState(initialComments)

  useEffect(() => {
    if (userId) {
      setIsLiked(likesData.some((like) => like.userId === userId))
    }
  }, [likesData, userId])

  const handleLikeClicked = async () => {
    if (loading || !userId) return
    setLoading(true)

    setIsLiked((prev) => !prev)
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1))

    try {
      await fetcher('/api/post/actionPost', {
        method: 'POST',
        body: JSON.stringify({ postId, type: 'like' })
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra')

      setIsLiked((prev) => !prev)
      setLikes((prev) => (isLiked ? prev + 1 : prev - 1))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col px-2'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <ButtonAction
            icon={
              isLiked ? (
                <Heart className='w-5 h-4 text-red-500 fill-red-500' />
              ) : (
                <Heart className='w-5 h-5 text-gray-600' />
              )
            }
            items={likes}
            onClick={handleLikeClicked}
          />
          <ButtonAction
            icon={<MessageCircle className='w-5 h-5' />}
            items={commentsCount}
            onClick={() => {}}
          />
        </div>
      </div>

      {/* Render phần bình luận */}
      <PostComment
        commentsData={commentsData}
        postId={postId}
        updateCommentsCount={() => setCommentsCount((prev) => prev + 1)}
      />
    </div>
  )
}
