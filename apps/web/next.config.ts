import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Force Webpack instead of Turbopack (fixes Windows infinite loop bug)
  webpack: (config) => {
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'www.arcaffe.co.il',
      },
      {
        protocol: 'https',
        hostname: 'assets.ampm.co.il',
      },
      {
        protocol: 'https',
        hostname: 'www.breadstation.co.il',
      },
      {
        protocol: 'https',
        hostname: 'www.benedict.co.il',
      },
      {
        protocol: 'https',
        hostname: 'food-rescue.it',
      }
    ],
  },
};

export default nextConfig;
