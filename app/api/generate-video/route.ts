import { NextResponse } from 'next/server'
import { fal } from '@fal-ai/client'

fal.config({
  credentials: process.env.FAL_KEY
})

export async function POST(req: Request) {
  const { prompt } = await req.json()

  // fal-ai/ltx-video-v095 - model generate cho text sang video
  try {
    const result = await fal.subscribe('fal-ai/ltx-video-v095', {
      input: {
        prompt
      }
    })
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error generating image:', error)
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 })
  }
}
