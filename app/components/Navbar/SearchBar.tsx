'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useState } from 'react'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(query)
  }

  return (
    <form onSubmit={handleSearch} className='relative w-[80%]'>
      <Input
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Search...'
        className='pl-10 pr-4 py-5 rounded-full bg-gray-100 text-gray-900 border-gray-300 
              ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0'
      />
      <Search
        className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'
        size={22}
      />
    </form>
  )
}
