'use client'

import useRoutes from '@/app/hooks/useRoutes'
import useStaticRoutes from '@/app/hooks/useStaticRoutes'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

export default function SidebarContent() {
  const mainRoutes = useRoutes()
  const favouriteRoutes = useStaticRoutes()

  return (
    <div className='space-y-3'>
      {mainRoutes.map((route) => (
        <Link key={route.label} href={route.href} passHref className='block'>
          <Button
            variant='ghost'
            className={`w-full justify-start rounded-lg text-gray-700 hover:bg-gray-100 transition ${
              route.active ? 'bg-gray-200' : ''
            }`}>
            <route.icon className='mr-2 h-5 w-5 text-gray-500' />
            {route.label}
          </Button>
        </Link>
      ))}

      <Separator className='my-4' />
      <h3 className='text-md font-bold text-gray-900 px-2 mt-4'>Favourites</h3>

      {favouriteRoutes.map((route) => {
        const content = (
          <Button
            variant='ghost'
            className='w-full justify-start rounded-lg text-gray-900 hover:bg-gray-100 transition pl-4'
            disabled={route.disabled}>
            <route.icon className='mr-2 h-5 w-5 text-gray-500' />
            {route.label}
          </Button>
        )

        return route.disabled ? (
          <div key={route.label} className='block'>
            {content}
          </div>
        ) : (
          <Link key={route.label} href={route.href} passHref className='block'>
            {content}
          </Link>
        )
      })}
    </div>
  )
}
