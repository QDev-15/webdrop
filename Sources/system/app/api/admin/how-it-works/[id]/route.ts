import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const pkgId = parseInt(id)
  if (isNaN(pkgId)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

  const pkg = await prisma.howItWorksPackage.findUnique({
    where: { id: pkgId },
    include: { steps: { orderBy: { sortOrder: 'asc' } } },
  })
  if (!pkg) return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
  return NextResponse.json({ package: pkg })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const pkgId = parseInt(id)
  if (isNaN(pkgId)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

  const body = await req.json()
  const { name, slug, tagline, icon, price, hot, ctaLabel, ctaHref, suitable, status } = body

  try {
    const pkg = await prisma.howItWorksPackage.update({
      where: { id: pkgId },
      data: {
        ...(name     !== undefined && { name }),
        ...(slug     !== undefined && { slug }),
        ...(tagline  !== undefined && { tagline }),
        ...(icon     !== undefined && { icon }),
        ...(price    !== undefined && { price }),
        ...(hot      !== undefined && { hot }),
        ...(ctaLabel !== undefined && { ctaLabel }),
        ...(ctaHref  !== undefined && { ctaHref }),
        ...(suitable !== undefined && { suitable: Array.isArray(suitable) ? suitable : [] }),
        ...(status   !== undefined && { status }),
      },
      include: { steps: { orderBy: { sortOrder: 'asc' } } },
    })
    return NextResponse.json({ package: pkg })
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
  const pkgId = parseInt(id)
  if (isNaN(pkgId)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

  try {
    await prisma.howItWorksPackage.delete({ where: { id: pkgId } })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2025') return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
    throw e
  }
}
