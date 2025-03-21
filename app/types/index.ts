import { Conversation, Message, User, Notification, Friendship, Post, Like } from '@prisma/client'

export type FullMessageType = Message & {
  sender: User
  seen: User[]
}

export type FullConversationType = Conversation & {
  users: User[]
  messages: FullMessageType[]
}

export type NotificationType = Notification & {
  sender: User
  receiver: User
  friendship: Friendship
}

export type PostType = Post & {
  user: User
  likes: Like[]
  comments: (Comment & { user: User })[]
}

export type ProfileType = {
  name: string
  image: string | null
  location: string | null
  work: string | null
  education: string | null
  friendsCount: number
  isFriend?: boolean
  posts: (Post & {
    user: User
    likes: Like[]
    comments: (Comment & { user: User })[]
  })[]
}
