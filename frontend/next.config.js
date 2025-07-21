// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Wikipedia/Wikimedia
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'commons.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      // Art Institute of Chicago
      {
        protocol: 'https',
        hostname: 'www.artic.edu',
        port: '',
        pathname: '/**',
      },
      // MET Museum
      {
        protocol: 'https',
        hostname: 'images.metmuseum.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'collectionapi.metmuseum.org',
        port: '',
        pathname: '/**',
      },
      // Diğer müze API'leri için
      {
        protocol: 'https',
        hostname: '*.museum-api.org',
        port: '',
        pathname: '/**',
      },
    ],
    // Resim optimizasyonu ayarları
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Performans iyileştirmeleri
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
};

module.exports = nextConfig;
