// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/login', '/register', '/verify-email']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Bỏ qua static files và API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|css|js|webp|ico|mp4)$/)
  ) {
    return NextResponse.next()
  }

  const token = req.cookies.get('accessToken')?.value

  const isPublic = publicRoutes.includes(pathname)

  // Nếu là public route → cho vào
  if (isPublic) {
    return NextResponse.next()
  }

  // Nếu là private route nhưng không có token → redirect về login
  if (!token) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  // Token hợp lệ → cho qua
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|css|js|mp4)).*)',
  ],
}

