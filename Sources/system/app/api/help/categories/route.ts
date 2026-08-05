import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.helpCategory.findMany({
      where: { status: 'published' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        icon: true,
        sortOrder: true,
        _count: {
          select: { articles: { where: { status: 'published' } } },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    const formatted = categories.map((cat) => ({
      ...cat,
      articleCount: cat._count.articles,
      _count: undefined,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching help categories:', error);
    return NextResponse.json(
      { error: 'Không thể tải danh mục' },
      { status: 500 }
    );
  }
}
