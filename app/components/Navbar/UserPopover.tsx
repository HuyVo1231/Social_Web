import { ChevronDown } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import ButtonLogout from './ButtonLogout'
import { User } from '@prisma/client'
import Image from 'next/image'

interface UserPopoverProps {
  user: User | null
}

const UserPopover: React.FC<UserPopoverProps> = ({ user }) => {
  return (
    <div className='flex items-center space-x-4'>
      <Popover>
        <PopoverTrigger>
          <div className='flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-100 rounded-lg'>
            <Avatar>
              <Image
                src={user?.image || '/images/placeholder.jpg'}
                alt='logo'
                width={40}
                height={40}
              />
            </Avatar>
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
