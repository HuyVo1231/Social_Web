'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import OAuthButton from './OAuthButton'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { signIn, useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { fetcher } from '@/app/libs/fetcher'
import FormError from './FormError'
import PasswordInput from './PasswordInput'
import { useRouter } from 'next/navigation'
import useUserStore from '@/app/zustand/userStore'

type Variant = 'LOGIN' | 'REGISTER'

const LoginForm = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const setUser = useUserStore((state) => state.setUser)
  const [isLoading, setIsLoading] = useState(false)
  const [variant, setVariant] = useState<Variant>('LOGIN')
  const [hidePassword, setHidePassword] = useState(true)

  const toggleVariant = useCallback(() => {
    setVariant((prevVariant) => (prevVariant === 'LOGIN' ? 'REGISTER' : 'LOGIN'))
  }, [])

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUser({
        name: session.user.name,
        email: session.user.email,
        image: session.user.image
      })
      router.push('/home')
    }
  }, [status, session?.user, setUser, router])

  const togglePassword = () => {
    setHidePassword(!hidePassword)
  }

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true)

    try {
      if (variant === 'REGISTER') {
        const responseData = await fetcher('/api/register', {
          method: 'POST',
          body: JSON.stringify(data)
        })

        toast.success(responseData.message || 'Đăng ký tài khoản thành công!')
        await signIn('credentials', data)
      } else if (variant === 'LOGIN') {
        const result = await signIn('credentials', { ...data, redirect: false })

        if (result?.error) {
          throw new Error('Sai tài khoản hoặc mật khẩu...')
        }

        toast.success('Đăng nhập thành công!')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  const socialAction = async (provider: string) => {
    setIsLoading(true)

    signIn(provider, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error('Không đăng nhập thành công!')
        }
        if (callback?.ok && !callback?.error) {
          toast.success('Đăng nhập thành công!')
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <>
      <div className='flex space-x-2'>
        <OAuthButton icon={FaGithub} onClick={() => socialAction('github')} text='Github' />
        <OAuthButton icon={FcGoogle} onClick={() => socialAction('google')} text='Google' />
      </div>
      <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
        {variant === 'REGISTER' && (
          <div>
            <label className='block text-sm font-medium'>Name</label>
            <Input
              disabled={isLoading}
              id='name'
              type='text'
              placeholder='username'
              className='mt-1'
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <FormError message={errors.name.message as string} />}
          </div>
        )}
        <div>
          <label htmlFor='email' className='block text-sm font-medium'>
            Email
          </label>
          <Input
            id='email'
            type='email'
            disabled={isLoading}
            placeholder='vonhathuy@example.com'
            className='mt-1'
            {...register('email', {
              required: 'Email is required'
            })}
          />
          {errors.email && <FormError message={errors.email.message as string} />}
        </div>
        <PasswordInput
          disabled={isLoading}
          register={register}
          errors={errors}
          hidePassword={hidePassword}
          togglePassword={togglePassword}
        />
        <Button type='submit' className='w-full'>
          {variant === 'LOGIN' ? 'Login' : 'Create account'}
        </Button>

        <div className='mt-6 flex gap-2 justify-center text-sm px-2 text-gray-500'>
          <div>{variant === 'LOGIN' ? 'New to Messenger?' : 'Already have an account?'}</div>
          <div onClick={toggleVariant} className='underline cursor-pointer'>
            {variant === 'LOGIN' ? 'Create an account' : 'Login'}
          </div>
        </div>
      </form>
    </>
  )
}

export default LoginForm
