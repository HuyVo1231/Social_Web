import PostImages from './PostImages'

interface PostContentProps {
  text: string
  images: string[]
}

export default function PostContent({ text, images }: PostContentProps) {
  return (
    <div className='px-2 py-0'>
      <p className='text-gray-800'>{text}</p>
      <PostImages images={images} />
    </div>
  )
}
