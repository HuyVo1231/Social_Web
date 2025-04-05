import { User } from '@prisma/client'
import { create } from 'zustand'

interface FriendsStore {
  friends: User[]
  addFriend: (friend: User) => void
  setFriends: (friends: User[]) => void
  removeFriend: (userId: string) => void
}

const useFriendStore = create<FriendsStore>((set) => ({
  friends: [],
  addFriend: (friend) => set((state) => ({ friends: [...state.friends, friend] })),
  setFriends: (friends) => set({ friends }),
  removeFriend: (userId) =>
    set((state) => ({ friends: state.friends.filter((friend) => friend.id !== userId) }))
}))

export default useFriendStore
