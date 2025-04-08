'use client'

import { ChevronDown } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import ButtonLogout from './ButtonLogout'
import CP_Avatar from '../Avatar/Avatar'
import useUserStore from '@/app/zustand/userStore'

const UserPopover = () => {
  const { user } = useUserStore()

  return (
    <div className='flex items-center space-x-4'>
      <Popover>
        <PopoverTrigger>
          <div className='flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-100 rounded-lg'>
            <CP_Avatar src={user?.image || '/images/placeholder.jpg'} />
            <ChevronDown className='w-4 h-4 text-gray-600' />
          </div>
        </PopoverTrigger>
        <PopoverContent className='w-48 p-2'>
          <ButtonLogout />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default UserPopover
