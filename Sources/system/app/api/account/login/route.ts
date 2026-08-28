import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, createAccountSessionToken, getAccountSessionCookieOptions } from '@/lib/auth'
import { normalizeEmail, normalizePhone } from '@/lib/accountValidation'

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json()

    if (!identifier?.trim() || !password) {
      return NextResponse.json({ error: 'Vui lòng nhập email/số điện thoại và mật khẩu' }, { status: 400 })
    }

    const raw = identifier.trim()
    const isEmail = raw.includes('@')

    const account = await prisma.customerAccount.findUnique({
      where: isEmail ? { email: normalizeEmail(raw) } : { phone: normalizePhone(raw) },
      select: { id: true, name: true, email: true, phone: true, password: true, avatarUrl: true },
    })

    if (!account || !verifyPassword(password, account.password)) {
      return NextResponse.json({ error: 'Thông tin đăng nhập hoặc mật khẩu không đúng' }, { status: 401 })
    }

    const token = createAccountSessionToken({ id: account.id, email: account.email, phone: account.phone })
    const opts = getAccountSessionCookieOptions()

    const res = NextResponse.json({
      ok: true,
      account: { id: account.id, name: account.name, email: account.email, phone: account.phone, avatarUrl: account.avatarUrl },
    })
    res.cookies.set(opts.name, token, opts)
    return res
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 })
  }
}
