/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig