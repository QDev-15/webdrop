import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const fid = parseInt(id)
  if (isNaN(fid)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

  const { question, answer, status } = await req.json()
  try {
    const faq = await prisma.pricingFaq.update({
      where: { id: fid },
      data: {
        ...(question !== undefined && { question }),
        ...(answer   !== undefined && { answer }),
        ...(status   !== undefined && { status }),
      },
    })
    return NextResponse.json({ faq })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2025') return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
    throw e
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const fid = parseInt(id)
  if (isNaN(fid)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

  try {
    await prisma.pricingFaq.delete({ where: { id: fid } })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2025') return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
    throw e
  }
}
