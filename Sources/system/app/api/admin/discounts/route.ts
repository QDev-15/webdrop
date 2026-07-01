import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const codes = await prisma.discountCode.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ codes })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { code, type, value, maxUses, expiresAt, note } = await req.json()

  if (!code || !type || value === undefined) {
    return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 })
  }
  if (!['percent', 'fixed'].includes(type)) {
    return NextResponse.json({ error: 'type phải là percent hoặc fixed' }, { status: 400 })
  }
  if (type === 'percent' && (Number(value) < 1 || Number(value) > 100)) {
    return NextResponse.json({ error: 'Phần trăm phải từ 1–100' }, { status: 400 })
  }
  if (Number(value) <= 0) {
    return NextResponse.json({ error: 'Giá trị giảm phải lớn hơn 0' }, { status: 400 })
  }

  try {
    const dc = await prisma.discountCode.create({
      data: {
        code: code.trim().toUpperCase(),
        type,
        value: Number(value),
        maxUses: maxUses ? Number(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        note: note || null,
      },
    })
    return NextResponse.json({ ok: true, discountCode: dc })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2002') return NextResponse.json({ error: 'Mã này đã tồn tại' }, { status: 409 })
    return NextResponse.json({ error: 'Lỗi tạo mã' }, { status: 500 })
  }
}
