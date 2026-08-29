import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: idStr } = await params
  const id = parseInt(idStr)
  if (isNaN(id)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

  const body = await req.json()
  const { type, bg, badge, title, data, buttons, sortOrder, status } = body

  const slide = await prisma.heroSlide.update({
    where: { id },
    data: {
      ...(type !== undefined && { type }),
      ...(bg !== undefined && { bg }),
      ...(badge !== undefined && { badge }),
      ...(title !== undefined && { title }),
      ...(data !== undefined && { data }),
      ...(buttons !== undefined && { buttons }),
      ...(sortOrder !== undefined && { sortOrder }),
      ...(status !== undefined && { status }),
    },
  })
  return NextResponse.json(slide)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: idStr } = await params
  const id = parseInt(idStr)
  if (isNaN(id)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

  await prisma.heroSlide.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
