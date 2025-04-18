'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { User } from '@prisma/client'
import { fetcher } from '@/app/libs/fetcher'
import UserMultiSelect from '../RightSidebar/UserMultiSelect'
import useFriendStore from '@/app/zustand/friendsStore'

interface AddGroupMembersModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  currentMembers: User[]
  conversationId: string
  onMembersAdded?: () => void
}

const AddGroupMembersModal: React.FC<AddGroupMembersModalProps> = ({
  isOpen,
  onOpenChange,
  currentMembers,
  conversationId,
  onMembersAdded
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { friends } = useFriendStore()
  const { handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      members: [] as string[]
    }
  })

  const members = watch('members')

  const onSubmit = async (data: { members: string[] }) => {
    if (data.members.length === 0) {
      toast.error('Vui lòng chọn ít nhất một người dùng.')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetcher('/api/conversations/addMembers', {
        method: 'POST',
        body: JSON.stringify({
          conversationId,
          newMemberIds: data.members
        })
      })

      if (!res) {
        throw new Error('Không thể thêm thành viên.')
      }

      toast.success('Đã thêm thành viên vào nhóm!')
      onOpenChange(false)
      reset()
      onMembersAdded?.()
    } catch (err: any) {
      toast.error(err.message || 'Đã xảy ra lỗi.')
    } finally {
      setIsLoading(false)
    }
  }

  // Lọc bạn bè chưa có trong nhóm
  const currentIds = currentMembers.map((u) => u.id)
  const selectableFriends = friends.filter((friend) => !currentIds.includes(friend.id))

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Thêm thành viên vào nhóm</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <UserMultiSelect
            selectedIds={members}
            onChange={(selected) => setValue('members', selected, { shouldValidate: true })}
            friends={selectableFriends}
            isDisabled={isLoading}
          />

          <div className='flex justify-end gap-2 pt-4'>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              Huỷ
            </Button>
            <Button type='submit' disabled={isLoading}>
              Thêm thành viên
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddGroupMembersModal
