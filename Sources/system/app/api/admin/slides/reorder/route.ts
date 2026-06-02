import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// Body: { ids: number[] } — thứ tự mới từ trên xuống dưới
export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { ids } = await req.json() as { ids: number[] }
  if (!Array.isArray(ids)) return NextResponse.json({ error: 'ids phải là array' }, { status: 400 })

  await Promise.all(
    ids.map((id, index) => prisma.heroSlide.update({ where: { id }, data: { sortOrder: index } }))
  )
  return NextResponse.json({ ok: true })
}
