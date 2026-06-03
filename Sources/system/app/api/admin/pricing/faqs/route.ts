import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const faqs = await prisma.pricingFaq.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json({ faqs })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { question, answer } = await req.json()
  if (!question || !answer) return NextResponse.json({ error: 'question và answer là bắt buộc' }, { status: 400 })

  const maxOrder = await prisma.pricingFaq.aggregate({ _max: { sortOrder: true } })
  const faq = await prisma.pricingFaq.create({
    data: { question, answer, sortOrder: (maxOrder._max.sortOrder ?? -1) + 1 },
  })
  return NextResponse.json({ faq }, { status: 201 })
}
