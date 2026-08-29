import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'wd_session'

// Trả về payload nếu chữ ký hợp lệ + chưa hết hạn, null nếu không — để caller tự kiểm tra
// thêm `role` (không chỉ "có token hợp lệ" là đủ, còn phải đúng superadmin).
async function verifyTokenEdge(token: string, secret: string): Promise<{ role?: string } | null> {
  try {
    const [data, sig] = token.split('.')
    if (!data || !sig) return null
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
    if (!valid) return null
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString())
    if (payload.exp && Date.now() > payload.exp) return null
    return payload
  } catch {
    return null
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

  // Bảo vệ tất cả /admin/* và /api/admin/* — phải vừa có token hợp lệ vừa đúng role
  // superadmin. Trước đây chỉ check "có token hợp lệ" (không xem role) → 1 session
  // role 'user' hợp lệ (còn hạn) vẫn lọt qua được lớp proxy này, dữ liệu thật vẫn có
  // thể rò rỉ qua các trang Server Component gọi thẳng Prisma (không qua fetch API).
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const token = req.cookies.get(COOKIE_NAME)?.value
    const payload = token ? await verifyTokenEdge(token, secret) : null
    if (!payload || payload.role !== 'superadmin') {
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
