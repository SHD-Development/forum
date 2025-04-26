import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import appConfig from "@/config";
const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  env: {
    FILE_STORAGE_URL: process.env.FILE_STORAGE_URL,
    FILE_STORAGE_KEY: process.env.FILE_STORAGE_KEY,
  },
  images: {
    domains: appConfig.imageDomains,
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
