'use client'

import { useEffect, useState } from 'react'
import { MdOutlineGroupAdd } from 'react-icons/md'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FullConversationType } from '@/app/types'
import MultiSelect from '../MultiSelect/MultiSelect'
import useFriendStore from '@/app/zustand/friendsStore'
import GroupChatBox from './GroupChatBox'
import { fetcher } from '@/app/libs/fetcher'
import { pusherClient } from '@/app/libs/pusher'

interface Props {
  groupChats: FullConversationType[]
}

const ListGroupChats: React.FC<Props> = ({ groupChats }) => {
  const router = useRouter()
  const { data: session } = useSession()
  const currentEmail = session?.user?.email

  const [groupConversations, setGroupConversations] = useState(groupChats)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      name: '',
      members: [] as string[]
    }
  })

  const members = watch('members')
  const friends = useFriendStore((state) => state.friends)

  const handleDropdownToggle = (id: string | null) => {
    setOpenDropdownId((prev) => (prev === id ? null : id))
  }

  const handleCreateGroup = async (data: any) => {
    if (data.members.length < 2) {
      toast.error('Cần ít nhất 2 thành viên để tạo nhóm.')
      return
    }

    setIsLoading(true)
    try {
      await fetcher('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, isGroup: true })
      })

      toast.success('Tạo nhóm thành công!')
      router.refresh()
      setIsModalOpen(false)
      reset()
    } catch (err: any) {
      toast.error(err.message || 'Đã xảy ra lỗi.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!currentEmail) return

    const handleNewConversation = (conversation: FullConversationType) => {
      if (conversation.isGroup && !groupConversations.some((c) => c.id === conversation.id)) {
        setGroupConversations((prev) => [conversation, ...prev])
      }
    }

    pusherClient.subscribe(currentEmail)
    pusherClient.bind('newConversation', handleNewConversation)

    return () => {
      pusherClient.unbind('newConversation', handleNewConversation)
      pusherClient.unsubscribe(currentEmail)
    }
  }, [currentEmail, groupConversations])

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Tạo nhóm trò chuyện</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleCreateGroup)} className='space-y-4'>
            <Input
              placeholder='Tên nhóm'
              {...register('name', { required: true })}
              disabled={isLoading}
            />

            <MultiSelect
              value={members.map((id) => {
                const friend = friends.find((f) => f.id === id)
                return { value: id, label: friend?.name || 'Unknown' }
              })}
              options={friends.map((friend) => ({
                label: friend.name || 'Unknown',
                value: friend.id
              }))}
              onChange={(selected) =>
                setValue(
                  'members',
                  selected.map((s) => s.value),
                  { shouldValidate: true }
                )
              }
              isDisabled={isLoading}
            />

            <div className='flex justify-end gap-2 pt-4'>
              <Button type='button' variant='outline' onClick={() => setIsModalOpen(false)}>
                Huỷ
              </Button>
              <Button type='submit' disabled={isLoading}>
                Tạo nhóm
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Danh sách nhóm */}
      <div>
        <div className='flex items-center justify-between mb-3'>
          <h2 className='text-sm font-semibold text-black -tracking-tighter'>Nhóm trò chuyện</h2>
          <Button
            variant='ghost'
            size='icon'
            className='p-1 hover:bg-gray-100'
            onClick={() => setIsModalOpen(true)}>
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
