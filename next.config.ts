import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'res.cloudinary.com',
      },
      {
        hostname: 'pbs.twimg.com',
      },
      {
        hostname: 'pub-543c785b9b4940d6a934d856a8a91c99.r2.dev',
      },
      {
        hostname: '**.fbcdn.net',
      },
      {
        hostname: '**.cdninstagram.com',
      },
    ],
  },
};

export default nextConfig;
