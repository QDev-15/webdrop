import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; mid: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { mid } = await params
  const { status } = await req.json()

  if (!['pending', 'done'].includes(status)) {
    return NextResponse.json({ error: 'Trạng thái không hợp lệ' }, { status: 400 })
  }

  try {
    const milestone = await prisma.projectMilestone.update({
      where: { id: parseInt(mid) },
      data: { status, completedAt: status === 'done' ? new Date() : null },
    })
    return NextResponse.json(milestone)
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2025') return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
    return NextResponse.json({ error: 'Lỗi cập nhật' }, { status: 500 })
  }
}
