import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const numId = parseInt(id)
  if (isNaN(numId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const body = await req.json()
  const allowed = ['isActive', 'maxUses', 'expiresAt', 'note', 'value']
  const data: Record<string, unknown> = {}
  for (const k of allowed) {
    if (k in body) {
      if (k === 'expiresAt') data[k] = body[k] ? new Date(body[k]) : null
      else if (k === 'maxUses') data[k] = body[k] !== null && body[k] !== '' ? Number(body[k]) : null
      else if (k === 'value') data[k] = Number(body[k])
      else data[k] = body[k]
    }
  }

  try {
    const dc = await prisma.discountCode.update({ where: { id: numId }, data })
    return NextResponse.json({ ok: true, discountCode: dc })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2025') return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
    return NextResponse.json({ error: 'Lỗi cập nhật' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const numId = parseInt(id)
  if (isNaN(numId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  try {
    await prisma.discountCode.delete({ where: { id: numId } })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2025') return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
    return NextResponse.json({ error: 'Lỗi xóa' }, { status: 500 })
  }
}
