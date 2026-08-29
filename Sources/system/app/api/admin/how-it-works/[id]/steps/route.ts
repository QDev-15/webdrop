import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// POST /api/admin/how-it-works/[id]/steps
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const pkgId = parseInt(id)
  if (isNaN(pkgId)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

  const { title, desc } = await req.json()
  if (!title) return NextResponse.json({ error: 'title là bắt buộc' }, { status: 400 })

  const maxOrder = await prisma.howItWorksStep.aggregate({
    where: { packageId: pkgId },
    _max: { sortOrder: true },
  })
  const step = await prisma.howItWorksStep.create({
    data: {
      packageId: pkgId,
      title,
      desc: desc || null,
      sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
    },
  })
  return NextResponse.json({ step }, { status: 201 })
}
