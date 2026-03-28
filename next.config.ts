import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // 禁用可能导致问题的功能
  },
  // 指定 turbopack root
  turbopack: {
    root: __dirname,
  },
  // 声明环境变量，确保在客户端/服务端都能访问
  env: {
    DEAPI_KEY: process.env.DEAPI_KEY || '',
    VERCEL_TOKEN: process.env.VERCEL_TOKEN || '',
    VERCEL_PROJECT_ID: process.env.VERCEL_PROJECT_ID || '',
  },
};

export default nextConfig;