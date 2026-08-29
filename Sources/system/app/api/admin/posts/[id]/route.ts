import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const numId = parseInt(id)
  if (isNaN(numId)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

  try {
    const post = await prisma.post.findUnique({
      where: { id: numId },
      include: { category: { select: { id: true, name: true } } },
    })
    if (!post) return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
    return NextResponse.json(post)
  } catch {
    return NextResponse.json({ error: 'Lỗi truy vấn' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { title, slug, content, excerpt, thumbnail, categoryId, status, featured, metaTitle, metaDescription } = body

  const parsedCategoryId = categoryId ? parseInt(categoryId) : null
  if (categoryId && isNaN(parsedCategoryId!)) {
    return NextResponse.json({ error: 'categoryId không hợp lệ' }, { status: 400 })
  }

  if (status && !['draft', 'published'].includes(status)) {
    return NextResponse.json({ error: 'Trạng thái không hợp lệ' }, { status: 400 })
  }

  try {
    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        title, slug, content: content || null, excerpt: excerpt || null,
        thumbnail: thumbnail || null, categoryId: parsedCategoryId,
        ...(status ? { status } : {}), featured: !!featured,
        metaTitle: metaTitle || null, metaDescription: metaDescription || null,
      },
    })
    revalidatePath('/blog')
    revalidatePath(`/blog/${post.slug}`)
    return NextResponse.json(post)
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2025') return NextResponse.json({ error: 'Không tìm thấy bài viết' }, { status: 404 })
    if (err.code === 'P2002') return NextResponse.json({ error: 'Slug đã tồn tại' }, { status: 409 })
    return NextResponse.json({ error: 'Lỗi cập nhật' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  try {
    await prisma.post.delete({ where: { id: parseInt(id) } })
    revalidatePath('/blog')
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2025') return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
    return NextResponse.json({ error: 'Lỗi xoá' }, { status: 500 })
  }
}
