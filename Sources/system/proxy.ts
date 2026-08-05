import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'wd_session'

async function verifyTokenEdge(token: string, secret: string): Promise<boolean> {
  try {
    const [data, sig] = token.split('.')
    if (!data || !sig) return false
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )
    const sigBytes = Buffer.from(sig, 'base64url')
    const dataBytes = encoder.encode(data)
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, dataBytes)
    if (!valid) return false
    // Check token expiry
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString())
    if (payload.exp && Date.now() > payload.exp) return false
    return true
  } catch {
    return false
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const secret = process.env.SESSION_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  // Bỏ qua login page và API auth
  if (pathname === '/admin/login' || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Bảo vệ tất cả /admin/* và /api/admin/*
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const token = req.cookies.get(COOKIE_NAME)?.value
    if (!token || !(await verifyTokenEdge(token, secret))) {
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

// Backward compatibility alias for middleware
export { proxy as middleware }

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
}
