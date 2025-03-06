import { PostType } from '@/app/types'
import Post from './post/Post'

interface PostListProps {
  posts: PostType[]
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div className='space-y-4'>
      {posts.map((post) => (
        <Post
          key={post.id}
          avatar={
            post.user.image ||
            'https://scontent.fvkg1-1.fna.fbcdn.net/v/t39.30808-6/480278795_1659648031651022_4900478346946528903_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHxcCV6AN-hlpyHHRJn8RKovkoG7NWa8l--Sgbs1ZryX55lHAfaUf-swrkikYnxMrOvwzjLbPh7HGtxfutXkSXJ&_nc_ohc=zyGLw_bNpj4Q7kNvgF_aoE-&_nc_oc=AdhguhQr3e3tmWxdYwFt6SkIbFIDch9V2fNzMX8mBujb1fshgLl6TiPhGZeWLZ8w2HE&_nc_zt=23&_nc_ht=scontent.fvkg1-1.fna&_nc_gid=ApWm6eWg9R2dT_4x4-Vj243&oh=00_AYAh-0ikPmNmRUj7zWV4tCQuGHtijLgms3lFPqfckexIVQ&oe=67CD7F5C'
          }
          name={post.user.name || 'Anonymous'}
          time={post.createdAt}
          text={post.body}
          images={post.image}
          likes={post.likes.length}
          comments={post.comments.length}
        />
      ))}
    </div>
  )
}
