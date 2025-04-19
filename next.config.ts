import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  env: {
    FILE_STORAGE_URL: process.env.FILE_STORAGE_URL,
    FILE_STORAGE_KEY: process.env.FILE_STORAGE_KEY,
  },
};

export default nextConfig;
