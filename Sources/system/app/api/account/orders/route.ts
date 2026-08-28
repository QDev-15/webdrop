import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAccountSession } from '@/lib/auth'

export async function GET() {
  const session = await getAccountSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const account = await prisma.customerAccount.findUnique({
    where: { id: session.id },
    select: { customerId: true },
  })
  if (!account?.customerId) return NextResponse.json({ orders: [] })

  const orders = await prisma.order.findMany({
    where: { customerId: account.customerId },
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  })

  return NextResponse.json({ orders })
}
