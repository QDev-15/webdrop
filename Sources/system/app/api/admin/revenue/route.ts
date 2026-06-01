import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()))

  // Doanh thu theo tháng (từ payments đã paid)
  const monthlyRevenue = await Promise.all(
    Array.from({ length: 12 }, (_, i) => i + 1).map(async month => {
      const start = new Date(year, month - 1, 1)
      const end = new Date(year, month, 0, 23, 59, 59)
      const agg = await prisma.payment.aggregate({
        where: { status: 'paid', paidAt: { gte: start, lte: end } },
        _sum: { amount: true },
      })
      return { month, amount: Number(agg._sum.amount || 0) }
    })
  )

  // Chi phí theo tháng
  const monthlyExpenses = await Promise.all(
    Array.from({ length: 12 }, (_, i) => i + 1).map(async month => {
      const start = new Date(year, month - 1, 1)
      const end = new Date(year, month, 0, 23, 59, 59)
      const agg = await prisma.expense.aggregate({
        where: { paidAt: { gte: start, lte: end } },
        _sum: { amount: true },
      })
      return { month, amount: Number(agg._sum.amount || 0) }
    })
  )

  // Tổng năm
  const yearStart = new Date(year, 0, 1)
  const yearEnd = new Date(year, 11, 31, 23, 59, 59)
  const [totalRevenue, totalExpense, recentExpenses] = await Promise.all([
    prisma.payment.aggregate({ where: { status: 'paid', paidAt: { gte: yearStart, lte: yearEnd } }, _sum: { amount: true } }),
    prisma.expense.aggregate({ where: { paidAt: { gte: yearStart, lte: yearEnd } }, _sum: { amount: true } }),
    prisma.expense.findMany({ orderBy: { paidAt: 'desc' }, take: 10 }),
  ])

  return NextResponse.json({
    year,
    monthlyRevenue,
    monthlyExpenses,
    totalRevenue: Number(totalRevenue._sum.amount || 0),
    totalExpense: Number(totalExpense._sum.amount || 0),
    recentExpenses,
  })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { type, title, amount, paidAt, note } = body
  if (!type || !title || !amount) return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 })
  const parsedAmount = parseFloat(amount)
  if (isNaN(parsedAmount) || parsedAmount <= 0) return NextResponse.json({ error: 'Số tiền không hợp lệ' }, { status: 400 })

  try {
    const expense = await prisma.expense.create({
      data: { type, title, amount: parsedAmount, paidAt: paidAt ? new Date(paidAt) : new Date(), note: note || null },
    })
    return NextResponse.json(expense, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Lỗi lưu chi phí' }, { status: 500 })
  }
}
