import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const article = await prisma.helpArticle.findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true } },
        tags: { select: { id: true, name: true, slug: true } },
      },
    })

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Get related articles (same category, exclude current)
    const related = await prisma.helpArticle.findMany({
      where: {
        categoryId: article.categoryId,
        slug: { not: slug },
        status: 'published',
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
      },
      take: 4,
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json({
      ...article,
      related,
    })
  } catch (err) {
    console.error('Error fetching help article:', err)
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 })
  }
}
