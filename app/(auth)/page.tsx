import Image from 'next/image'
import LoginForm from './components/LoginForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const Login = () => {
  return (
    <div className='flex justify-center items-center h-full'>
      <Card className='max-w-md mx-auto p-4 shadow-lg'>
        <div className='flex justify-center'>
          <Image src='/images/Logo.png' width={100} height={100} alt='Logo' />
        </div>
        <CardHeader>
          <CardTitle className='text-2xl font-semibold tracking-tight'>Create an account</CardTitle>
          <p className='text-center text-md text-gray-500 tracking-tight'>
            Enter your email below to create your account
          </p>
        </CardHeader>
        <CardContent className='space-y-4'>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
