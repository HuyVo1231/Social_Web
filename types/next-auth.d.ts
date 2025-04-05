// types/next-auth.d.ts

import { DefaultSession } from 'next-auth'
import { User as PrismaUser } from '@prisma/client'

declare module 'next-auth' {
  // Cập nhật thông tin của session.user và thêm 'id' vào
  interface Session {
    user: {
      id: string
      emailVerified: Date | null
    } & DefaultSession['user']
  }

  // Cập nhật User để thêm 'id' vào
  interface User extends PrismaUser {
    id: string
    emailVerified: Date | null
  }

  // Cập nhật JWT để thêm 'id' và 'emailVerified'
  interface JWT {
    id: string
    emailVerified: Date | null
  }
}
