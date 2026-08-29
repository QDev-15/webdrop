import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; stepId: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { stepId } = await params
  const sid = parseInt(stepId)
  if (isNaN(sid)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

  const { title, desc } = await req.json()
  try {
    const step = await prisma.howItWorksStep.update({
      where: { id: sid },
      data: {
        ...(title !== undefined && { title }),
        ...(desc  !== undefined && { desc }),
      },
    })
    return NextResponse.json({ step })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2025') return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
    throw e
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string; stepId: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { stepId } = await params
  const sid = parseInt(stepId)
  if (isNaN(sid)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

  try {
    await prisma.howItWorksStep.delete({ where: { id: sid } })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2025') return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
    throw e
  }
}
