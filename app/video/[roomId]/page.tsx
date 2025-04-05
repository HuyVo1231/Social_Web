'use client'

import { use, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { TwilioVideo } from './components/TwilioVideo'

interface VideoCallPageProps {
  params: Promise<{ roomId: string }>
}

export default function VideoCallPage({ params }: VideoCallPageProps) {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  // ✅ Sử dụng use() để unwrap params (bắt buộc trong Next.js mới)
  const { roomId } = use(params)

  if (!token) {
    return <div>Missing token for video call</div>
  }

  if (!roomId) {
    return <div>Missing room for video call</div>
  }

  return (
    <div className='h-screen w-screen bg-black'>
      <Suspense fallback={<div>Loading video...</div>}>
        <TwilioVideo token={token} room={roomId} />
      </Suspense>
    </div>
  )
}
