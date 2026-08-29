import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const gid = parseInt(id)
  if (isNaN(gid)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

  const { name, price, features, hot, ctaLabel, ctaHref } = await req.json()
  if (!name) return NextResponse.json({ error: 'name là bắt buộc' }, { status: 400 })

  const maxOrder = await prisma.pricingPlan.aggregate({ where: { groupId: gid }, _max: { sortOrder: true } })
  const plan = await prisma.pricingPlan.create({
    data: {
      groupId: gid, name, price: price || '',
      features: Array.isArray(features) ? features : [],
      hot: hot ?? false,
      ctaLabel: ctaLabel || null, ctaHref: ctaHref || null,
      sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
    },
  })
  return NextResponse.json({ plan }, { status: 201 })
}
