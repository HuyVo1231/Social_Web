import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string,
  secret: process.env.PUSHER_SECRET as string,
  cluster: process.env.PUSHER_CLUSTER as string,
  useTLS: true
})

const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
  authEndpoint: '/api/pusher',
  auth: {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
})

export { pusherClient, pusherServer }
