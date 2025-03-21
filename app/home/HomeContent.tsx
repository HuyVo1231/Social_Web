'use client'

import { useState, useEffect } from 'react'
import Header from './components/Header'
import PostList from './components/PostList'
import { usePostStore } from '../zustand/postStore'
import { ClipLoader } from 'react-spinners'
import { PostType } from '../types'

interface HomeContentProps {
  posts: PostType[]
}

export default function HomeContent({ posts: initialPosts }: HomeContentProps) {
  const { posts, setPosts } = usePostStore()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setPosts(initialPosts)
    setLoading(false)
  }, [initialPosts, setPosts])

  return (
    <div className='flex'>
      <div className='overflow-y-auto rounded-md bg-white w-full'>
        <Header />
        <div className='flex flex-col gap-4'>
          {loading ? (
            <div className='flex justify-center items-center h-20'>
              <ClipLoader color='#3B82F6' size={30} />
            </div>
          ) : posts.length === 0 ? (
            <div className='flex justify-center items-center h-20 text-gray-500'>
              Không có bài viết nào.
            </div>
          ) : (
            <PostList posts={posts} />
          )}
        </div>
      </div>
    </div>
  )
}
