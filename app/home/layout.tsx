import Layout from '../components/Layout'
import SuggestedFriends from './components/suggestfriends/SuggestedFriends'

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <div className='flex'>
        <div className='w-[65%] p-4 mx-auto lg:w-[72%] md:w-full sm:w-full'>{children}</div>
        <div className='w-[35%] p-4 pl-0 hidden lg:block'>
          <SuggestedFriends />
        </div>
      </div>
    </Layout>
  )
}
