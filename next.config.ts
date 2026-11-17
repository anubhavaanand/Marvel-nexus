import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'

// CSP script-src: 'unsafe-eval' removed (issue #325). 'unsafe-inline' retained
// as a documented fallback because Next.js 16 emits inline bootstrap scripts
// (and dev HMR) that are not nonce-tagged by default; a full nonce-based
// policy would require middleware + nonce propagation into <Script>/layout,
// which risks breaking SSR/dev. TODO(#325): migrate to nonce/hash-based
// allowances and drop 'unsafe-inline'.
const cspHeader = [
  "default-src 'self'",
  "img-src 'self' https://image.tmdb.org https://*.supabase.co https://cdn.myanimelist.net https://images.unsplash.com https://static.wikia.nocookie.net data:",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com",
  "connect-src 'self' https://*.supabase.co https://vitals.vercel-insights.com",
  "frame-ancestors 'none'",
].join('; ')

const nextConfig: NextConfig = {
  // Security headers
  async headers() {
    const headers = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Content-Security-Policy', value: cspHeader },
    ]
    if (isProd) {
      headers.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      })
    }
    return [
      {
        source: '/(.*)',
        headers,
      },
    ]
  },
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
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.wikia.nocookie.net',
        pathname: '/**',
      },
    ],
    // Performance optimization: Image quality and formats
    formats: ['image/avif', 'image/webp'],
    // next/image minimumCacheTTL: how long the optimizer caches a transformed
    // image before re-validating. Lowered from 30 days to 1 day (#369): hero
    // art/posters can be updated upstream (new artwork, corrected assets) and a
    // 30-day TTL could serve stale art for weeks. 1 day keeps pages fast (still
    // cacheable) while bounding staleness to ~24h. If upstream image URLs are
    // immutable/versioned, this can be raised again.
    minimumCacheTTL: 60 * 60 * 24, // 1 day
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Performance optimization: Enable compression
  compress: true,
  // Performance optimization: Power-off head
  poweredByHeader: false,
  // Performance optimization: Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
}

export default nextConfig
