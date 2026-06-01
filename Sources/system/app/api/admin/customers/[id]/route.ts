import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const customer = await prisma.customer.findUnique({
    where: { id: parseInt(id) },
    include: {
      orders: { orderBy: { createdAt: 'desc' }, include: { payments: { select: { status: true, amount: true } } } },
      contacts: true,
    },
  })
  if (!customer) return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
  return NextResponse.json(customer)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { name, email, phone, company, address, note, status } = body
  try {
    const customer = await prisma.customer.update({
      where: { id: parseInt(id) },
      data: { name, email: email || null, phone: phone || null, company: company || null, address: address || null, note: note || null, ...(status ? { status } : {}) },
    })
    return NextResponse.json(customer)
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2025') return NextResponse.json({ error: 'Không tìm thấy khách hàng' }, { status: 404 })
    return NextResponse.json({ error: 'Lỗi cập nhật' }, { status: 500 })
  }
}
