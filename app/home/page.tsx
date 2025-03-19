'use client'

import { useEffect, useState } from 'react'
import Header from './components/Header'
import PostList from './components/PostList'
import toast from 'react-hot-toast'
import { fetcher } from '../libs/fetcher'
import { usePostStore } from '../zustand/postStore'
import { ClipLoader } from 'react-spinners'

export default function HomePage() {
  const { posts, setPosts } = usePostStore()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const responseData = await fetcher('/api/post/getPosts', { method: 'GET' })
        setPosts(responseData.posts)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra')
        setError(error instanceof Error ? error.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [setPosts])

  return (
    <div className='flex'>
      <div className='overflow-y-auto rounded-md bg-white w-full'>
        <Header />
        <div className='flex flex-col gap-4'>
          {loading ? (
            <div className='flex justify-center items-center h-20'>
              <ClipLoader color='#3B82F6' size={30} />
            </div>
          ) : error ? (
            <p className='text-red-500'>{error}</p>
          ) : (
            <PostList posts={posts} />
          )}
        </div>
      </div>
    </div>
  )
}
