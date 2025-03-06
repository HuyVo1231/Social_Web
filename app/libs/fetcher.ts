const defaultHeaders = { 'Content-Type': 'application/json' }

export const fetcher = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  })
  if (!res.ok) throw new Error((await res.json())?.message || 'Something went wrong')
  return res.json()
}
