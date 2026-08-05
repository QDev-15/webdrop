import { Metadata } from 'next';
import { prisma } from '@/src/lib/prisma';
import { Breadcrumb } from '@/src/components/help/Breadcrumb';
import { SearchBar } from '@/src/components/help/SearchBar';
import { CategoryCard } from '@/src/components/help/CategoryCard';
import HelpPageClient from './HelpPageClient';

export const metadata: Metadata = {
  title: 'Trung tâm Hỗ trợ | webdrop',
  description: 'Tìm kiếm giải pháp, hướng dẫn sử dụng, và câu hỏi thường gặp',
  robots: { index: true, follow: true },
  canonical: 'https://webdrop.store/help',
};

export default async function HelpPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const categories = await prisma.helpCategory.findMany({
    where: { status: 'published' },
    include: {
      _count: {
        select: { articles: { where: { status: 'published' } } },
      },
    },
    orderBy: { sortOrder: 'asc' },
  });

  const searchQuery = searchParams.q || '';

  let featuredArticles = null;
  if (!searchQuery) {
    featuredArticles = await prisma.helpArticle.findMany({
      where: { status: 'published' },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        createdAt: true,
        category: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 4,
    });
  }

  return (
    <main className="wd-help-page">
      <div className="help-hero">
        <div className="wd-container">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Trung tâm Hỗ trợ' },
            ]}
          />

          <h1 className="help-hero-title">Trung tâm Hỗ trợ webdrop</h1>
          <p className="help-hero-sub">
            Tìm tất cả câu trả lời, hướng dẫn, và giải pháp cho các câu hỏi của bạn
          </p>

          <div className="help-hero-search">
            <SearchBar />
          </div>
        </div>
      </div>

      <div className="wd-container">
        <HelpPageClient
          categories={categories}
          featuredArticles={featuredArticles}
          searchQuery={searchQuery}
        />
      </div>
    </main>
  );
}
