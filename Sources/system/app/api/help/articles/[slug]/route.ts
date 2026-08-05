import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const article = await prisma.helpArticle.findUnique({
      where: { slug, status: 'published' },
      include: {
        category: { select: { name: true, slug: true } },
        author: { select: { name: true } },
        tags: { select: { name: true, slug: true } },
      },
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Bài viết không tồn tại' },
        { status: 404 }
      );
    }

    const relatedArticles = await prisma.helpArticle.findMany({
      where: {
        categoryId: article.categoryId,
        slug: { not: article.slug },
        status: 'published',
      },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        createdAt: true,
        category: { select: { name: true } },
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      take: 3,
    });

    return NextResponse.json({
      article,
      relatedArticles,
    });
  } catch (error) {
    console.error('Error fetching help article:', error);
    return NextResponse.json(
      { error: 'Không thể tải bài viết' },
      { status: 500 }
    );
  }
}