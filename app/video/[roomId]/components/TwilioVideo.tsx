import { useEffect, useRef, useState } from 'react'
import { connect, Room } from 'twilio-video'

interface TwilioVideoProps {
  token: string
  room: string
}

export function TwilioVideo({ token, room }: TwilioVideoProps) {
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState<boolean>(true)
  const localVideoRef = useRef<HTMLDivElement>(null)
  const remoteVideoRef = useRef<HTMLDivElement>(null)
  const roomRef = useRef<Room | null>(null)

  useEffect(() => {
    const connectToRoom = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: { width: 640, facingMode: 'user' }
        })

        // Hiển thị video local
        if (localVideoRef.current) {
          const videoElement = document.createElement('video')
          videoElement.srcObject = stream
          videoElement.autoplay = true
          videoElement.muted = true
          videoElement.className = 'rounded-lg shadow-lg'
          localVideoRef.current.appendChild(videoElement)
        }

        // Kết nối vào phòng Twilio
        const roomInstance = await connect(token, {
          name: room,
          audio: true,
          video: true
        })

        roomRef.current = roomInstance // Lưu lại room để ngắt kết nối sau này

        // Xử lý khi participant tham gia
        roomInstance.on('participantConnected', (participant) => {
          participant.tracks.forEach((publication) => {
            if (publication.track) {
              attachTrack(publication.track)
            }
          })

          participant.on('trackSubscribed', attachTrack)
        })

        // Xử lý khi participant rời phòng
        roomInstance.on('participantDisconnected', (participant) => {
          participant.tracks.forEach((publication) => {
            if (publication.track) {
              publication.track.detach().forEach((el) => el.remove())
            }
          })
        })

        // Lưu local tracks để có thể ngắt kết nối sau này
        roomInstance.localParticipant.tracks.forEach((publication) => {
          if (publication.track) {
            attachTrack(publication.track)
          }
        })
      } catch (err: any) {
        console.error('Error connecting to room:', err)
        setError(err.message)
      }
    }

    const attachTrack = (track: any) => {
      if (track.kind === 'video' && remoteVideoRef.current) {
        const element = track.attach()
        element.className = 'w-full h-full object-cover rounded-lg'
        remoteVideoRef.current.appendChild(element)
      }
      if (track.kind === 'audio') {
        document.body.appendChild(track.attach()) // Gắn audio vào trang để nghe
      }
    }

    connectToRoom()

    return () => {
      disconnectFromRoom()
    }
  }, [token, room])

  const disconnectFromRoom = () => {
    if (roomRef.current) {
      roomRef.current.disconnect()
      roomRef.current = null
    }

    if (localVideoRef.current) {
      localVideoRef.current.innerHTML = ''
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.innerHTML = ''
    }

    setIsConnected(false)
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center h-full text-white bg-black'>
        <div className='text-xl font-semibold mb-4'>Lỗi kết nối video</div>
        <div className='mb-4'>{error}</div>
        <button
          onClick={() => window.location.reload()}
          className='px-4 py-2 bg-blue-500 rounded-lg shadow-md hover:bg-blue-600'>
          Thử lại
        </button>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className='flex flex-col items-center justify-center h-full bg-black text-white'>
        <div className='text-xl font-semibold mb-4'>Bạn đã rời khỏi cuộc gọi</div>
        <button
          onClick={() => window.location.reload()}
          className='px-4 py-2 bg-green-500 rounded-lg shadow-md hover:bg-green-600'>
          Gọi lại
        </button>
      </div>
    )
  }

  return (
    <div className='relative h-screen w-screen bg-black flex justify-center items-center'>
      {/* Remote video */}
      <div className='relative h-full w-full flex items-center justify-center'>
        <div
          ref={remoteVideoRef}
          className='w-full h-full flex items-center justify-center bg-gray-900 rounded-lg'>
          <p className='text-white opacity-50'>Đang kết nối...</p>
        </div>
        <div className='absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg shadow-md'>
          Người nhận
        </div>
      </div>

      {/* Local video */}
      <div className='absolute bottom-4 right-4 w-36 h-36 rounded-lg overflow-hidden border-2 border-blue-400 bg-gray-800 shadow-lg'>
        <div ref={localVideoRef} className='w-full h-full flex items-center justify-center'>
          <p className='text-white opacity-50'>Camera</p>
        </div>
      </div>

      {/* Nút Ngắt kết nối */}
      <button
        onClick={disconnectFromRoom}
        className='absolute top-4 right-4 px-4 py-2 bg-red-500 rounded-lg shadow-md hover:bg-red-600 text-white font-semibold'>
        Ngắt kết nối
      </button>
    </div>
  )
}
