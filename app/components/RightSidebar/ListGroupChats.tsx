'use client'

import { useEffect, useState } from 'react'
import { MdOutlineGroupAdd } from 'react-icons/md'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import GroupChatBox from './GroupChatBox'
import useFriendStore from '@/app/zustand/friendsStore'
import { pusherClient } from '@/app/libs/pusher'
import { FullConversationType } from '@/app/types'
import useGroupConversationStore from '@/app/zustand/groupConversation'
import { fetcher } from '@/app/libs/fetcher'
import CreateGroupModal from './CreateGroupModal'
import useChatStore from '@/app/zustand/chatStore'

const ListGroupChats = () => {
  const { data: session } = useSession()
  const currentEmail = session?.user?.email
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const friends = useFriendStore((state) => state.friends)
  const groupConversations = useGroupConversationStore((state) => {
    return state.groupConversations
  })
  const setGroupConversations = useGroupConversationStore((state) => state.setGroups)
  const addGroupConversation = useGroupConversationStore((state) => state.addGroup)
  const updateGroupConversation = useGroupConversationStore((state) => state.updateGroup)

  const handleDropdownToggle = (id: string | null) => {
    setOpenDropdownId((prev) => (prev === id ? null : id))
  }

  useEffect(() => {
    const fetchGroupConversations = async () => {
      try {
        const res = await fetcher('/api/conversations/getGroupConversation')
        setGroupConversations(res)
      } catch (err) {
        console.error('Lỗi khi fetch group conversations', err)
      }
    }

    fetchGroupConversations()
  }, [setGroupConversations])

  useEffect(() => {
    if (!currentEmail) {
      return
    }

    // Xử lý khi tạo nhóm mới
    const handleNewConversation = (conversation: FullConversationType) => {
      if (conversation.isGroup) {
        addGroupConversation(conversation)
      }
    }

    // Xử lý khi thêm thành viên mới vào nhóm
    const handleAddMember = (data: { conversation: FullConversationType }) => {
      if (data.conversation.isGroup) {
        addGroupConversation(data.conversation)
      }
    }

    // Xử lý cập nhật nhóm (cho thành viên hiện tại)

    const handleConversationUpdate = ({
      conversation,
      action
    }: {
      conversation: FullConversationType
      action: string
    }) => {
      if (conversation.isGroup) {
        updateGroupConversation(conversation)

        if (action === 'user_left') {
          // Cập nhật chatStore nếu cuộc trò chuyện đang mở
          const chatStore = useChatStore.getState()
          const openChats = chatStore.openChats
          const isChatOpen = openChats.some((chat) => chat.conversationId === conversation.id)

          if (isChatOpen) {
            const updatedOpenChats = openChats.map((chat) =>
              chat.conversationId === conversation.id
                ? {
                    ...conversation, // Lấy dữ liệu mới từ conversation cập nhật
                    conversationId: conversation.id, // Đảm bảo đúng field cho chatStore
                    group: true
                  }
                : chat
            )
            console.log('updatedOpenChats: ', updatedOpenChats)
            useChatStore.setState({ openChats: updatedOpenChats })
          }
        }
      }
    }

    pusherClient.subscribe(currentEmail)
    pusherClient.bind('newConversation', handleNewConversation)
    pusherClient.bind('add_member', handleAddMember)
    pusherClient.bind('conversation:update', handleConversationUpdate)

    return () => {
      pusherClient.unbind('newConversation', handleNewConversation)
      pusherClient.unbind('add_member', handleAddMember)
      pusherClient.unbind('conversation:update', handleConversationUpdate)
      pusherClient.unsubscribe(currentEmail)
    }
  }, [currentEmail, addGroupConversation, updateGroupConversation])

  return (
    <>
      <CreateGroupModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} friends={friends} />

      <div>
        <div className='flex items-center justify-between mb-3'>
          <h2 className='text-sm font-semibold text-black -tracking-tighter'>Nhóm trò chuyện</h2>
          <Button
            variant='ghost'
            size='icon'
            className='p-1 hover:bg-gray-100'
            onClick={() => {
              console.log('Create group button clicked')
              setIsModalOpen(true)
            }}>
            <MdOutlineGroupAdd size={20} className='text-gray-700' />
          </Button>
        </div>

        {groupConversations.length === 0 ? (
          <p className='text-gray-500 text-sm'>Không có nhóm nào.</p>
        ) : (
          <div className='space-y-1'>
            {groupConversations.map((group) => (
              <GroupChatBox
                members={group.users}
                key={group.id}
                id={group.id}
                name={group.name || 'Không name'}
                isOpen={openDropdownId === group.id}
                onToggle={() => handleDropdownToggle(group.id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default ListGroupChats
