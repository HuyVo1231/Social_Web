import { create } from 'zustand'
import { PostType } from '@/app/types'

interface PostStore {
  posts: PostType[]
  addPost: (post: PostType) => void
  setPosts: (posts: PostType[]) => void
}

export const usePostStore = create<PostStore>((set) => ({
  posts: [],
  addPost: (post) => {
    set((state) => {
      console.log('🆕 Post được thêm:', post)
      console.log('📦 State TRƯỚC:', state.posts)
      const newPosts = [post, ...state.posts]
      console.log('✅ State SAU:', newPosts)
      return { posts: newPosts }
    })
  },

  setPosts: (posts) => set({ posts })
}))
