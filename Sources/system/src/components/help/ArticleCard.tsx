'use client';

import Link from 'next/link';

interface ArticleCardProps {
  slug: string;
  title: string;
  excerpt?: string | null;
  categoryName: string;
  createdAt: Date;
}

export function ArticleCard({
  slug,
  title,
  excerpt,
  categoryName,
  createdAt,
}: ArticleCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Link href={`/help/articles/${slug}`}>
      <div className="help-article-card">
        <div className="hac-header">
          <h3 className="hac-title">{title}</h3>
          <span className="hac-category">{categoryName}</span>
        </div>

        {excerpt && (
          <p className="hac-excerpt">{excerpt.slice(0, 120)}...</p>
        )}

        <div className="hac-footer">
          <time className="hac-date">{formatDate(createdAt)}</time>
          <span className="hac-arrow">→</span>
        </div>
      </div>
    </Link>
  );
}
