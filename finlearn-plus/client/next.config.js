/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    NEXT_PUBLIC_ALPHA_VANTAGE_KEY: process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY || "",
    NEXT_PUBLIC_NEWS_API_KEY: process.env.NEXT_PUBLIC_NEWS_API_KEY || "",
  },
};

module.exports = nextConfig;
