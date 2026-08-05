import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get('q')?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const results = await prisma.helpArticle.findMany({
      where: {
        status: 'published',
        OR: [
          { title: { contains: q } },
          { content: { contains: q } },
          { excerpt: { contains: q } },
        ],
      },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        category: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      { error: 'Lỗi tìm kiếm', results: [] },
      { status: 500 }
    );
  }
}