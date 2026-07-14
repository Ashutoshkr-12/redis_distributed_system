import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_BACKEND_URI ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/:path*` : 'http://localhost:8000: path*'
      }
    ];
  },
};

export default nextConfig;
