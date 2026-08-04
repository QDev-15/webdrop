import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import HelpPageClient from './HelpPageClient'
import ArticleCard from './ArticleCard'

async function getHelpData() {
  try {
    const [categories, featuredArticles] = await Promise.all([
      prisma.helpCategory.findMany({
        where: { status: 'published' },
        include: { _count: { select: { articles: true } } },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.helpArticle.findMany({
        where: { status: 'published' },
        include: {
          category: { select: { slug: true, name: true } },
        },
        orderBy: { sortOrder: 'asc' },
        take: 6,
      }),
    ])

    return {
      categories: categories.map(cat => ({
        ...cat,
        articleCount: cat._count.articles,
      })),
      featuredArticles,
    }
  } catch (err) {
    console.error('Error fetching help data:', err)
    return { categories: [], featuredArticles: [] }
  }
}

export default async function HelpPage() {
  const { categories, featuredArticles } = await getHelpData()

  return (
    <div style={{ paddingTop: 62 }}>
      {/* Hero Section */}
      <div style={{
        background: 'var(--accent-light)',
        borderBottom: '1px solid var(--border)',
        padding: 'clamp(40px, 8vw, 80px) 0',
        marginBottom: 'clamp(40px, 8vw, 60px)',
      }}>
        <div className="wd-container">
          <h1 className="page-title">Hướng dẫn & Hỗ trợ</h1>
          <p className="page-sub" style={{ color: 'var(--text-2)', maxWidth: 600 }}>
            Tìm kiếm câu trả lời, hướng dẫn chi tiết, và giải pháp cho mọi vấn đề liên quan đến webdrop.store
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="wd-container" style={{ marginBottom: 'clamp(60px, 10vw, 100px)' }}>
        {/* Search & Filter */}
        <HelpPageClient categories={categories} />

        {/* Featured Articles Grid */}
        {featuredArticles.length > 0 && (
          <section style={{ marginTop: 'clamp(60px, 10vw, 80px)' }}>
            <div style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>
                Bài viết nổi bật
              </h2>
              <p style={{ color: 'var(--text-2)', fontSize: 14 }}>
                Những hướng dẫn phổ biến nhất được xem gần đây
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 24,
            }}>
              {featuredArticles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
