import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // 禁用可能导致问题的功能
  },
  // 指定 turbopack root
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
