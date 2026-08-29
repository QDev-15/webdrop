import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession, hashPassword } from '@/lib/auth'
import { UserRole } from '@prisma/client'
import { EMAIL_RE } from '@/lib/accountValidation'

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json({ users })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, email, password, role } = await req.json()

  if (!name?.trim() || !email?.trim() || !password) {
    return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 })
  }
  if (!EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: 'Email không hợp lệ' }, { status: 400 })
  }
  if (name.trim().length > 100) {
    return NextResponse.json({ error: 'Tên quá dài (tối đa 100 ký tự)' }, { status: 400 })
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Mật khẩu phải ít nhất 6 ký tự' }, { status: 400 })
  }

  try {
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashPassword(password),
        role: role === 'superadmin' ? UserRole.superadmin : UserRole.user,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })
    return NextResponse.json(user, { status: 201 })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2002') return NextResponse.json({ error: 'Email đã tồn tại' }, { status: 409 })
    return NextResponse.json({ error: 'Lỗi tạo tài khoản' }, { status: 500 })
  }
}
