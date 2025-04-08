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
  friendshipStatus: 'ACCEPTED' | 'PENDING' | 'SELF' | null
  user: User
  likes: Like[]
  comments: (Comment & { user: User })[]
}

export type ProfileType = {
  coverCrop?: { x: number; y: number }
  bio: string
  name: string
  image: string | null
  imageThumbnail: string | null
  location: string | null
  work: string | null
  education: string | null
  relationship: string | null
  website: string | null
  skills: string | null
  hobbies: string[] | []
  friendsCount: number
  friendshipStatus: 'ACCEPTED' | 'PENDING' | null
  photos: string[]
  imageCrop?: { x: number; y: number }
  friends: {
    id: string
    name: string
    image: string | null
    mutualFriends: number
  }[]
  posts: (Post & {
    user: User
    likes: Like[]
    comments: (Comment & { user: User })[]
  })[]
}
