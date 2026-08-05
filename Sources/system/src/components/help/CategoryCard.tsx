'use client';

import Link from 'next/link';

interface CategoryCardProps {
  slug: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  articleCount: number;
}

export function CategoryCard({
  slug,
  name,
  description,
  icon,
  articleCount,
}: CategoryCardProps) {
  return (
    <Link href={`/help/category/${slug}`}>
      <div className="help-category-card">
        {icon && <div className="hcc-icon">{icon}</div>}

        <div className="hcc-content">
          <h3 className="hcc-name">{name}</h3>
          {description && (
            <p className="hcc-desc">{description}</p>
          )}
          <div className="hcc-footer">
            <span className="hcc-count">{articleCount} bài viết</span>
            <span className="hcc-arrow">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
