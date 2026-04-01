import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: [
    /*
     * Match everything except:
     *  - /_next/ (Next.js internals)
     *  - /favicon.ico
     */
    '/((?!_next/|favicon.ico).*)',
  ],
}

const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/logout']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths through without checking the cookie
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next()
  }

  const auth = request.cookies.get('portal_auth')
  if (auth?.value === '1') {
    return NextResponse.next()
  }

  // Redirect unauthenticated requests to /login
  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = '/login'
  return NextResponse.redirect(loginUrl)
}
