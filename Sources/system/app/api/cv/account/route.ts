import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCvSession as getSession, hashPassword, verifyPassword } from '@/lib/auth'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { id: true, name: true, email: true },
  })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ user })
}

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, email, currentPassword, newPassword } = await req.json()

  const updateData: Record<string, string> = {}

  if (name?.trim()) {
    if (name.trim().length > 100) return NextResponse.json({ error: 'Tên quá dài' }, { status: 400 })
    updateData.name = name.trim()
  }

  if (email?.trim()) {
    if (!EMAIL_RE.test(email.trim())) return NextResponse.json({ error: 'Email không hợp lệ' }, { status: 400 })
    updateData.email = email.trim().toLowerCase()
  }

  if (newPassword) {
    if (newPassword.length < 6) return NextResponse.json({ error: 'Mật khẩu mới phải ít nhất 6 ký tự' }, { status: 400 })
    if (!currentPassword) return NextResponse.json({ error: 'Cần nhập mật khẩu hiện tại' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { id: session.id }, select: { password: true } })
    if (!user || !verifyPassword(currentPassword, user.password)) {
      return NextResponse.json({ error: 'Mật khẩu hiện tại không đúng' }, { status: 400 })
    }
    updateData.password = hashPassword(newPassword)
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: 'Không có thông tin để cập nhật' }, { status: 400 })
  }

  try {
    const user = await prisma.user.update({
      where: { id: session.id },
      data: updateData,
      select: { id: true, name: true, email: true },
    })
    return NextResponse.json({ user })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2002') return NextResponse.json({ error: 'Email đã được dùng bởi tài khoản khác' }, { status: 409 })
    return NextResponse.json({ error: 'Lỗi cập nhật' }, { status: 500 })
  }
}
