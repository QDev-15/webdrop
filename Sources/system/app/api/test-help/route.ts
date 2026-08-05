import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [catCount, artCount, pubCount] = await Promise.all([
      prisma.helpCategory.count(),
      prisma.helpArticle.count(),
      prisma.helpArticle.count({ where: { status: 'published' } }),
    ]);

    const sample = await prisma.helpArticle.findFirst({
      where: { status: 'published' },
      include: { category: true },
    });

    return NextResponse.json({
      categories: catCount,
      articles_total: artCount,
      articles_published: pubCount,
      sample_article: sample,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
