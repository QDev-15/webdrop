import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categorySlug = searchParams.get('category');
    const q = searchParams.get('q');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const where: any = { status: 'published' };

    if (categorySlug) {
      const category = await prisma.helpCategory.findUnique({
        where: { slug: categorySlug },
      });
      if (category) {
        where.categoryId = category.id;
      } else {
        return NextResponse.json(
          { articles: [], total: 0, page, limit }
        );
      }
    }

    if (q) {
      where.OR = [
        { title: { contains: q } },
        { content: { contains: q } },
        { excerpt: { contains: q } },
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.helpArticle.findMany({
        where,
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          createdAt: true,
          category: { select: { name: true } },
        },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.helpArticle.count({ where }),
    ]);

    return NextResponse.json({
      articles,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Không thể tải bài viết' },
      { status: 500 }
    );
  }
}
