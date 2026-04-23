import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
