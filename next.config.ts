import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 生产环境优化
  compress: true,
  
  // 图片配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        pathname: '/**',
      },
    ],
    // 生产环境优化
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    formats: ['image/avif', 'image/webp'],
  },
  
  // 生产环境安全配置
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
