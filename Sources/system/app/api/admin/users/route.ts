import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession, hashPassword } from '@/lib/auth'
import { UserRole } from '@prisma/client'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function generateSlug(name: string): string {
  const base = name.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-')
  const suffix = Math.random().toString(36).slice(2, 6)
  return `${base || 'cv'}-${suffix}`
}

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.role !== 'superadmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const users = await prisma.user.findMany({
    select: {
      id: true, name: true, email: true, role: true, createdAt: true,
      cvProfile: { select: { id: true, slug: true, templateType: true } },
    },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json({ users })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.role !== 'superadmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { name, email, password, role, createCvProfile, cvTemplateType } = await req.json()

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

  const VALID_TEMPLATES = ['classic', 'minimal', 'creative', 'dark', 'executive']
  const templateType = VALID_TEMPLATES.includes(cvTemplateType) ? cvTemplateType : 'classic'

  try {
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashPassword(password),
        role: role === 'superadmin' ? UserRole.superadmin : UserRole.user,
        ...(createCvProfile && {
          cvProfile: {
            create: {
              templateType,
              slug: generateSlug(name.trim()),
              data: { create: {} },
            },
          },
        }),
      },
      select: {
        id: true, name: true, email: true, role: true, createdAt: true,
        cvProfile: { select: { id: true, slug: true, templateType: true } },
      },
    })
    return NextResponse.json(user, { status: 201 })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2002') return NextResponse.json({ error: 'Email đã tồn tại' }, { status: 409 })
    return NextResponse.json({ error: 'Lỗi tạo tài khoản' }, { status: 500 })
  }
}
