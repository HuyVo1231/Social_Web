'use client'

import { User } from '@prisma/client'
import CP_Avatar from '../Avatar/Avatar'
import AvatarGroup from '../Avatar/AvatarGroup'
import { useCallback, useState } from 'react'
import { fetcher } from '@/app/libs/fetcher'
import { X, Video, LogOut } from 'lucide-react'
import LeaveGroupConfirmModal from './LeaveGroupConfirmModal'
import toast from 'react-hot-toast'

export interface HeaderChatBoxProps {
  user: User
  isOnline: boolean
  conversationId: string
  closeChat: (conversationId: string) => void
  title: string
  isGroup?: boolean
  members?: User[]
  onLeaveConversation?: () => void
}

const HeaderChatBox: React.FC<HeaderChatBoxProps> = ({
  user,
  isOnline,
  conversationId,
  closeChat,
  title,
  isGroup,
  members = []
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVideoCall = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetcher('/api/callvideo/token', {
        method: 'POST',
        body: JSON.stringify({
          identity: user.id,
          room: conversationId,
          recipientEmail: user.email,
          callerName: user.name
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      window.location.href = `/video/${conversationId}?token=${data.token}`
    } catch (error: any) {
      console.error('Video call error:', error)
      setError(error.message || 'Failed to initiate video call')
    } finally {
      setLoading(false)
    }
  }, [user, conversationId])

  const handleCloseChat = useCallback(() => {
    closeChat(conversationId)
  }, [closeChat, conversationId])

  const handleLeaveConversation = async () => {
    const response = await fetcher('/api/conversations/leaveConversation', {
      method: 'POST',
      body: JSON.stringify({
        conversationId: conversationId
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response) {
      console.error('Failed to leave the group')
      return
    }

    toast.success('Leave the group success')

    closeChat(conversationId)
  }

  return (
    <div className='flex items-center justify-between p-2 border-b bg-blue-200 rounded-lg'>
      <div className='flex items-center gap-3'>
        <div className='relative'>
          {isGroup ? (
            <AvatarGroup users={members} />
          ) : (
            <CP_Avatar src={user.image || '/images/placeholder.jpg'} isOnline={isOnline} />
          )}
        </div>
        <span className='font-semibold text-gray-900'>{title}</span>
      </div>
      <div className='flex gap-3'>
        {isGroup && (
          <LeaveGroupConfirmModal
            onConfirm={handleLeaveConversation}
            trigger={
              <button className='text-gray-500 hover:text-yellow-600' title='Rời khỏi nhóm'>
                <LogOut size={20} />
              </button>
            }
          />
        )}
        <button
          onClick={handleVideoCall}
          className='text-gray-500 hover:text-blue-500'
          disabled={loading}>
          <Video size={20} />
        </button>
        {loading && <span className='text-sm text-gray-500'>Loading...</span>}
        {error && <span className='text-sm text-red-500'>{error}</span>}
        <button onClick={handleCloseChat} className='text-gray-500 hover:text-red-500'>
          <X size={20} />
        </button>
      </div>
    </div>
  )
}

export default HeaderChatBox
