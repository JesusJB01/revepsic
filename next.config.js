/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_API_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    URL_VERCEL: process.env.URL_VERCEL,
  },
  experimental: {
    serverActions: true,
   
  },
}

module.exports = nextConfig
