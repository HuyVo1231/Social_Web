import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json()

    if (!imageUrl) {
      return NextResponse.json({ error: 'Thiếu imageUrl' }, { status: 400 })
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Viết 1 đoạn caption cho bức ảnh này.' },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      max_tokens: 100
    })

    const caption = response.choices[0]?.message?.content ?? 'Không tạo được caption.'
    return NextResponse.json({ caption })
  } catch (error) {
    console.error('Lỗi OpenAI:', error)
    return NextResponse.json({ error: 'Lỗi khi gọi OpenAI API' }, { status: 500 })
  }
}
