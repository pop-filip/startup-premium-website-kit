/** @type {import('next').NextConfig} */
const nextConfig = {
  // ============================================================
  // PERFORMANCE
  // ============================================================
  compress: true,
  poweredByHeader: false, // Hide X-Powered-By header (security)
  
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 420, 768, 1024, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    // Add your image CDN domains here:
    remotePatterns: [
      // { protocol: 'https', hostname: 'your-cdn.com' },
      // { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },

  // ============================================================
  // SECURITY HEADERS
  // ============================================================
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // --- HSTS: Force HTTPS for 2 years + subdomains ---
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // --- CSP: Content Security Policy ---
          // CUSTOMIZE THIS for your specific needs!
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://www.google-analytics.com https://vitals.vercel-insights.com",
              "frame-src 'self' https://www.youtube.com https://player.vimeo.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
          // --- Prevent MIME type sniffing ---
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // --- Prevent clickjacking ---
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // --- Control referrer information ---
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // --- Restrict browser features ---
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // --- Cross-Origin policies ---
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          // --- Disable XSS filter (CSP replaces it) ---
          {
            key: 'X-XSS-Protection',
            value: '0',
          },
        ],
      },
      // Cache static assets aggressively
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // ============================================================
  // REDIRECTS (add your redirects here)
  // ============================================================
  async redirects() {
    return [
      // Example: redirect old pages
      // { source: '/old-page', destination: '/new-page', permanent: true },
    ];
  },

  // ============================================================
  // EXPERIMENTAL FEATURES (Next.js 14+)
  // ============================================================
  experimental: {
    // optimizeCss: true,          // Enable if using critters
    // optimizePackageImports: ['lucide-react', '@heroicons/react'],
  },
};

module.exports = nextConfig;
