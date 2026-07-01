import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, createSessionToken, getCvSessionCookieOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Thiếu email hoặc mật khẩu' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
    select: { id: true, email: true, name: true, password: true, role: true },
  })

  if (!user || !verifyPassword(password, user.password)) {
    return NextResponse.json({ error: 'Email hoặc mật khẩu không đúng' }, { status: 401 })
  }

  // Kiểm tra user có CV profile không
  const profile = await prisma.cvProfile.findUnique({ where: { userId: user.id } })
  if (!profile) {
    return NextResponse.json({ error: 'Tài khoản này chưa có CV. Vui lòng đăng ký tại /cvs.' }, { status: 403 })
  }

  const token = createSessionToken({ id: user.id, email: user.email, role: user.role })
  const opts = getCvSessionCookieOptions()

  const res = NextResponse.json({ ok: true })
  res.cookies.set(opts.name, token, opts)
  return res
}
