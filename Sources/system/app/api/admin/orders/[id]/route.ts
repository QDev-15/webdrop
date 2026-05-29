import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

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

  const order = await prisma.order.update({
    where: { id: parseInt(id) },
    data: {
      ...(status ? { status } : {}),
      ...(note !== undefined ? { note } : {}),
      ...(status === 'completed' ? { completedAt: new Date() } : {}),
    },
  })

  return NextResponse.json(order)
}
