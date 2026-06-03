import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; planId: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { planId } = await params
  const pid = parseInt(planId)
  if (isNaN(pid)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

  const { name, price, features, hot, ctaLabel, ctaHref } = await req.json()
  try {
    const plan = await prisma.pricingPlan.update({
      where: { id: pid },
      data: {
        ...(name     !== undefined && { name }),
        ...(price    !== undefined && { price }),
        ...(features !== undefined && { features: Array.isArray(features) ? features : [] }),
        ...(hot      !== undefined && { hot }),
        ...(ctaLabel !== undefined && { ctaLabel }),
        ...(ctaHref  !== undefined && { ctaHref }),
      },
    })
    return NextResponse.json({ plan })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2025') return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
    throw e
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string; planId: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { planId } = await params
  const pid = parseInt(planId)
  if (isNaN(pid)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

  try {
    await prisma.pricingPlan.delete({ where: { id: pid } })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2025') return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
    throw e
  }
}
