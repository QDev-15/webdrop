import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { ids } = await req.json()
  if (!Array.isArray(ids)) return NextResponse.json({ error: 'ids phải là mảng' }, { status: 400 })

  await Promise.all(ids.map((id: number, idx: number) =>
    prisma.pricingFaq.update({ where: { id }, data: { sortOrder: idx } })
  ))
  return NextResponse.json({ ok: true })
}
