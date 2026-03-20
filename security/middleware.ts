import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ============================================================
// MIDDLEWARE — Runs on EVERY request before page renders
// Place at: middleware.ts (project root)
//
// Handles: Rate limiting, redirects, maintenance mode,
// geo-blocking, bot protection
// ============================================================

// Simple in-memory rate limiter (use Redis in production)
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100;         // requests per window
const RATE_WINDOW = 60 * 1000;  // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record || now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return false;
  }

  record.count++;
  return record.count > RATE_LIMIT;
}


export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';

  // ============================================================
  // 1. MAINTENANCE MODE
  // ============================================================
  if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true') {
    if (pathname !== '/maintenance' && !pathname.startsWith('/_next')) {
      return NextResponse.rewrite(new URL('/maintenance', request.url));
    }
  }

  // ============================================================
  // 2. RATE LIMITING (API routes)
  // ============================================================
  if (pathname.startsWith('/api/')) {
    if (isRateLimited(ip)) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } }
      );
    }
  }

  // ============================================================
  // 3. TRAILING SLASH REDIRECT (SEO — pick one and stick with it)
  // ============================================================
  if (pathname !== '/' && pathname.endsWith('/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(url, 308);
  }

  // ============================================================
  // 4. WWW → non-WWW REDIRECT (SEO — canonical domain)
  // ============================================================
  const hostname = request.headers.get('host') || '';
  if (hostname.startsWith('www.')) {
    const url = request.nextUrl.clone();
    url.host = hostname.replace('www.', '');
    return NextResponse.redirect(url, 308);
  }

  // ============================================================
  // 5. BLOCK SENSITIVE PATHS
  // ============================================================
  const blockedPaths = [
    '/wp-admin',
    '/wp-login',
    '/.env',
    '/xmlrpc.php',
    '/phpmyadmin',
    '/.git',
  ];
  if (blockedPaths.some(p => pathname.startsWith(p))) {
    return new NextResponse(null, { status: 404 });
  }

  // ============================================================
  // 6. ADD CUSTOM HEADERS TO RESPONSE
  // ============================================================
  const response = NextResponse.next();

  // Cache control for HTML pages
  if (!pathname.startsWith('/api/') && !pathname.startsWith('/_next/')) {
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=86400'
    );
  }

  return response;
}

// Only run middleware on specific routes (exclude static files)
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
