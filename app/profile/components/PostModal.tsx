'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import Post from '@/app/home/components/post/Post'

interface PostModalProps {
  postId: string
  onClose: () => void
}

export default function PostModal({ postId, onClose }: PostModalProps) {
  const [post, setPost] = useState(null)

  useEffect(() => {
    async function fetchPost() {
      const res = await fetch(`/api/posts/${postId}`)
      const data = await res.json()
      setPost(data)
    }
    fetchPost()
  }, [postId])

  if (!post) return null

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl p-4 bg-white rounded-lg shadow-lg'>
        <Post post={post} />
      </DialogContent>
    </Dialog>
  )
}
