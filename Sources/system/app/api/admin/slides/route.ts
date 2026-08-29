import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const slides = await prisma.heroSlide.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json(slides)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { type, bg, badge, title, data, buttons, status } = body

  if (!type || !bg || !badge || !title || !data || !buttons) {
    return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 })
  }

  const maxOrder = await prisma.heroSlide.aggregate({ _max: { sortOrder: true } })
  const sortOrder = (maxOrder._max.sortOrder ?? 0) + 1

  const slide = await prisma.heroSlide.create({
    data: { type, bg, badge, title, data, buttons, sortOrder, status: status ?? 'published' },
  })
  return NextResponse.json(slide, { status: 201 })
}
