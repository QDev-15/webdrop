import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const packages = await prisma.howItWorksPackage.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { steps: { orderBy: { sortOrder: 'asc' } } },
  })
  return NextResponse.json({ packages })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, slug, tagline, icon, price, hot, ctaLabel, ctaHref, suitable, status } = body

  if (!name || !slug) return NextResponse.json({ error: 'name và slug là bắt buộc' }, { status: 400 })

  try {
    const maxOrder = await prisma.howItWorksPackage.aggregate({ _max: { sortOrder: true } })
    const pkg = await prisma.howItWorksPackage.create({
      data: {
        name, slug,
        tagline: tagline || null,
        icon: icon || '📦',
        price: price || null,
        hot: hot ?? false,
        ctaLabel: ctaLabel || null,
        ctaHref: ctaHref || null,
        suitable: Array.isArray(suitable) ? suitable : [],
        status: status ?? 'published',
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
      include: { steps: true },
    })
    return NextResponse.json({ package: pkg }, { status: 201 })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2002') return NextResponse.json({ error: 'Slug đã tồn tại' }, { status: 409 })
    throw e
  }
}
