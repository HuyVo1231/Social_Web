'use client'

import { Input } from '@/components/ui/input'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import FormError from './FormError'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'

interface PasswordInputProps {
  register: UseFormRegister<FieldValues>
  errors: FieldErrors
  hidePassword: boolean
  togglePassword: () => void
  disabled?: boolean
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  register,
  errors,
  hidePassword,
  togglePassword,
  disabled
}) => (
  <div>
    <label htmlFor='password' className='block text-sm font-medium'>
      Password
    </label>
    <div className='relative mt-1'>
      <Input
        id='password'
        disabled={disabled}
        type={hidePassword ? 'password' : 'text'}
        placeholder='••••••••'
        className='w-full p-2 pl-4 pr-12 border border-gray-300 rounded-md'
        {...register('password', {
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters'
          }
        })}
      />
      <button
        type='button'
        onClick={togglePassword}
        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
        {hidePassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
    {errors.password && <FormError message={errors.password.message as string} />}
  </div>
)

export default PasswordInput
