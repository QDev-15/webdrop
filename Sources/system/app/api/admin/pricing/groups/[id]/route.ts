import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const gid = parseInt(id)
  if (isNaN(gid)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

  const group = await prisma.pricingGroup.findUnique({
    where: { id: gid },
    include: { plans: { orderBy: { sortOrder: 'asc' } } },
  })
  if (!group) return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
  return NextResponse.json({ group })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const gid = parseInt(id)
  if (isNaN(gid)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

  const body = await req.json()
  const { slug, eyebrow, title, titleEm, subtitle, footnote, bg, type, description, tags, ctaLabel, ctaHref, status } = body

  try {
    const group = await prisma.pricingGroup.update({
      where: { id: gid },
      data: {
        ...(slug        !== undefined && { slug }),
        ...(eyebrow     !== undefined && { eyebrow }),
        ...(title       !== undefined && { title }),
        ...(titleEm     !== undefined && { titleEm }),
        ...(subtitle    !== undefined && { subtitle }),
        ...(footnote    !== undefined && { footnote }),
        ...(bg          !== undefined && { bg }),
        ...(type        !== undefined && { type }),
        ...(description !== undefined && { description }),
        ...(tags        !== undefined && { tags: Array.isArray(tags) ? tags : [] }),
        ...(ctaLabel    !== undefined && { ctaLabel }),
        ...(ctaHref     !== undefined && { ctaHref }),
        ...(status      !== undefined && { status }),
      },
      include: { plans: { orderBy: { sortOrder: 'asc' } } },
    })
    return NextResponse.json({ group })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2002') return NextResponse.json({ error: 'Slug đã tồn tại' }, { status: 409 })
    if (err.code === 'P2025') return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
    throw e
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const gid = parseInt(id)
  if (isNaN(gid)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

  try {
    await prisma.pricingGroup.delete({ where: { id: gid } })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2025') return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
    throw e
  }
}
