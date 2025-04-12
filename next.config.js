/** @type {import('next').NextConfig} */
const nextConfig = {
  // Удаляем output: 'export' для предотвращения предупреждений о конфликте с headers
  // output: 'export',  // Статическая генерация для GitHub Pages
  basePath: process.env.NODE_ENV === 'development' ? '' : '/infico', // Базовый путь только для продакшн
  images: {
    unoptimized: true, // Для статической генерации
    domains: ['infico.online', 'bot.infico.online'],
    formats: ['image/avif', 'image/webp'],
  },
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
  },
  webpack: (config) => {
    config.externals = [...config.externals, 'canvas', 'jsdom'];
    return config;
  },
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://web.telegram.org/',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' https://*.telegram.org https://web.telegram.org; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.telegram.org https://web.telegram.org; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://*.telegram.org; frame-ancestors 'self' https://*.telegram.org https://web.telegram.org",
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
