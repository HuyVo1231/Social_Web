'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'

// Form validation schema
const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(6, {
      message: 'Current password must be at least 6 characters'
    }),
    newPassword: z.string().min(6, {
      message: 'New password must be at least 6 characters'
    }),
    confirmPassword: z.string().min(6, {
      message: 'Confirm password must be at least 6 characters'
    })
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  })

type PasswordFormValues = z.infer<typeof passwordFormSchema>

const Settings = () => {
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async (data: PasswordFormValues) => {
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          oldPassword: data.currentPassword,
          newPassword: data.newPassword
        })
      })

      if (!response) {
        throw new Error('Failed to update password. Please try again.')
      }

      // Thành công
      toast.success('Your password has been updated.')
      form.reset()
    } catch (error) {
      // Xử lý lỗi
      toast.error(error.message || 'Failed to update password. Please try again.')
    }
  }

  return (
    <div className='flex justify-center items-center p-2 ml-[200px]'>
      <div className='container mx-auto py-8'>
        <h1 className='text-3xl font-bold mb-6'>Settings</h1>

        <Card className='max-w-md'>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password here.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <FormField
                  control={form.control}
                  name='currentPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input type='password' placeholder='Enter current password' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='newPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type='password' placeholder='Enter new password' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type='password' placeholder='Confirm new password' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type='submit' className='w-full bg-black'>
                  Update Password
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Settings
