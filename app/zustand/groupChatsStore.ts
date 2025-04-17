import { create } from 'zustand'

type GroupChat = {
  id: string
  name: string
  image?: string
  memberCount: number
}

type GroupChatsStore = {
  groupChats: GroupChat[]
  setGroupChats: (groupChats: GroupChat[]) => void
}

const useGroupChatsStore = create<GroupChatsStore>((set) => ({
  groupChats: [],
  setGroupChats: (groupChats) => set({ groupChats })
}))

export default useGroupChatsStore
