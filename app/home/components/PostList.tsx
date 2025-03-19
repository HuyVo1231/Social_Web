import { PostType } from '@/app/types'
import Post from './post/Post'

interface PostListProps {
  posts: PostType[]
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div className='space-y-4'>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  )
}
