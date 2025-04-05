'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { pusherClient } from '../libs/pusher'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const IncomingCall = () => {
  const [isClient, setIsClient] = useState(false)
  const [incomingCall, setIncomingCall] = useState<{
    videoToken: string
    room: string
    callerName?: string
  } | null>(null)

  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (status !== 'authenticated' || !isClient) return

    const email = session.user?.email
    if (!email) return
    const channel = pusherClient.subscribe(`private-${email}`)

    const handler = (data: { videoToken: string; room: string; callerName?: string }) => {
      if (pathname?.includes(`/video/${data.room}`)) return
      setIncomingCall(data)
    }

    channel.bind('video-call-incoming', handler)

    return () => {
      channel.unbind('video-call-incoming', handler)
      pusherClient.unsubscribe(`private-${email}`)
    }
  }, [session, status, router, isClient, pathname])

  const acceptCall = () => {
    if (!incomingCall) return
    router.push(`/video/${incomingCall.room}?token=${incomingCall.videoToken}`)
    setIncomingCall(null)
  }

  const declineCall = () => {
    setIncomingCall(null)
  }

  return (
    <Dialog open={!!incomingCall} onOpenChange={(open) => !open && declineCall()}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>📞 Cuộc gọi đến</DialogTitle>
        </DialogHeader>
        <div className='text-center text-gray-600'>
          {incomingCall?.callerName
            ? `${incomingCall.callerName} đang gọi cho bạn`
            : 'Bạn có cuộc gọi đến'}
        </div>
        <DialogFooter className='mt-4 flex justify-center gap-4'>
          <Button variant='success' onClick={acceptCall}>
            Chấp nhận
          </Button>
          <Button variant='destructive' onClick={declineCall}>
            Từ chối
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default IncomingCall
