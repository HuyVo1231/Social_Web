'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ProfileType } from '@/app/types'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import Post from '@/app/home/components/post/Post'
import { DialogTitle } from '@radix-ui/react-dialog'

interface ProfilePhotosProps {
  profile: ProfileType
}

export default function ProfilePhotos({ profile }: ProfilePhotosProps) {
  const [selectedPost, setSelectedPost] = useState<(typeof profile.posts)[0] | null>(null)

  return (
    <div className='grid grid-cols-3 gap-4 p-4'>
      {profile.posts.length > 0 ? (
        profile.posts
          .filter((post) => post.image && post.image.length > 0)
          .map((post, index) => (
            <Dialog key={post.id} onOpenChange={(open) => !open && setSelectedPost(null)}>
              <DialogTrigger asChild>
                <Image
                  src={
                    Array.isArray(post.image) && post.image.length > 0
                      ? post.image[0]
                      : typeof post.image === 'string'
                      ? post.image
                      : '/images/placeholder.jpg'
                  }
                  alt={`Photo ${index}`}
                  width={300}
                  height={300}
                  className='w-full h-auto rounded-lg cursor-pointer'
                  onClick={() => setSelectedPost(post)}
                />
              </DialogTrigger>
              <DialogContent className='w-[80%] h-[90vh] max-w-4xl overflow-y-auto p-6 rounded-lg'>
                <DialogTitle className='text-lg font-semibold'>Bài viết</DialogTitle>
                {selectedPost && <Post post={selectedPost} />}
              </DialogContent>
            </Dialog>
          ))
      ) : (
        <p className='text-gray-500'>Chưa có ảnh nào.</p>
      )}
    </div>
  )
}
