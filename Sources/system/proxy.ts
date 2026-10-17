import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'wd_session'

// Cây route tĩnh của app/ (route group (site)/(admin)/(checkout) đã gộp, bỏ /api —
// case của API path không ảnh hưởng người dùng gõ link tay). Key là tên segment cố
// định đúng case thật trên đĩa; "[xxx]" đại diện segment động (slug/id — giữ nguyên
// case gốc vì đó là dữ liệu, không phải tên route). Phải cập nhật tay khi thêm/đổi
// tên route tĩnh mới trong app/ (không tự scan lúc runtime vì Edge runtime không có fs).
type RouteNode = { [segment: string]: RouteNode }

const ROUTE_TREE: RouteNode = {"admin":{"about":{"team":{"new":{},"[id]":{}},"values":{"new":{},"[id]":{}}},"analytics":{},"contacts":{},"customers":{"new":{},"[id]":{}},"discounts":{},"faq":{"create":{},"[id]":{"edit":{}}},"help":{"articles":{"new":{},"[id]":{}},"categories":{"new":{},"[id]":{}}},"homepage":{},"how-it-works":{"new":{},"[id]":{"edit":{}}},"login":{},"orders":{"[id]":{}},"posts":{"new":{},"[id]":{"edit":{}}},"pricing":{"new":{},"[id]":{"edit":{}}},"profile":{},"projects":{"[id]":{}},"revenue":{},"settings":{},"slides":{"new":{},"[id]":{"edit":{}}},"templates":{"new":{},"[id]":{"edit":{}}},"users":{}},"checkout":{"cv":{},"pending":{},"success":{}},"about":{},"account":{},"blog":{"[slug]":{}},"contact":{},"cvs":{},"docs":{},"faq":{},"gio-hang":{},"help":{"articles":{"[slug]":{}},"category":{"[slug]":{}}},"how-it-works":{},"lich-bong-da":{"[slug]":{}},"login":{},"policies":{"[slug]":{}},"pricing":{},"register":{},"templates":{"[slug]":{}},"cv":{"[slug]":{}},"cv-manager":{"edit":{},"login":{}},"docscanner":{"PrivacyPolicy":{}},"facebook":{"MeoThongThai":{"KeHoachPhatTrien":{}}}}

// Đối chiếu pathname với ROUTE_TREE không phân biệt hoa/thường cho từng segment cố
// định, trả về pathname đúng case thật nếu có segment nào lệch case — null nếu đã
// đúng case sẵn hoặc không khớp route nào trong cây (file tĩnh, API, 404 thật...).
function canonicalizePath(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return null

  let node: RouteNode = ROUTE_TREE
  const outSegments: string[] = []
  let changed = false

  for (const seg of segments) {
    if (Object.prototype.hasOwnProperty.call(node, seg)) {
      outSegments.push(seg)
      node = node[seg]
      continue
    }
    const lower = seg.toLowerCase()
    const keys = Object.keys(node)
    const literalMatch = keys.find((k) => !k.startsWith('[') && k.toLowerCase() === lower)
    if (literalMatch) {
      outSegments.push(literalMatch)
      node = node[literalMatch]
      changed = true
      continue
    }
    const dynamicKey = keys.find((k) => k.startsWith('['))
    if (dynamicKey) {
      outSegments.push(seg)
      node = node[dynamicKey]
      continue
    }
    return null
  }

  return changed ? '/' + outSegments.join('/') : null
}

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

  // Case-insensitive routing cho toàn site: Next.js app router mặc định phân biệt
  // hoa/thường theo tên thư mục thật trên đĩa (404 nếu gõ sai case). Chuẩn hoá về
  // đúng case thật rồi redirect 308 (permanent, giữ nguyên method) — chỉ áp dụng cho
  // tên route cố định, segment động (slug/id) giữ nguyên case gốc vì là dữ liệu.
  const canonicalPath = canonicalizePath(pathname)
  if (canonicalPath) {
    const url = req.nextUrl.clone()
    url.pathname = canonicalPath
    return NextResponse.redirect(url, 308)
  }

  // Bỏ qua login page và API auth
  if (pathname === '/admin/login' || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Bảo vệ tất cả /admin/* và /api/admin/* — phải vừa có token hợp lệ vừa đúng role
  // superadmin. Trước đây chỉ check "có token hợp lệ" (không xem role) → 1 session
  // role 'user' hợp lệ (còn hạn) vẫn lọt qua được lớp proxy này, dữ liệu thật vẫn có
  // thể rò rỉ qua các trang Server Component gọi thẳng Prisma (không qua fetch API).
  // So theo ranh giới segment (=== hoặc startsWith + '/') — matcher giờ chạy toàn site
  // nên startsWith('/admin') không kèm ranh giới sẽ vô tình khớp cả route tĩnh tương lai
  // như /admin-guide, /administracao dù không phải trang admin thật.
  const isAdminPath = pathname === '/admin' || pathname.startsWith('/admin/')
  const isAdminApiPath = pathname === '/api/admin' || pathname.startsWith('/api/admin/')
  if (isAdminPath || isAdminApiPath) {
    const secret = process.env.SESSION_SECRET
    if (!secret) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }
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
  // Match toàn site (trừ asset tĩnh _next/favicon) để case-insensitive routing áp
  // dụng mọi trang, không riêng /admin — khối check quyền admin phía trên vẫn chỉ
  // chạy logic thật khi pathname bắt đầu bằng /admin hoặc /api/admin như trước.
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)'],
}
