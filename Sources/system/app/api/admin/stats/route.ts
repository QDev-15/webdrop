import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  const [
    totalOrders, newOrdersThisMonth,
    totalCustomers, newCustomersThisMonth,
    templatesSold,
    revenueThisMonth, revenueLastMonth,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.customer.count(),
    prisma.customer.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.template.aggregate({ _sum: { salesCount: true } }),
    prisma.payment.aggregate({ where: { status: 'paid', paidAt: { gte: startOfMonth } }, _sum: { amount: true } }),
    prisma.payment.aggregate({ where: { status: 'paid', paidAt: { gte: startOfLastMonth, lte: endOfLastMonth } }, _sum: { amount: true } }),
    prisma.order.findMany({
      take: 5, orderBy: { createdAt: 'desc' },
      include: { customer: { select: { name: true } } },
    }),
  ])

  return NextResponse.json({
    totalOrders,
    newOrdersThisMonth,
    totalCustomers,
    newCustomersThisMonth,
    templatesSold: templatesSold._sum.salesCount || 0,
    revenueThisMonth: revenueThisMonth._sum.amount || 0,
    revenueLastMonth: revenueLastMonth._sum.amount || 0,
    recentOrders,
  })
}
