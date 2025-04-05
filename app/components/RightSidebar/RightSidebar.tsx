import { Separator } from '@/components/ui/separator'
import ListFriends from './ListFriends'
import { ScrollArea } from '@/components/ui/scroll-area'

const RightSidebar = () => {
  return (
    <div className='fixed top-[80px] right-0 w-[240px] h-[calc(100vh-64px)] rounded-md bg-white border-l shadow-md z-10 p-4 md:block hidden'>
      <ScrollArea className='h-full'>
        <ListFriends />
        <Separator className='my-4' />
      </ScrollArea>
    </div>
  )
}

export default RightSidebar
