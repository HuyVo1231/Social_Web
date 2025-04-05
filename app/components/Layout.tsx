import RightSidebar from './RightSidebar/RightSidebar'
import Navbar from './Navbar/Navbar'
import Sidebar from './Sidebar/Sidebar'
import ListChatBox from './Chatbox/ListChatbox'
import IncomingCall from './IncomingCall'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col h-screen bg-white'>
      <Navbar />
      <div className='flex flex-1 pt-16'>
        <Sidebar />
        <main className='flex-1 md:pl-[250px] md:pr-[240px] pl-0 pr-0'>{children}</main>
        <RightSidebar />
      </div>
      <ListChatBox />
      <IncomingCall />
    </div>
  )
}
