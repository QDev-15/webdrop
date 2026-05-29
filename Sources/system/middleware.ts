import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken } from '@/lib/auth'

const SESSION_SECRET = process.env.SESSION_SECRET || 'webdrop-dev-secret-change-in-production'
const COOKIE_NAME = 'wd_session'

// Middleware chạy ở Edge — không dùng Node.js crypto, dùng Web Crypto API
async function verifyTokenEdge(token: string): Promise<boolean> {
  try {
    const [data, sig] = token.split('.')
    if (!data || !sig) return false
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(SESSION_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )
    const sigBytes = Buffer.from(sig, 'base64url')
    const dataBytes = encoder.encode(data)
    return await crypto.subtle.verify('HMAC', key, sigBytes, dataBytes)
  } catch {
    return false
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Bỏ qua login page và API auth
  if (pathname === '/admin/login' || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Bảo vệ tất cả /admin/* và /api/admin/*
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const token = req.cookies.get(COOKIE_NAME)?.value
    if (!token || !(await verifyTokenEdge(token))) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
