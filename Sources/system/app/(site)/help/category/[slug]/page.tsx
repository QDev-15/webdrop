import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Breadcrumb } from '@/components/help/Breadcrumb';
import CategoryPageClient from './CategoryPageClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.helpCategory.findUnique({
    where: { slug },
  });

  if (!category) return {};

  return {
    title: category.name + ' | Trung tâm Hỗ trợ webdrop',
    description: category.description || 'Tất cả bài viết về ' + category.name,
  };
}

export async function generateStaticParams() {
  const categories = await prisma.helpCategory.findMany({
    where: { status: 'published' },
    select: { slug: true },
  });
  return categories.map((cat) => ({ slug: cat.slug }));
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;

  const category = await prisma.helpCategory.findUnique({
    where: { slug, status: 'published' },
    include: {
      articles: {
        where: { status: 'published' },
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          sortOrder: true,
          createdAt: true,
        },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      },
    },
  });

  if (!category) notFound();

  const page = Math.max(1, parseInt(pageParam || '1'));
  const limit = 12;
  const start = (page - 1) * limit;
  const paginatedArticles = category.articles.slice(start, start + limit);
  const totalPages = Math.ceil(category.articles.length / limit);

  return (
    <main className="wd-help-category-page">
      <div className="help-cat-hero">
        <div className="wd-container">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Trung tâm Hỗ trợ', href: '/help' },
              { label: category.name },
            ]}
          />

          <div className="hch-header">
            {category.icon && <span className="hch-icon">{category.icon}</span>}
            <div>
              <h1 className="hch-title">{category.name}</h1>
              {category.description && (
                <p className="hch-desc">{category.description}</p>
              )}
            </div>
          </div>

          <div className="hch-stats">
            <span>{category.articles.length} bài viết</span>
          </div>
        </div>
      </div>

      <div className="wd-container">
        <CategoryPageClient
          articles={paginatedArticles}
          categoryName={category.name}
          currentPage={page}
          totalPages={totalPages}
          categorySlug={category.slug}
        />
      </div>
    </main>
  );
}