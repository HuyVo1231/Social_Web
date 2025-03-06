import { authOptions } from '@/app/utils/authOption'
import { getServerSession } from 'next-auth'
export default async function getSession() {
  return await getServerSession(authOptions)
}
