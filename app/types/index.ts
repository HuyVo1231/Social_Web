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
  comments: Comment[]
}
