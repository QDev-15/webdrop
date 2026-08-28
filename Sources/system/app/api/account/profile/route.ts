import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAccountSession, hashPassword, verifyPassword } from '@/lib/auth'
import { EMAIL_RE, PHONE_RE, normalizeEmail, normalizePhone } from '@/lib/accountValidation'

export async function PUT(req: NextRequest) {
  const session = await getAccountSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, email, phone, currentPassword, newPassword } = await req.json()
  const updateData: Record<string, string> = {}

  if (name?.trim()) {
    if (name.trim().length > 100) return NextResponse.json({ error: 'Tên quá dài' }, { status: 400 })
    updateData.name = name.trim()
  }

  if (email?.trim()) {
    if (!EMAIL_RE.test(email.trim())) return NextResponse.json({ error: 'Email không hợp lệ' }, { status: 400 })
    const normalizedEmail = normalizeEmail(email)
    const existing = await prisma.customerAccount.findUnique({ where: { email: normalizedEmail }, select: { id: true } })
    if (existing && existing.id !== session.id) {
      return NextResponse.json({ error: 'Email này đã được dùng bởi tài khoản khác' }, { status: 409 })
    }
    updateData.email = normalizedEmail
  }

  if (phone?.trim()) {
    if (!PHONE_RE.test(normalizePhone(phone))) return NextResponse.json({ error: 'Số điện thoại không hợp lệ' }, { status: 400 })
    const normalizedPhone = normalizePhone(phone)
    const existing = await prisma.customerAccount.findUnique({ where: { phone: normalizedPhone }, select: { id: true } })
    if (existing && existing.id !== session.id) {
      return NextResponse.json({ error: 'Số điện thoại này đã được dùng bởi tài khoản khác' }, { status: 409 })
    }
    updateData.phone = normalizedPhone
  }

  if (newPassword) {
    if (newPassword.length < 6) return NextResponse.json({ error: 'Mật khẩu mới phải ít nhất 6 ký tự' }, { status: 400 })
    if (!currentPassword) return NextResponse.json({ error: 'Cần nhập mật khẩu hiện tại' }, { status: 400 })

    const account = await prisma.customerAccount.findUnique({ where: { id: session.id }, select: { password: true } })
    if (!account || !verifyPassword(currentPassword, account.password)) {
      return NextResponse.json({ error: 'Mật khẩu hiện tại không đúng' }, { status: 400 })
    }
    updateData.password = hashPassword(newPassword)
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: 'Không có thông tin để cập nhật' }, { status: 400 })
  }

  try {
    const account = await prisma.customerAccount.update({
      where: { id: session.id },
      data: updateData,
      select: { id: true, name: true, email: true, phone: true, avatarUrl: true },
    })
    return NextResponse.json({ account })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2002') return NextResponse.json({ error: 'Email hoặc số điện thoại đã được dùng bởi tài khoản khác' }, { status: 409 })
    console.error(e)
    return NextResponse.json({ error: 'Lỗi cập nhật' }, { status: 500 })
  }
}
