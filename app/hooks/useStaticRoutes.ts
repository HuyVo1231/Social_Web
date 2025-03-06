import { useMemo } from 'react'
import { Rss, Settings, Users, BookOpen, Image } from 'lucide-react'

const useStaticRoutes = () => {
  return useMemo(
    () => [
      { label: 'Feed', href: '/feed', icon: Rss },
      { label: 'Friends', href: '/friends', icon: Users },
      { label: 'Stories', href: '/stories', icon: BookOpen },
      { label: 'Memories', href: '/memories', icon: Image },
      { label: 'Settings', href: '/settings', icon: Settings }
    ],
    []
  )
}

export default useStaticRoutes
