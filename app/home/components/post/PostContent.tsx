import { PostMedia } from './PostMedia'

interface PostContentProps {
  text: string
  images: string[]
  videos: string[]
}

export default function PostContent({ text, images, videos }: PostContentProps) {
  return (
    <div className='px-2 py-0'>
      <p className='text-gray-800'>{text}</p>
      <PostMedia images={images} videos={videos} />
    </div>
  )
}
