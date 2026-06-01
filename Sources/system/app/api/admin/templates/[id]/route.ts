import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const { name, slug, description, thumbnail, demoUrl, price, category, industryId, status } = body

  try {
    const template = await prisma.template.update({
      where: { id: parseInt(id) },
      data: { name, slug, description, thumbnail, demoUrl, price, category, industryId: industryId || null, ...(status ? { status } : {}) },
    })
    revalidatePath('/')
    return NextResponse.json(template)
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2025') return NextResponse.json({ error: 'Không tìm thấy template' }, { status: 404 })
    return NextResponse.json({ error: 'Lỗi cập nhật' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  await prisma.template.delete({ where: { id: parseInt(id) } })
  revalidatePath('/')
  return NextResponse.json({ ok: true })
}
