import { useSession } from 'next-auth/react'
import { usePathname, useParams } from 'next/navigation'

export default function useProfile() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const params = useParams()

  const userId = session?.user?.id // ID của user đang đăng nhập
  const profileId = params?.profileId as string | undefined // ID của profile trong URL (nếu có)

  // Nếu đang ở /profile => Đây là profile của user đang login
  // Nếu ở /profile/:id => Kiểm tra profileId có trùng userId không
  const isOwnProfile = pathname === '/profile' || userId === profileId

  return { isOwnProfile, profileId: profileId || '' }
}
