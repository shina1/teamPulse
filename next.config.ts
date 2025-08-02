import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  matcher: ['/((?!api|_next|static|login).*)'],
};

export default nextConfig;
