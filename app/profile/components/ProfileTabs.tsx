import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import ProfileAbout from './ProfileAbout'
import ProfilePhotos from './ProfilePhotos'
import ProfileFriends from './ProfileFriends'
import ProfilePosts from './ProfilePosts'
import { ProfileType } from '@/app/types'

interface ProfileTabsProps {
  profile: ProfileType
}

export default function ProfileTabs({ profile }: ProfileTabsProps) {
  return (
    <Tabs defaultValue='about' className=' pl-5'>
      <TabsList className='flex justify-start space-x-2 border-b'>
        <TabsTrigger value='about' className='text-base'>
          About
        </TabsTrigger>
        <TabsTrigger value='posts' className='text-base'>
          Posts
        </TabsTrigger>
        <TabsTrigger value='photo' className='text-base'>
          Photo
        </TabsTrigger>
        <TabsTrigger value='friends' className='text-base'>
          Friends
        </TabsTrigger>
      </TabsList>

      <TabsContent value='about' className='min-h-[200px]'>
        <ProfileAbout profile={profile} />
      </TabsContent>
      <TabsContent value='posts' className='min-h-[400px]'>
        <ProfilePosts initPosts={profile.posts} />
      </TabsContent>
      <TabsContent value='photo' className='min-h-[400px]'>
        <ProfilePhotos profile={profile} />
      </TabsContent>
      <TabsContent value='friends' className='min-h-[400px]'>
        <ProfileFriends profile={profile} />
      </TabsContent>
    </Tabs>
  )
}
