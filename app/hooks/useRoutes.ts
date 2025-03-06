import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { HiUsers } from 'react-icons/hi2'
import { IoHomeOutline } from 'react-icons/io5'
import useProfile from './useProfile'

const useRoutes = () => {
  const pathname = usePathname()
  const { profileId } = useProfile()

  const routes = useMemo(
    () => [
      {
        label: 'Home',
        href: '/home',
        icon: IoHomeOutline,
        active: pathname === '/home' || !!profileId
      },
      {
        label: 'Profile',
        href: '/profile',
        icon: HiUsers,
        active: pathname === '/profile'
      }
    ],
    [pathname, profileId]
  )

  return routes
}

export default useRoutes
