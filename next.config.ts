import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.myanimelist.net',
        pathname: '/images/**',
      },
    ],
  },
  // Transpile three.js modules for Next.js
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
  // Enable React strict mode for better development experience
  reactStrictMode: true,
};

export default nextConfig;
