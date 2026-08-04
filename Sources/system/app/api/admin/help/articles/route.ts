import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

async function requireAdmin() {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') {
    throw new Error('Unauthorized')
  }
  return session.id
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()

    const searchParams = req.nextUrl.searchParams
    const search = searchParams.get('q')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const skip = (page - 1) * limit

    const where: any = {}

    if (category) {
      where.categoryId = parseInt(category)
    }

    if (status) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [articles, total] = await Promise.all([
      prisma.helpArticle.findMany({
        where,
        include: {
          category: { select: { name: true } },
          author: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.helpArticle.count({ where }),
    ])

    return NextResponse.json({
      data: articles,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    })
  } catch (err: any) {
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching help articles:', err)
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await requireAdmin()
    const body = await req.json()

    const { title, slug, content, excerpt, metaTitle, metaDescription, categoryId, status, sortOrder, tags } = body

    if (!title || !slug || !content || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const article = await prisma.helpArticle.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        metaTitle,
        metaDescription,
        categoryId: parseInt(categoryId),
        status: status || 'draft',
        sortOrder: sortOrder || 0,
        createdBy: userId,
        tags: {
          connect: (tags || []).map((id: number) => ({ id })),
        },
      },
      include: {
        category: true,
        author: true,
        tags: true,
      },
    })

    return NextResponse.json(article, { status: 201 })
  } catch (err: any) {
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    }
    console.error('Error creating help article:', err)
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 })
  }
}
