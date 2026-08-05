'use client';

import { useEffect, useState } from 'react';
import { CategoryCard } from '@/src/components/help/CategoryCard';
import { ArticleCard } from '@/src/components/help/ArticleCard';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  _count: { articles: number };
}

interface Article {
  slug: string;
  title: string;
  excerpt?: string | null;
  createdAt: Date;
  category: { name: string };
}

interface HelpPageClientProps {
  categories: Category[];
  featuredArticles: Article[] | null;
  searchQuery: string;
}

export default function HelpPageClient({
  categories,
  featuredArticles,
  searchQuery,
}: HelpPageClientProps) {
  const [searchResults, setSearchResults] = useState<Article[] | null>(null);
  const [loading, setLoading] = useState(!!searchQuery);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults(null);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/help/articles?q=${encodeURIComponent(searchQuery)}`
        );
        const data = await response.json();
        setSearchResults(data.articles || []);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="help-page-content">
      {searchQuery ? (
        <div className="help-search-results">
          <h2 className="hsr-title">
            Kết quả tìm kiếm cho "{searchQuery}"
          </h2>
          {loading ? (
            <div className="hsr-loading">Đang tìm kiếm...</div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className="hsr-grid">
              {searchResults.map((article) => (
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
          ) : (
            <div className="hsr-empty">
              <p>Không tìm thấy bài viết nào</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <section className="help-categories sec-pad">
            <div className="sec-header">
              <h2 className="sec-title">
                Khám phá <em>các chuyên đề</em>
              </h2>
              <p className="sec-sub">
                Tìm kiếm theo từng chuyên đề để dễ dàng định vị thông tin bạn cần
              </p>
            </div>

            <div className="help-cat-grid">
              {categories.map((category) => (
                <CategoryCard
                  key={category.slug}
                  slug={category.slug}
                  name={category.name}
                  description={category.description}
                  icon={category.icon}
                  articleCount={category._count.articles}
                />
              ))}
            </div>
          </section>

          {featuredArticles && featuredArticles.length > 0 && (
            <section className="help-featured sec-pad">
              <div className="sec-header">
                <h2 className="sec-title">
                  Bài viết <em>mới nhất</em>
                </h2>
              </div>

              <div className="help-featured-grid">
                {featuredArticles.map((article) => (
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
            </section>
          )}
        </>
      )}
    </div>
  );
}
