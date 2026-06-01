import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id: parseInt(id) },
    include: {
      customer: true,
      items: true,
      payments: true,
      project: { include: { milestones: true } },
    },
  })
  if (!order) return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
  return NextResponse.json(order)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { status, note } = body

  const validStatuses = ['new', 'confirmed', 'in_progress', 'delivered', 'completed', 'cancelled']
  if (status && !validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Trạng thái không hợp lệ' }, { status: 400 })
  }

  try {
    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        ...(status ? { status } : {}),
        ...(note !== undefined ? { note } : {}),
        ...(status === 'completed' ? { completedAt: new Date() } : {}),
      },
    })
    return NextResponse.json(order)
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2025') return NextResponse.json({ error: 'Không tìm thấy đơn hàng' }, { status: 404 })
    return NextResponse.json({ error: 'Lỗi cập nhật đơn hàng' }, { status: 500 })
  }
}
