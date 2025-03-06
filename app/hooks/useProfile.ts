import { useParams } from 'next/navigation'
import { useMemo } from 'react'

const useProfile = () => {
  const params = useParams()

  const profileId = useMemo(() => {
    if (!params?.profileId) {
      return ''
    }
    return params.profileId as string
  }, [params?.profileId])

  const isOpen = useMemo(() => !!params?.profileId, [profileId])

  return useMemo(
    () => ({
      isOpen,
      profileId
    }),
    [isOpen, profileId]
  )
}

export default useProfile
