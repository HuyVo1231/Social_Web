import { create } from 'zustand'

interface Friend {
  id: string
  name: string
  image: string
}

interface FriendsStore {
  friends: Friend[]
  addFriend: (friend: Friend) => void
  setFriends: (friends: Friend[]) => void
}

const useFriendsStore = create<FriendsStore>((set) => ({
  friends: [],
  addFriend: (friend) => set((state) => ({ friends: [...state.friends, friend] })),
  setFriends: (friends) => set({ friends })
}))

export default useFriendsStore
