import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const numId = parseInt(id)
  if (isNaN(numId)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

  try {
    const project = await prisma.project.findUnique({
      where: { id: numId },
      include: {
        customer: { select: { id: true, name: true, phone: true, email: true } },
        order: { select: { id: true, code: true, total: true, status: true } },
        milestones: { orderBy: { id: 'asc' } },
        notes: { orderBy: { createdAt: 'desc' }, include: { createdByUser: { select: { name: true } } } },
      },
    })
    if (!project) return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
    return NextResponse.json(project)
  } catch {
    return NextResponse.json({ error: 'Lỗi truy vấn' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { status, domain, adminUrl, hostingInfo, note } = body

  if (status && !['planning', 'designing', 'developing', 'reviewing', 'delivered', 'done'].includes(status)) {
    return NextResponse.json({ error: 'Trạng thái không hợp lệ' }, { status: 400 })
  }

  try {
    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        ...(status ? { status } : {}),
        ...(domain !== undefined ? { domain: domain || null } : {}),
        ...(adminUrl !== undefined ? { adminUrl: adminUrl || null } : {}),
        ...(hostingInfo !== undefined ? { hostingInfo: hostingInfo || null } : {}),
        ...(note !== undefined ? { note: note || null } : {}),
      },
    })
    return NextResponse.json(project)
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2025') return NextResponse.json({ error: 'Không tìm thấy dự án' }, { status: 404 })
    return NextResponse.json({ error: 'Lỗi cập nhật' }, { status: 500 })
  }
}
