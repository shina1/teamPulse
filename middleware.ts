import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// public routes
const PUBLIC_PATHS = [
  '/login',
  '/favicon.ico',
  '/_next',
  '/api', // Optional: allow public APIs
  '/static',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  if (isPublic) return NextResponse.next();

  // Check for session cookie
  const session = request.cookies.get('session_user');
  console.log(request.cookies.get('session_user')?.value);
  if (!session) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
