import { fetcher } from '../libs/fetcher'

export const markPostAsSeen = async (userId: string, postId: string) => {
  try {
    const response = await fetcher('/api/post/seenPost', {
      method: 'POST',
      body: JSON.stringify({ userId, postId })
    })

    if (response) {
    } else {
      console.error(response)
    }
  } catch (error) {
    console.error('Error marking post as seen:', error)
  }
}
