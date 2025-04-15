'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Briefcase, GraduationCap, MapPin, Heart, Sparkles, Pencil } from 'lucide-react'
import { ProfileType } from '@/app/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { fetcher } from '@/app/libs/fetcher'
import useProfile from '@/app/hooks/useProfile'
import { useDebounce } from 'use-debounce'

interface ProfileAboutProps {
  profile: ProfileType
}

export default function ProfileAbout({ profile }: ProfileAboutProps) {
  const { isOwnProfile } = useProfile()
  const [profileData, setProfileData] = useState(profile)
  const [isOpen, setIsOpen] = useState(false)
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isDirty },
    reset
  } = useForm({
    defaultValues: {
      location: profileData.location || '',
      work: profileData.work || '',
      education: profileData.education || '',
      relationship: profileData.relationship || '',
      hobbies: profileData.hobbies || '',
      bio: profileData.bio || '',
      website: profileData.website || '',
      skills: profileData.skills || ''
    }
  })

  const locationValue = watch('location')
  const [debouncedLocation] = useDebounce(locationValue, 200)

  useEffect(() => {
    const fetchLocationSuggestions = async () => {
      if (debouncedLocation.length < 3) {
        setLocationSuggestions([])
        return
      }

      setIsLoadingSuggestions(true)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${debouncedLocation}&addressdetails=1&limit=5&countrycodes=vn`
        )
        const data = await response.json()
        setLocationSuggestions(data)
      } catch (error) {
        console.error('Error fetching location suggestions:', error)
      } finally {
        setIsLoadingSuggestions(false)
      }
    }

    fetchLocationSuggestions()
  }, [debouncedLocation])

  const selectLocationSuggestion = (suggestion: any) => {
    setValue('location', suggestion.display_name, { shouldDirty: true })
    setLocationSuggestions([])
  }

  const onSubmit = async (data: any) => {
    const formattedData = {
      ...data,
      skills: data.skills
        ? data.skills
            .split(',')
            .map((skill: string) => skill.trim())
            .join(',')
        : ''
    }

    try {
      const response = await fetcher('/api/profile/change-profile', {
        method: 'PUT',
        body: JSON.stringify(formattedData)
      })

      if (!response) {
        throw new Error('Failed to update profile')
      }

      setProfileData((prev) => ({ ...prev, ...data }))
      setIsOpen(false)
      reset(data)
    } catch (error) {
      console.error('Update error:', error)
    }
  }

  const handleCancel = () => {
    reset()
    setIsOpen(false)
  }

  const skillsArray = profileData.skills
    ? profileData.skills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean)
    : []

  return (
    <div className='bg-white rounded-lg shadow-sm p-6 min-h-[450px]'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-gray-800'>About</h2>
        {isOwnProfile && (
          <Button
            variant='outline'
            onClick={() => setIsOpen(true)}
            className='flex items-center gap-2'>
            <Pencil className='w-4 h-4' />
            <span>Edit</span>
          </Button>
        )}
      </div>

      <div className='space-y-4'>
        {profileData.bio && (
          <div className='mb-6'>
            <p className='text-gray-700 whitespace-pre-line'>{profileData.bio}</p>
          </div>
        )}

        <div className='grid gap-4'>
          {profileData.location && (
            <div className='flex items-start gap-3'>
              <MapPin className='w-5 h-5 mt-0.5 text-blue-500 flex-shrink-0' />
              <div>
                <h3 className='text-sm font-medium text-gray-500'>Location</h3>
                <p className='text-gray-800'>{profileData.location}</p>
              </div>
            </div>
          )}

          {profileData.work && (
            <div className='flex items-start gap-3'>
              <Briefcase className='w-5 h-5 mt-0.5 text-green-500 flex-shrink-0' />
              <div>
                <h3 className='text-sm font-medium text-gray-500'>Work</h3>
                <p className='text-gray-800'>{profileData.work}</p>
              </div>
            </div>
          )}

          {profileData.education && (
            <div className='flex items-start gap-3'>
              <GraduationCap className='w-5 h-5 mt-0.5 text-purple-500 flex-shrink-0' />
              <div>
                <h3 className='text-sm font-medium text-gray-500'>Education</h3>
                <p className='text-gray-800'>{profileData.education}</p>
              </div>
            </div>
          )}

          {profileData.relationship && (
            <div className='flex items-start gap-3'>
              <Heart className='w-5 h-5 mt-0.5 text-red-500 flex-shrink-0' />
              <div>
                <h3 className='text-sm font-medium text-gray-500'>Relationship</h3>
                <p className='text-gray-800'>{profileData.relationship}</p>
              </div>
            </div>
          )}

          {profileData.hobbies && (
            <div className='flex items-start gap-3'>
              <Sparkles className='w-5 h-5 mt-0.5 text-yellow-500 flex-shrink-0' />
              <div>
                <h3 className='text-sm font-medium text-gray-500'>Hobbies</h3>
                <p className='text-gray-800'>{profileData.hobbies}</p>
              </div>
            </div>
          )}

          {profileData.website && (
            <div className='flex items-start gap-3'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='text-gray-500 flex-shrink-0'>
                <circle cx='12' cy='12' r='10'></circle>
                <line x1='2' y1='12' x2='22' y2='12'></line>
                <path d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'></path>
              </svg>
              <div>
                <h3 className='text-sm font-medium text-gray-500'>Website</h3>
                <a
                  href={
                    profileData.website.startsWith('http')
                      ? profileData.website
                      : `https://${profileData.website}`
                  }
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:underline'>
                  {profileData.website}
                </a>
              </div>
            </div>
          )}

          {skillsArray.length > 0 && (
            <div className='flex items-start gap-3'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='text-gray-500 flex-shrink-0'>
                <path d='M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z'></path>
                <path d='m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z'></path>
                <path d='M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0'></path>
                <path d='M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5'></path>
              </svg>
              <div>
                <h3 className='text-sm font-medium text-gray-500 mb-2'>Skills</h3>
                <div className='flex flex-wrap gap-2'>
                  {skillsArray.map((skill, index) => (
                    <Badge key={index} variant='secondary' className='px-3 py-1'>
                      {skill.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='max-w-xl rounded-lg'>
          <DialogHeader>
            <DialogTitle className='text-2xl font-bold'>Edit About Information</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='relative'>
                <Label htmlFor='location'>Location</Label>
                <Input
                  id='location'
                  {...register('location')}
                  placeholder='Where do you live?'
                  autoComplete='no'
                />
                {isLoadingSuggestions && (
                  <div className='absolute z-10 w-full mt-1 text-sm text-gray-500'>Loading...</div>
                )}
                {locationSuggestions.length > 0 && (
                  <ul className='absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg'>
                    {locationSuggestions.map((item, index) => (
                      <li
                        key={index}
                        onClick={() => selectLocationSuggestion(item)}
                        className='p-2 text-sm cursor-pointer hover:bg-gray-100'>
                        {item.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <Label htmlFor='work'>Work</Label>
                <Input id='work' {...register('work')} placeholder='Where do you work?' />
              </div>

              <div>
                <Label htmlFor='education'>Education</Label>
                <Input
                  id='education'
                  {...register('education')}
                  placeholder='Your education background'
                />
              </div>

              <div>
                <Label htmlFor='relationship'>Relationship</Label>
                <Input
                  id='relationship'
                  {...register('relationship')}
                  placeholder='Your relationship status'
                />
              </div>

              <div>
                <Label htmlFor='hobbies'>Hobbies</Label>
                <Input
                  id='hobbies'
                  {...register('hobbies')}
                  placeholder='Your hobbies and interests'
                />
              </div>

              <div>
                <Label htmlFor='website'>Website</Label>
                <Input
                  id='website'
                  {...register('website')}
                  placeholder='Your personal website or blog'
                />
              </div>

              <div className='md:col-span-2'>
                <Label htmlFor='skills'>Skills (comma separated)</Label>
                <Input
                  id='skills'
                  {...register('skills')}
                  placeholder='e.g. JavaScript, Design, Photography'
                />
              </div>

              <div className='md:col-span-2'>
                <Label htmlFor='bio'>Bio</Label>
                <Textarea
                  id='bio'
                  {...register('bio')}
                  className='min-h-[120px]'
                  placeholder='Tell people about yourself...'
                />
              </div>
            </div>

            <DialogFooter className='mt-6'>
              <Button type='button' variant='outline' onClick={handleCancel}>
                Cancel
              </Button>
              <Button type='submit' disabled={!isDirty}>
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
