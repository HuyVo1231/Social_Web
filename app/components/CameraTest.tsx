'use client'

import { useState } from 'react'
import Webcam from 'react-webcam'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function CameraTest() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startCamera = () => {
    setIsLoading(false)
    setHasPermission(true)
  }

  const stopCamera = () => {
    setHasPermission(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>Kiểm tra camera</Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[625px]'>
        <DialogHeader>
          <DialogTitle>Kiểm tra camera</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Video preview */}
          <div className='relative aspect-video w-full rounded-lg bg-gray-100 overflow-hidden'>
            {hasPermission ? (
              <Webcam
                audio={false}
                screenshotFormat='image/jpeg'
                width='100%'
                videoConstraints={{
                  facingMode: 'user'
                }}
              />
            ) : (
              <div className='flex h-full items-center justify-center bg-gray-200'>
                <span className='text-gray-500'>Camera không khả dụng</span>
              </div>
            )}
          </div>

          {/* Status */}
          {isLoading && (
            <div className='text-sm text-muted-foreground'>Đang kết nối với camera...</div>
          )}

          {/* Error message */}
          {error && (
            <Alert variant='destructive'>
              <AlertTitle>Lỗi camera</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Instructions */}
          <div className='text-sm text-muted-foreground'>
            {hasPermission ? (
              <p>Camera đã sẵn sàng hoạt động</p>
            ) : (
              <p>Vui lòng cho phép truy cập camera để kiểm tra</p>
            )}
          </div>

          {/* Actions */}
          <div className='flex justify-end gap-2'>
            <Button variant='outline' onClick={() => setIsOpen(false)}>
              Đóng
            </Button>
            {!hasPermission && !isLoading && <Button onClick={startCamera}>Thử lại</Button>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
