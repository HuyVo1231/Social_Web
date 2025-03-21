import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }]
  },

  reactStrictMode: false,

  // ✅ Bỏ qua lỗi TypeScript khi build
  typescript: {
    ignoreBuildErrors: true
  },

  // ✅ Bỏ qua lỗi ESLint khi build
  eslint: {
    ignoreDuringBuilds: true
  }
}

export default nextConfig
