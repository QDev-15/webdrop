import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('q')

  const where = search ? {
    OR: [
      { name: { contains: search, mode: 'insensitive' as const } },
      { slug: { contains: search, mode: 'insensitive' as const } },
    ],
  } : {}

  const templates = await prisma.template.findMany({
    where,
    include: { industry: { select: { name: true, slug: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(templates)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { name, slug, description, thumbnail, demoUrl, deployUrl, price, websitePrice, customPrice, category, industryId, status, hasWebsite } = body

  if (!name || !slug || !price || !category) {
    return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 })
  }

  const template = await prisma.template.create({
    data: {
      name, slug, description, thumbnail, demoUrl, deployUrl, price, category,
      websitePrice: websitePrice ?? null,
      customPrice:  customPrice  ?? null,
      industryId: industryId || null,
      status: status ?? 'draft',
      hasWebsite: hasWebsite ?? false,
    },
  })

  revalidatePath('/')
  return NextResponse.json(template, { status: 201 })
}
