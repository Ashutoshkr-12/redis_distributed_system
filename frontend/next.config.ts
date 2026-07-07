import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api-backend/:path*',
        destination: 'http://localhost:8000/api/:path*', // Proxies to your Express backend
      },
    ];
  },
};

export default nextConfig;
