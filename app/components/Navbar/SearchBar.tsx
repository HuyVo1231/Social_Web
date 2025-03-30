'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import SearchFriends from '../Friends/SearchFriends'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [friends, setFriends] = useState([])
  const [loading, setLoading] = useState(false)

  const [debouncedQuery] = useDebounce(query, 500)

  useEffect(() => {
    if (!debouncedQuery) {
      setFriends([])
      return
    }

    const fetchFriends = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/friends/searchFriends?q=${debouncedQuery}`)
        const data = await res.json()
        setFriends(data.friends)
      } catch (error) {
        console.error('Error fetching friends:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFriends()
  }, [debouncedQuery])

  return (
    <div className='relative w-[80%]'>
      <div className='relative'>
        <Input
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search friends...'
          className='pl-10 pr-4 py-5 rounded-full bg-gray-100 text-gray-900 border-gray-300 
                ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0'
        />
        <Search
          className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'
          size={22}
        />
      </div>

      <SearchFriends friends={friends} loading={loading} query={query} />
    </div>
  )
}
