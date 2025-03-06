import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface User {
  name?: string | null
  email?: string | null
  image?: string | null
}

interface UserState {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
}

const useUserStore = create(
  persist<UserState>(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null })
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

export default useUserStore
