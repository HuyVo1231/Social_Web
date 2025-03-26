'use client'

import PostList from '@/app/home/components/PostList'
import { useState } from 'react'
import { ClipLoader } from 'react-spinners'
import { PostType } from '@/app/types'

export default function ProfilePosts({ initPosts }: { initPosts: PostType[] }) {
  const [posts, setPosts] = useState<PostType[]>(initPosts || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className='flex justify-center'>
      {loading ? (
        <div className='flex justify-center items-center h-20'>
          <ClipLoader color='#3B82F6' size={30} />
        </div>
      ) : error ? (
        <p className='text-red-500'>{error}</p>
      ) : (
        <div className='w-full max-w-3xl'>
          {posts.length > 0 ? (
            <PostList posts={posts} />
          ) : (
            <p className='text-center'>Chưa có bài viết nào</p>
          )}
        </div>
      )}
    </div>
  )
}
