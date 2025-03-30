import { create } from 'zustand'

interface ActiveUsersStore {
  listActiveUser: string[]
  addUser: (userId: string) => void
  removeUser: (userId: string) => void
  setActiveList: (users: string[]) => void
}

const activeUsers = create<ActiveUsersStore>((set) => ({
  listActiveUser: [],
  addUser: (userId: string) =>
    set((state) => ({
      listActiveUser: [...state.listActiveUser, userId]
    })),
  removeUser: (userId) =>
    set((state) => ({
      listActiveUser: state.listActiveUser.filter((user) => user !== userId)
    })),
  setActiveList: (users) => set({ listActiveUser: users })
}))

export default activeUsers
