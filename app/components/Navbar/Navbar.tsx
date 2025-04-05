import Image from 'next/image'
import SearchBar from './SearchBar'
import UserPopover from './UserPopover'
import getCurrentUser from '@/app/actions/users/getCurrentUser'
import NotificationPopover from './NotificationPopover'
import ListConversation from './conversation/ListConversation'
import getConversations from '@/app/actions/conversations/getConversations'

export default async function Navbar() {
  const currentUser = await getCurrentUser()
  const conversations = await getConversations()
  return (
    <nav className='fixed top-0 left-0 right-0 bg-white shadow-sm z-50 border-b'>
      <div className='container mx-auto flex justify-between items-center px-8'>
        <div className='flex items-center w-3/12 py-1'>
          <Image src='/images/Logo.png' width={60} height={60} alt='Logo' />
          <h1 className='text-xl font-bold ml-2'>Social</h1>
        </div>
        <div className='w-7/12 p-2'>
          <SearchBar />
        </div>
        <div className='w-4/12 flex justify-end'>
          <ListConversation conversations={conversations} />
          <NotificationPopover />
          <UserPopover user={currentUser} />
        </div>
      </div>
    </nav>
  )
}
