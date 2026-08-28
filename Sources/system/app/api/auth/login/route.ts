import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, createSessionToken, getSessionCookieOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email và mật khẩu không được để trống' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !verifyPassword(password, user.password)) {
      return NextResponse.json({ error: 'Email hoặc mật khẩu không đúng' }, { status: 401 })
    }
    if (user.role !== 'superadmin') {
      return NextResponse.json({ error: 'Tài khoản không có quyền truy cập admin' }, { status: 403 })
    }

    const token = createSessionToken({ id: user.id, email: user.email, role: user.role })
    const opts = getSessionCookieOptions()

    const res = NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
    res.cookies.set(opts.name, token, opts)
    return res
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 })
  }
}
