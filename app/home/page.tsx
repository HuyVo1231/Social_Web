import { getPosts } from '../actions/posts/getPosts'
import HomeContent from './HomeContent'

export default async function HomePage() {
  const posts = await getPosts()
  return <HomeContent posts={posts} />
}
