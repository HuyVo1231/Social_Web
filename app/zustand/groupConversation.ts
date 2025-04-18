import { create } from 'zustand'
import { FullConversationType } from '@/app/types'

interface GroupState {
  groupConversations: FullConversationType[]
  setGroups: (groups: FullConversationType[]) => void
  updateGroup: (group: FullConversationType) => void
  addGroup: (group: FullConversationType) => void
  removeGroup: (groupId: string) => void
}

const useGroupConversationStore = create<GroupState>((set) => ({
  groupConversations: [],
  setGroups: (groups) => set({ groupConversations: groups }),
  addGroup: (group) =>
    set((state) => {
      const exists = state.groupConversations.some((g) => g.id === group.id)
      if (exists) return state
      return { groupConversations: [group, ...state.groupConversations] }
    }),
  updateGroup: (updatedGroup: FullConversationType) =>
    set((state) => ({
      groupConversations: state.groupConversations.map((conv) =>
        conv.id === updatedGroup.id ? updatedGroup : conv
      )
    })),
  removeGroup: (groupId) =>
    set((state) => ({
      groupConversations: state.groupConversations.filter((g) => g.id !== groupId)
    }))
}))

export default useGroupConversationStore
