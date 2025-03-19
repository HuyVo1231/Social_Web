import { create } from 'zustand'
import { PostType } from '@/app/types'

interface PostStore {
  posts: PostType[]
  addPost: (post: PostType) => void
  setPosts: (posts: PostType[]) => void
}

export const usePostStore = create<PostStore>((set) => ({
  posts: [],
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  setPosts: (posts) => set({ posts })
}))
