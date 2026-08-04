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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const articleId = parseInt(id)

    if (isNaN(articleId)) {
      return NextResponse.json({ error: 'Invalid article ID' }, { status: 400 })
    }

    const body = await req.json()
    const { title, slug, content, excerpt, metaTitle, metaDescription, categoryId, status, sortOrder, tags } = body

    const article = await prisma.helpArticle.update({
      where: { id: articleId },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(content && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDescription !== undefined && { metaDescription }),
        ...(categoryId && { categoryId: parseInt(categoryId) }),
        ...(status && { status }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(tags && {
          tags: {
            set: tags.map((id: number) => ({ id })),
          },
        }),
      },
      include: {
        category: true,
        author: true,
        tags: true,
      },
    })

    return NextResponse.json(article)
  } catch (err: any) {
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err.code === 'P2025') {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    }
    console.error('Error updating help article:', err)
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const articleId = parseInt(id)

    if (isNaN(articleId)) {
      return NextResponse.json({ error: 'Invalid article ID' }, { status: 400 })
    }

    await prisma.helpArticle.delete({
      where: { id: articleId },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err.code === 'P2025') {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }
    console.error('Error deleting help article:', err)
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 })
  }
}
