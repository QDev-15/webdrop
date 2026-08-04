import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ArticleDetailClient from './ArticleDetailClient'

async function getArticleData(slug: string) {
  try {
    const article = await prisma.helpArticle.findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true } },
        tags: { select: { id: true, name: true, slug: true } },
      },
    })

    if (!article || article.status !== 'published') {
      return null
    }

    // Get related articles
    const related = await prisma.helpArticle.findMany({
      where: {
        categoryId: article.categoryId,
        slug: { not: slug },
        status: 'published',
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: { select: { name: true, slug: true } },
      },
      take: 3,
      orderBy: { sortOrder: 'asc' },
    })

    return { article, related }
  } catch (err) {
    console.error('Error fetching article:', err)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await getArticleData(slug)

  if (!data) return {}

  const { article } = data

  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt,
      type: 'article',
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await getArticleData(slug)

  if (!data) {
    notFound()
  }

  const { article, related } = data

  return (
    <div style={{ paddingTop: 62 }}>
      {/* Breadcrumb */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        padding: '12px 0',
        marginBottom: 40,
        fontSize: 13,
        color: 'var(--text-2)',
      }}>
        <div className="wd-container" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Link href="/help" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
            Hướng dẫn
          </Link>
          <span>/</span>
          <Link
            href={`/help?category=${article.category.slug}`}
            style={{ color: 'var(--accent)', textDecoration: 'none' }}
          >
            {article.category.name}
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--text)' }}>{article.title}</span>
        </div>
      </div>

      <div className="wd-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: 40,
          marginBottom: 80,
        }}>
          {/* Main Content */}
          <div>
            <div style={{ marginBottom: 24 }}>
              <span style={{
                display: 'inline-block',
                fontSize: 12,
                fontWeight: 600,
                background: 'var(--accent-light)',
                color: 'var(--accent)',
                padding: '6px 12px',
                borderRadius: 4,
                marginBottom: 16,
              }}>
                {article.category.name}
              </span>
              <h1 style={{
                fontSize: 'clamp(28px, 5vw, 42px)',
                fontWeight: 700,
                color: 'var(--text)',
                marginBottom: 12,
                lineHeight: 1.2,
              }}>
                {article.title}
              </h1>
              {article.excerpt && (
                <p style={{
                  fontSize: 16,
                  color: 'var(--text-2)',
                  lineHeight: 1.6,
                }}>
                  {article.excerpt}
                </p>
              )}
            </div>

            {/* Article Meta */}
            <div style={{
              display: 'flex',
              gap: 20,
              fontSize: 13,
              color: 'var(--text-3)',
              paddingBottom: 20,
              borderBottom: '1px solid var(--border-light)',
              marginBottom: 40,
            }}>
              {article.author && (
                <div>
                  Tác giả: <strong style={{ color: 'var(--text-2)' }}>{article.author.name}</strong>
                </div>
              )}
              <div>
                Cập nhật: <strong style={{ color: 'var(--text-2)' }}>
                  {new Date(article.updatedAt).toLocaleDateString('vi-VN')}
                </strong>
              </div>
            </div>

            {/* Content */}
            <ArticleDetailClient content={article.content} />

            {/* Tags */}
            {article.tags.length > 0 && (
              <div style={{ marginTop: 40, paddingTop: 40, borderTop: '1px solid var(--border-light)' }}>
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)' }}>Tags:</span>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {article.tags.map(tag => (
                    <Link
                      key={tag.id}
                      href={`/help?q=${tag.name}`}
                      style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        background: 'var(--warm)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 6,
                        fontSize: 12,
                        color: 'var(--text-2)',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        transition: 'all .2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'var(--accent-light)'
                        e.currentTarget.style.color = 'var(--accent)'
                        e.currentTarget.style.borderColor = 'var(--accent)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'var(--warm)'
                        e.currentTarget.style.color = 'var(--text-2)'
                        e.currentTarget.style.borderColor = 'var(--border-light)'
                      }}
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - TOC & Related */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'sticky',
              top: 90,
              display: 'flex',
              flexDirection: 'column',
              gap: 30,
            }}>
              {/* Related Articles */}
              {related.length > 0 && (
                <div>
                  <h3 style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--text)',
                    marginBottom: 16,
                  }}>
                    Bài liên quan
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {related.map(art => (
                      <Link
                        key={art.id}
                        href={`/help/articles/${art.slug}`}
                        style={{
                          padding: 12,
                          background: 'var(--surface)',
                          border: '1px solid var(--border)',
                          borderRadius: 8,
                          fontSize: 12,
                          color: 'var(--text-2)',
                          textDecoration: 'none',
                          cursor: 'pointer',
                          transition: 'all .2s',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'var(--accent-light)'
                          e.currentTarget.style.color = 'var(--accent)'
                          e.currentTarget.style.borderColor = 'var(--accent)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'var(--surface)'
                          e.currentTarget.style.color = 'var(--text-2)'
                          e.currentTarget.style.borderColor = 'var(--border)'
                        }}
                      >
                        {art.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Support */}
              <div style={{
                padding: 16,
                background: 'var(--warm)',
                borderRadius: 8,
                border: '1px solid var(--border-light)',
              }}>
                <h3 style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text)',
                  marginBottom: 8,
                }}>
                  Vẫn cần giúp?
                </h3>
                <p style={{
                  fontSize: 12,
                  color: 'var(--text-2)',
                  lineHeight: 1.6,
                  marginBottom: 12,
                }}>
                  Nếu bạn không tìm thấy câu trả lời, vui lòng liên hệ với chúng tôi.
                </p>
                <Link
                  href="/help#contact"
                  style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    background: 'var(--accent)',
                    color: '#fff',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'background .2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-h)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
                >
                  Liên hệ hỗ trợ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
