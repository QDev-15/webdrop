import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('q')
  const status = searchParams.get('status')
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = 20

  const where: Record<string, unknown> = {}
  if (status && status !== 'all') where.status = status
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { slug: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: { category: { select: { name: true } }, author: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count({ where }),
  ])

  return NextResponse.json({ posts, total, page, pages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, slug, content, excerpt, thumbnail, categoryId, status, featured, metaTitle, metaDescription } = body

  if (!title || !slug) return NextResponse.json({ error: 'Thiếu tiêu đề hoặc slug' }, { status: 400 })

  const parsedCategoryId = categoryId ? parseInt(categoryId) : null
  if (categoryId && isNaN(parsedCategoryId!)) {
    return NextResponse.json({ error: 'categoryId không hợp lệ' }, { status: 400 })
  }

  try {
    const post = await prisma.post.create({
      data: {
        title, slug, content: content || null, excerpt: excerpt || null,
        thumbnail: thumbnail || null, categoryId: parsedCategoryId,
        status: status ?? 'draft', featured: !!featured,
        metaTitle: metaTitle || null, metaDescription: metaDescription || null,
        createdBy: session.id,
      },
    })
    return NextResponse.json(post, { status: 201 })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2002') return NextResponse.json({ error: 'Slug đã tồn tại' }, { status: 409 })
    return NextResponse.json({ error: 'Lỗi tạo bài viết' }, { status: 500 })
  }
}
