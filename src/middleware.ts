import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// async
export function middleware(request: NextRequest) {
  // logga api 
  if (request.nextUrl.pathname.startsWith('/api/proxy')) {
    console.log(`[Middleware] API Proxy Request: ${request.method} ${request.nextUrl.toString()}`);
  }

  return NextResponse.next();
}

// matching 
export const config = {
  matcher: [
    '/api/:path*',
  ],
};
