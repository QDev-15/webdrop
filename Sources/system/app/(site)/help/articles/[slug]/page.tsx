import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Breadcrumb } from '@/components/help/Breadcrumb';
import { MarkdownRenderer } from '@/components/help/MarkdownRenderer';
import { ArticleTOC } from '@/components/help/ArticleTOC';
import { RelatedArticles } from '@/components/help/RelatedArticles';
import ArticleDetailClient from './ArticleDetailClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.helpArticle.findUnique({
    where: { slug },
  });

  if (!article) return {};

  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt || '',
    robots: { index: true, follow: true },
  };
}

export async function generateStaticParams() {
  const articles = await prisma.helpArticle.findMany({
    where: { status: 'published' },
    select: { slug: true },
  });
  return articles.map((art) => ({ slug: art.slug }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await prisma.helpArticle.findUnique({
    where: { slug, status: 'published' },
    include: {
      category: { select: { name: true, slug: true } },
      author: { select: { name: true } },
    },
  });

  if (!article) notFound();

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

  return (
    <main className="wd-help-article-page">
      <div className="help-art-header">
        <div className="wd-container">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Trung tâm Hỗ trợ', href: '/help' },
              { label: article.category.name, href: '/help/category/' + article.category.slug },
              { label: article.title },
            ]}
          />

          <div className="hah-meta">
            <span className="hah-category">{article.category.name}</span>
            <time className="hah-date">
              {new Date(article.createdAt).toLocaleDateString('vi-VN')}
            </time>
          </div>

          <h1 className="hah-title">{article.title}</h1>
        </div>
      </div>

      <div className="wd-container">
        <div className="help-art-layout">
          <article className="help-art-content">
            {article.content && (
              <>
                <ArticleTOC content={article.content} />
                <MarkdownRenderer content={article.content} />
              </>
            )}
          </article>

          <aside className="help-art-sidebar">
            <ArticleDetailClient
              articleSlug={article.slug}
              articleTitle={article.title}
            />
          </aside>
        </div>

        {relatedArticles.length > 0 && (
          <div className="help-art-related">
            <RelatedArticles articles={relatedArticles} />
          </div>
        )}
      </div>
    </main>
  );
}