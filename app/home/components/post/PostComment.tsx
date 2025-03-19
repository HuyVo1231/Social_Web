'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import PostAvatar from './PostAvatar'
import useUserStore from '@/app/zustand/userStore'
import Comment from './Comment'
import { Comment as CommentType, User } from '@prisma/client'
import { useState } from 'react'
import { fetcher } from '@/app/libs/fetcher'
import toast from 'react-hot-toast'

type CommentFormValues = {
  body: string
}

interface PostCommentProps {
  commentsData: (CommentType & { user: User })[]
  postId: string
  updateCommentsCount: () => void
}

export default function PostComment({
  commentsData,
  postId,
  updateCommentsCount
}: PostCommentProps) {
  const user = useUserStore((state) => state.user)

  const [allComments, setAllComments] = useState(commentsData) // Lưu toàn bộ bình luận
  const [showAllComment, setShowAllComment] = useState(false)

  // Danh sách hiển thị
  const comments = showAllComment ? allComments : allComments.slice(0, 2)

  const { register, handleSubmit, reset } = useForm<CommentFormValues>({
    defaultValues: { body: '' }
  })

  // Handle Comment.
  const onSubmit: SubmitHandler<CommentFormValues> = async (data) => {
    if (!user) return

    try {
      const response = await fetcher('/api/post/actionPost', {
        method: 'POST',
        body: JSON.stringify({ postId, type: 'comment', commentBody: data.body })
      })

      if (response?.comment) {
        setAllComments((prev) => [response.comment, ...prev]) // Thêm vào danh sách đầy đủ
        updateCommentsCount()
        reset()
      }
    } catch (error) {
      console.error('Lỗi khi gửi bình luận:', error)
      toast.error('Có lỗi xảy ra khi gửi bình luận')
    }
  }

  return (
    <div className='p-2 flex flex-col gap-2'>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          userImage={comment.user.image || ''}
          username={comment.user.name || 'undefined'}
          content={comment.body}
          createdAt={comment.createdAt}
        />
      ))}

      {/* Nút "Xem thêm" nếu có hơn 2 bình luận */}
      {allComments.length > 2 && !showAllComment && (
        <button
          className='text-sm text-blue-500 hover:underline self-start'
          onClick={() => setShowAllComment(true)}>
          Xem thêm bình luận
        </button>
      )}

      {/* Ô nhập bình luận */}
      <form onSubmit={handleSubmit(onSubmit)} className='flex items-center gap-2 border-t pt-2'>
        <PostAvatar src={user?.image || '/images/placeholder.jpg'} />
        <Input
          placeholder='Viết bình luận...'
          className='flex-1'
          {...register('body', { required: true })}
        />
        <Button size='sm' type='submit'>
          Bình luận
        </Button>
      </form>
    </div>
  )
}
