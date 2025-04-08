import SearchBar from './SearchBar'
import UserPopover from './UserPopover'
import NotificationPopover from './NotificationPopover'
import ListConversation from './conversation/ListConversation'
import getConversations from '@/app/actions/conversations/getConversations'
import Logo from './Logo'

export default async function Navbar() {
  const conversations = await getConversations()
  return (
    <nav className='fixed top-0 left-0 right-0 bg-white shadow-sm z-50 border-b'>
      <div className='container mx-auto flex justify-between items-center px-8'>
        <Logo />
        <div className='w-7/12 p-2'>
          <SearchBar />
        </div>
        <div className='w-4/12 flex justify-end'>
          <ListConversation conversations={conversations} />
          <NotificationPopover />
          <UserPopover />
        </div>
      </div>
    </nav>
  )
}
