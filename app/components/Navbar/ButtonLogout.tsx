'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

const ButtonLogout = () => {
  return (
    <Button
      variant='ghost'
      onClick={() => signOut()}
      className='w-full flex items-center space-x-2 justify-start'>
      <LogOut className='w-4 h-4' />
      <span>Logout</span>
    </Button>
  )
}

export default ButtonLogout
