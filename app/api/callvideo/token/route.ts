import getCurrentUser from '@/app/actions/users/getCurrentUser'
import { pusherServer } from '@/app/libs/pusher'
import { NextResponse } from 'next/server'
import AccessToken from 'twilio/lib/jwt/AccessToken'
import { VideoGrant } from 'twilio/lib/jwt/AccessToken'

export async function POST(req: Request) {
  try {
    // Lấy thông tin người gọi (caller)
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Lấy thông tin người nhận (recipient) từ request body
    const { recipientEmail, room } = await req.json()

    if (!recipientEmail || !room) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Tạo identity duy nhất cho người gọi
    const callerIdentity = `caller-${currentUser.id}-${Date.now()}`

    // Tạo token cho người gọi
    const callerToken = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_API_KEY!,
      process.env.TWILIO_API_KEY_SECRET!,
      { identity: callerIdentity }
    )
    callerToken.addGrant(new VideoGrant({ room }))

    // Tạo identity duy nhất cho người nhận
    const recipientIdentity = `recipient-${currentUser.id}-${Date.now()}`

    // Tạo token cho người nhận
    const recipientToken = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_API_KEY!,
      process.env.TWILIO_API_KEY_SECRET!,
      { identity: recipientIdentity }
    )
    recipientToken.addGrant(new VideoGrant({ room }))

    // Gửi thông báo cho người nhận (chứa token của họ)
    await pusherServer.trigger(`private-${recipientEmail}`, 'video-call-incoming', {
      videoToken: recipientToken.toJwt(),
      room,
      callerName: currentUser.name
    })

    // Trả về token cho người gọi
    return NextResponse.json({
      success: true,
      token: callerToken.toJwt()
    })
  } catch (error) {
    console.error('Error generating video token:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
