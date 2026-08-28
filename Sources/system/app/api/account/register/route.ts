import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, createAccountSessionToken, getAccountSessionCookieOptions } from '@/lib/auth'
import { EMAIL_RE, PHONE_RE, normalizeEmail, normalizePhone } from '@/lib/accountValidation'

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password } = await req.json()

    if (!name?.trim() || !email?.trim() || !phone?.trim() || !password) {
      return NextResponse.json({ error: 'Vui lòng nhập đầy đủ họ tên, email, số điện thoại và mật khẩu' }, { status: 400 })
    }
    if (!EMAIL_RE.test(email.trim())) {
      return NextResponse.json({ error: 'Email không hợp lệ' }, { status: 400 })
    }
    if (!PHONE_RE.test(normalizePhone(phone))) {
      return NextResponse.json({ error: 'Số điện thoại không hợp lệ' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' }, { status: 400 })
    }

    const normalizedEmail = normalizeEmail(email)
    const normalizedPhone = normalizePhone(phone)

    const [existingEmail, existingPhone] = await Promise.all([
      prisma.customerAccount.findUnique({ where: { email: normalizedEmail }, select: { id: true } }),
      prisma.customerAccount.findUnique({ where: { phone: normalizedPhone }, select: { id: true } }),
    ])
    if (existingEmail) {
      return NextResponse.json({ error: 'Email này đã được đăng ký' }, { status: 409 })
    }
    if (existingPhone) {
      return NextResponse.json({ error: 'Số điện thoại này đã được đăng ký cho một tài khoản khác' }, { status: 409 })
    }

    const hashedPassword = hashPassword(password)

    // Tự tìm Customer (CRM) có sẵn theo email để gắn lịch sử đơn hàng cũ (nếu khách đã từng mua trước khi có tài khoản)
    const existingCustomer = await prisma.customer.findFirst({ where: { email: normalizedEmail } })

    const account = await prisma.customerAccount.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
        password: hashedPassword,
        customerId: existingCustomer?.id ?? null,
      },
      select: { id: true, name: true, email: true, phone: true, avatarUrl: true },
    })

    const token = createAccountSessionToken({ id: account.id, email: account.email, phone: account.phone })
    const opts = getAccountSessionCookieOptions()

    const res = NextResponse.json({ ok: true, account })
    res.cookies.set(opts.name, token, opts)
    return res
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'Email hoặc số điện thoại đã được sử dụng' }, { status: 409 })
    }
    console.error(e)
    return NextResponse.json({ error: 'Lỗi tạo tài khoản' }, { status: 500 })
  }
}
