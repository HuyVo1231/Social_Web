'use client'

import { useState } from 'react'
import { MessageSquare, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([])
  const [input, setInput] = useState('')

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages([...messages, { text: input, sender: 'user' }])
    setInput('')
  }

  return (
    <div className='fixed bottom-4 right-4 z-50'>
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className='rounded-full w-12 h-12 flex items-center justify-center bg-blue-600 text-white shadow-lg hover:bg-blue-700'>
          <MessageSquare size={20} />
        </Button>
      ) : (
        <Card className='w-80 shadow-lg rounded-lg border border-gray-300'>
          <CardHeader className='flex justify-between items-center p-3 bg-gray-100 rounded-t-lg'>
            <span className='font-semibold'>Hỗ trợ trực tuyến</span>
            <Button variant='ghost' size='icon' onClick={() => setIsOpen(false)}>
              <X size={20} />
            </Button>
          </CardHeader>
          <CardContent className='p-3'>
            <ScrollArea className='h-60 overflow-y-auto border rounded p-2 bg-white'>
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-2 p-2 rounded-lg text-sm max-w-[80%] ${
                      msg.sender === 'user'
                        ? 'bg-blue-500 text-white self-end ml-auto'
                        : 'bg-gray-200 text-black'
                    }`}>
                    {msg.text}
                  </div>
                ))
              ) : (
                <p className='text-gray-500 text-sm'>Hãy bắt đầu trò chuyện...</p>
              )}
            </ScrollArea>
            <div className='flex items-center gap-2 mt-3'>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Nhập tin nhắn...'
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button onClick={sendMessage} className='bg-blue-600 text-white hover:bg-blue-700'>
                Gửi
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
