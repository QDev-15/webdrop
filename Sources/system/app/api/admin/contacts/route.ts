import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = 20

  const where = status && status !== 'all' ? { status: status as 'new' | 'read' | 'replied' } : {}

  const [contacts, total, newCount] = await Promise.all([
    prisma.contact.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.contact.count({ where }),
    prisma.contact.count({ where: { status: 'new' } }),
  ])

  return NextResponse.json({ contacts, total, page, pages: Math.ceil(total / limit), newCount })
}
