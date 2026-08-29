import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('q')
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = 20

  const where = search ? {
    OR: [
      { name: { contains: search, mode: 'insensitive' as const } },
      { email: { contains: search, mode: 'insensitive' as const } },
      { phone: { contains: search, mode: 'insensitive' as const } },
    ],
  } : {}

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      include: {
        _count: { select: { orders: true } },
        orders: { select: { total: true, createdAt: true }, orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.customer.count({ where }),
  ])

  return NextResponse.json({ customers, total, page, pages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, email, phone, company, address, note } = body
  if (!name) return NextResponse.json({ error: 'Thiếu tên khách hàng' }, { status: 400 })

  try {
    const customer = await prisma.customer.create({
      data: { name, email: email || null, phone: phone || null, company: company || null, address: address || null, note: note || null },
    })
    return NextResponse.json(customer, { status: 201 })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2002') return NextResponse.json({ error: 'Email đã tồn tại trong hệ thống' }, { status: 409 })
    return NextResponse.json({ error: 'Lỗi tạo khách hàng' }, { status: 500 })
  }
}
