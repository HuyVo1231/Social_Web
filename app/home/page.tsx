'use client'

import { useEffect, useState } from 'react'
import { PostType } from '../types'
import Header from './components/Header'
import PostList from './components/PostList'
import toast from 'react-hot-toast'
import { fetcher } from '../libs/fetcher'

export default function HomePage() {
  const [posts, setPosts] = useState<PostType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        try {
          const responseData = await fetcher('/api/post/getPosts', {
            method: 'GET'
          })
          setPosts(responseData.posts)
        } catch (error) {
          toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra')
        } finally {
          setLoading(false)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div className='flex'>
      <div className='overflow-y-auto rounded-md bg-gray-100 w-full'>
        <Header />
        <div className='flex flex-col gap-4'>
          {loading ? (
            <p>Đang tải bài viết...</p>
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
