import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Log all API requests to help debug
  if (request.nextUrl.pathname.startsWith('/api/proxy')) {
    console.log(`[Middleware] API Proxy Request: ${request.method} ${request.nextUrl.toString()}`);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/api/:path*',
  ],
};
