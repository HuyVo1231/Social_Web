'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface LeaveGroupConfirmModalProps {
  onConfirm: () => void
  trigger: React.ReactNode
}

const LeaveGroupConfirmModal: React.FC<LeaveGroupConfirmModalProps> = ({ onConfirm, trigger }) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const handleConfirm = () => {
    onConfirm()
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='z-[101]'>
        <DialogHeader>
          <DialogTitle>Bạn có chắc muốn rời khỏi nhóm?</DialogTitle>
          <DialogDescription>
            Sau khi rời nhóm, bạn sẽ không thể xem tin nhắn của nhóm này nữa.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex justify-end gap-3'>
          <Button variant='outline' onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button variant='destructive' onClick={handleConfirm}>
            Rời nhóm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default LeaveGroupConfirmModal
