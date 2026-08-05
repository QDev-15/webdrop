'use client';

import Link from 'next/link';
import { ArticleCard } from './ArticleCard';

interface RelatedArticlesData {
  slug: string;
  title: string;
  excerpt?: string | null;
  category: { name: string };
  createdAt: Date;
}

interface RelatedArticlesProps {
  articles: RelatedArticlesData[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="related-articles">
      <h3 className="ra-title">Bài viết liên quan</h3>
      <div className="ra-grid">
        {articles.map((article) => (
          <ArticleCard
            key={article.slug}
            slug={article.slug}
            title={article.title}
            excerpt={article.excerpt}
            categoryName={article.category.name}
            createdAt={article.createdAt}
          />
        ))}
      </div>
    </div>
  );
}
