import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const groups = await prisma.pricingGroup.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { plans: { orderBy: { sortOrder: 'asc' } } },
  })
  return NextResponse.json({ groups })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { slug, eyebrow, title, titleEm, subtitle, footnote, bg, type, description, tags, ctaLabel, ctaHref, status } = body

  if (!title || !slug) return NextResponse.json({ error: 'title và slug là bắt buộc' }, { status: 400 })

  try {
    const maxOrder = await prisma.pricingGroup.aggregate({ _max: { sortOrder: true } })
    const group = await prisma.pricingGroup.create({
      data: {
        slug, eyebrow: eyebrow || null, title,
        titleEm: titleEm || null, subtitle: subtitle || null,
        footnote: footnote || null,
        bg: bg ?? 'light', type: type ?? 'cards',
        description: description || null,
        tags: Array.isArray(tags) ? tags : [],
        ctaLabel: ctaLabel || null, ctaHref: ctaHref || null,
        status: status ?? 'published',
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
      include: { plans: true },
    })
    return NextResponse.json({ group }, { status: 201 })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2002') return NextResponse.json({ error: 'Slug đã tồn tại' }, { status: 409 })
    throw e
  }
}
