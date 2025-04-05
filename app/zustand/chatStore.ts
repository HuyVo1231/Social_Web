import { create } from 'zustand'
import { Message, User } from '@prisma/client'

interface ChatState {
  openChats: { conversationId: string; user: User }[]
  messages: Record<string, Message[]>

  openChat: (conversationId: string, user: User) => void
  closeChat: (conversationId: string) => void
  addMessage: (conversationId: string, message: Message) => void
}

const useChatStore = create<ChatState>((set) => ({
  openChats: [],
  messages: {},

  openChat: (conversationId, user) => {
    set((state) => ({
      openChats: state.openChats.some((chat) => chat.conversationId === conversationId)
        ? state.openChats
        : [...state.openChats, { conversationId, user }]
    }))
  },

  closeChat: (conversationId) => {
    set((state) => ({
      openChats: state.openChats.filter((chat) => chat.conversationId !== conversationId)
    }))
  },

  addMessage: (conversationId, message) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), message]
      }
    }))
  }
}))

export default useChatStore
