"use client";

import Link from "next/link";
import { ArticleCard } from "@/components/help/ArticleCard";

interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt?: string | null;
  createdAt: Date;
}

interface CategoryPageClientProps {
  articles: Article[];
  categoryName: string;
  currentPage: number;
  totalPages: number;
  categorySlug: string;
}

export default function CategoryPageClient({
  articles,
  categoryName,
  currentPage,
  totalPages,
  categorySlug,
}: CategoryPageClientProps) {
  return (
    <div className="cat-page-content sec-pad">
      {articles.length > 0 ? (
        <>
          <div className="cat-articles-grid">
            {articles.map((article) => (
              <ArticleCard
                key={article.slug}
                slug={article.slug}
                title={article.title}
                excerpt={article.excerpt}
                categoryName={categoryName}
                createdAt={article.createdAt}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="pagination" aria-label="Phân trang">
              <ul className="pag-list">
                {currentPage > 1 && (
                  <li>
                    <Link
                      href={"/help/category/" + categorySlug + "?page=" + (currentPage - 1)}
                      className="pag-btn pag-prev"
                    >
                      ← Trước
                    </Link>
                  </li>
                )}

                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <li key={pageNum}>
                      {pageNum === currentPage ? (
                        <span className="pag-current">{pageNum}</span>
                      ) : (
                        <Link
                          href={"/help/category/" + categorySlug + "?page=" + pageNum}
                          className="pag-link"
                        >
                          {pageNum}
                        </Link>
                      )}
                    </li>
                  );
                })}

                {currentPage < totalPages && (
                  <li>
                    <Link
                      href={"/help/category/" + categorySlug + "?page=" + (currentPage + 1)}
                      className="pag-btn pag-next"
                    >
                      Sau →
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          )}
        </>
      ) : (
        <div className="cat-empty">
          <p>Chưa có bài viết nào trong danh mục này.</p>
        </div>
      )}
    </div>
  );
}