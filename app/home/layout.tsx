import { getSuggestedGroupChats } from '../actions/friends/getSuggestedGroupChats'
import { getSuggestedFriends } from '../actions/friends/suggestedFriend'
import Layout from '../components/Layout'
import SuggestedFriends from './components/suggestfriends/SuggestedFriends'
import SuggestedGroupChats from './components/suggestgroupchat/SuggestedGroupChats'

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  const suggestedFriends = await getSuggestedFriends()
  const suggestedGroupChats = await getSuggestedGroupChats()

  return (
    <Layout>
      <div className='flex'>
        <div className='w-[100%] p-4 mx-auto lg:w-[72%] md:w-full sm:w-full'>{children}</div>
        <div className='w-[35%] p-4 pl-0 hidden lg:block'>
          <SuggestedFriends friends={suggestedFriends} />
          <hr />
          <SuggestedGroupChats groups={suggestedGroupChats} />
        </div>
      </div>
    </Layout>
  )
}
