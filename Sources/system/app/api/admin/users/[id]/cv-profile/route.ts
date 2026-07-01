import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

type Ctx = { params: Promise<{ id: string }> }

const VALID_TEMPLATES = ['classic', 'minimal', 'creative', 'dark', 'executive']

function generateSlug(name: string): string {
  const base = name.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-')
  const suffix = Math.random().toString(36).slice(2, 6)
  return `${base || 'cv'}-${suffix}`
}

// Cấp CV profile cho user đã tồn tại
export async function POST(req: NextRequest, { params }: Ctx) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.role !== 'superadmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id: idStr } = await params
  const userId = parseInt(idStr)
  if (isNaN(userId)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, cvProfile: { select: { id: true } } },
  })
  if (!user) return NextResponse.json({ error: 'Không tìm thấy user' }, { status: 404 })
  if (user.cvProfile) return NextResponse.json({ error: 'User đã có CV profile' }, { status: 409 })

  const body = await req.json().catch(() => ({}))
  const templateType = VALID_TEMPLATES.includes(body.templateType) ? body.templateType : 'classic'

  const profile = await prisma.cvProfile.create({
    data: {
      userId,
      templateType,
      slug: generateSlug(user.name),
      data: { create: {} },
    },
    select: { id: true, slug: true, templateType: true },
  })

  return NextResponse.json({ cvProfile: profile }, { status: 201 })
}

// Thu hồi CV profile
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.role !== 'superadmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id: idStr } = await params
  const userId = parseInt(idStr)
  if (isNaN(userId)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

  try {
    await prisma.cvProfile.delete({ where: { userId } })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2025') return NextResponse.json({ error: 'CV profile không tồn tại' }, { status: 404 })
    return NextResponse.json({ error: 'Lỗi xóa CV profile' }, { status: 500 })
  }
}
