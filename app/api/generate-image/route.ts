import { NextResponse } from 'next/server'
import { fal } from '@fal-ai/client'

fal.config({
  credentials: process.env.FAL_KEY
})

export async function POST(req: Request) {
  const { prompt } = await req.json()
  try {
    const result = await fal.subscribe('fal-ai/flux/dev', {
      input: {
        prompt
      }
    })
    console.log('result genarate image: ', result)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error generating image:', error)
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 })
  }
}
