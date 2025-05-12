'use client'

import { useCallback, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { fetcher } from '@/app/libs/fetcher'
import SuggestedGroupChatBox from './SuggestedGroupChatBox'
import { User } from '@prisma/client'
import useGroupConversationStore from '@/app/zustand/groupConversation'

interface GroupChat {
  id: string
  name: string | null
  users: Pick<User, 'id' | 'name' | 'image'>[]
  friendCount: number
  lastMessageAt: Date
}

interface SuggestedGroupChatsProps {
  groups: GroupChat[]
}

export default function SuggestedGroupChats({ groups: initialGroups }: SuggestedGroupChatsProps) {
  const [groups, setGroups] = useState<GroupChat[]>(initialGroups)
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({})
  const addGroupConversation = useGroupConversationStore((state) => state.addGroup)

  const handleJoinGroup = useCallback(
    async (groupId: string) => {
      if (loading[groupId]) return

      setLoading((prev) => ({ ...prev, [groupId]: true }))

      try {
        const res = await fetcher(`/api/conversations/joinGroup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId: groupId })
        })

        if (res) {
          setGroups((prevGroups) => prevGroups.filter((group) => group.id !== groupId))
          addGroupConversation(res)
        } else {
          console.error('Failed to join group')
        }
      } catch (error) {
        console.error('Error joining group:', error)
      } finally {
        setLoading((prev) => ({ ...prev, [groupId]: false }))
      }
    },
    [loading, addGroupConversation]
  )

  return (
    <div className='bg-gray-100 rounded-md py-2 px-4 w-full h-auto max-h-[300px] overflow-y-auto lg:block hidden'>
      <h3 className='font-medium text-sm text-gray-900 -tracking-tighter mb-2'>Suggested Groups</h3>
      <Separator />
      <div className='flex flex-col gap-2'>
        {groups.length > 0 ? (
          groups.map((group) => (
            <SuggestedGroupChatBox
              key={group.id}
              groupId={group.id}
              name={group.name}
              users={group.users}
              friendCount={group.friendCount}
              onJoinGroup={handleJoinGroup}
              loading={loading[group.id] || false}
            />
          ))
        ) : (
          <p className='text-gray-500 text-sm mt-2'>Không có nhóm gợi ý nào.</p>
        )}
      </div>
    </div>
  )
}
