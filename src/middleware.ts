import { getSessionCookie } from 'better-auth/cookies';
import { type NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard/:path*'];

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const sessionCookie = getSessionCookie(request);
  const res = NextResponse.next();
  const isLoggedIn = !!sessionCookie;
  const isOnprotectedRoute = protectedRoutes.includes(nextUrl.pathname);
  const isOnAuthRoute = nextUrl.pathname.startsWith('/auth');
  if (isOnprotectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  if (isOnAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
