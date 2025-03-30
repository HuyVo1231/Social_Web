import { Channel } from 'pusher-js'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import activeUsersStore from '../zustand/activeUsers'
import { pusherClient } from '../libs/pusher'

const UseActiveUsers = () => {
  const { data: session } = useSession()
  const { addUser, removeUser, setActiveList } = activeUsersStore()
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null)

  useEffect(() => {
    if (!session?.user) return

    let channel = activeChannel
    if (!channel) {
      channel = pusherClient.subscribe('presence-online-users')
      setActiveChannel(channel)
    }

    channel.bind('pusher:subscription_succeeded', (members) => {
      const listUser: string[] = []
      members.each((member) => {
        listUser.push(member.id)
      })
      setActiveList(listUser)
    })

    channel.bind('pusher:member_added', (member) => {
      addUser(member.id)
    })

    channel.bind('pusher:member_removed', (member) => {
      removeUser(member.id)
    })

    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe('presence-online-users')
        setActiveChannel(null)
      }
    }
  }, [session?.user, activeChannel, setActiveList, addUser, removeUser])

  return null
}

export default UseActiveUsers
