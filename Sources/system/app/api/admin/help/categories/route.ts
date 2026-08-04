import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

async function requireAdmin() {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') {
    throw new Error('Unauthorized')
  }
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()

    const categories = await prisma.helpCategory.findMany({
      include: { _count: { select: { articles: true } } },
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json(
      categories.map(cat => ({
        ...cat,
        articleCount: cat._count.articles,
      }))
    )
  } catch (err: any) {
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching help categories:', err)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()

    const { name, slug, description, icon, sortOrder, status } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const category = await prisma.helpCategory.create({
      data: {
        name,
        slug,
        description,
        icon,
        sortOrder: sortOrder || 0,
        status: status || 'published',
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (err: any) {
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    }
    console.error('Error creating help category:', err)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
