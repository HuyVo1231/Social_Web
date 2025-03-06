import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // images: {
  //   remotePatterns: [
  //     { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
  //     { protocol: 'https', hostname: 'res.cloudinary.com' },
  //     { protocol: 'https', hostname: 'avatars.githubusercontent.com' }
  //   ]
  // },

  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }]
  },

  reactStrictMode: false
}

export default nextConfig
