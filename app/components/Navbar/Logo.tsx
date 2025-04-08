'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Logo = () => {
  const router = useRouter()

  const handleClick = () => {
    router.push('/home')
  }
  return (
    <div onClick={handleClick} className='flex items-center w-3/12 py-1 cursor-pointer'>
      <Image src='/images/Logo.png' width={60} height={60} alt='Logo' />
      <h1 className='text-xl font-bold ml-2'>Social</h1>
    </div>
  )
}

export default Logo
