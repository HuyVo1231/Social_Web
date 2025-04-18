'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import UserMultiSelect from './UserMultiSelect'
import { User } from '@prisma/client'
import { fetcher } from '@/app/libs/fetcher'

interface CreateGroupModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  friends: User[]
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onOpenChange, friends }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      name: '',
      members: [] as string[]
    }
  })

  const members = watch('members')

  const onSubmit = async (data: any) => {
    if (data.members.length < 2) {
      toast.error('Cần ít nhất 2 thành viên để tạo nhóm.')
      return
    }

    setIsLoading(true)
    try {
      await fetcher('/api/conversations', {
        method: 'POST',
        body: JSON.stringify({ ...data, isGroup: true })
      })

      toast.success('Tạo nhóm thành công!')
      router.refresh()
      onOpenChange(false)
      reset()
    } catch (err: any) {
      toast.error(err.message || 'Đã xảy ra lỗi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Tạo nhóm trò chuyện</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <Input
            placeholder='Tên nhóm'
            {...register('name', { required: true })}
            disabled={isLoading}
          />

          <UserMultiSelect
            selectedIds={members}
            onChange={(selected) => setValue('members', selected, { shouldValidate: true })}
            friends={friends}
            isDisabled={isLoading}
          />

          <div className='flex justify-end gap-2 pt-4'>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              Huỷ
            </Button>
            <Button type='submit' disabled={isLoading}>
              Tạo nhóm
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateGroupModal
