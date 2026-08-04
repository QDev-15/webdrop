import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.helpCategory.findMany({
      where: { status: 'published' },
      include: { _count: { select: { articles: true } } },
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json(
      categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        articleCount: cat._count.articles,
      }))
    )
  } catch (err) {
    console.error('Error fetching help categories:', err)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
