import { useMemo } from 'react'
import { Rss, Settings, Users, BookOpen, Image } from 'lucide-react'

const useStaticRoutes = () => {
  return useMemo(
    () => [
      { label: 'Feed', href: '/feed', icon: Rss, disabled: true },
      { label: 'Friends', href: '/friends', icon: Users, disabled: true },
      { label: 'Stories', href: '/stories', icon: BookOpen, disabled: true },
      { label: 'Memories', href: '/memories', icon: Image, disabled: true },
      { label: 'Settings', href: '/settings', icon: Settings, disabled: false }
    ],
    []
  )
}

export default useStaticRoutes
