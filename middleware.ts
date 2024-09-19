// Protecting routes with next-auth
// https://next-auth.js.org/configuration/nextjs#middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware

import { NextRequest, NextResponse } from 'next/server';

function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the user token from cookies (assuming you store user authentication in cookies)
  const token = request.cookies.get('session')?.value;

  const isPublicRoute = pathname.startsWith('/login') || pathname === '/';

  // If the user is trying to access the /auth page and is authenticated, redirect them to the home page
  if (isPublicRoute && token) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // If the user is not authenticated and is not accessing the /auth page, redirect them to /auth
  if (!token && !pathname.startsWith('/login')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  // Allow the request to proceed if the user is authenticated or is accessing /auth
  return NextResponse.next();
}

export default middleware;

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
  ]
};
