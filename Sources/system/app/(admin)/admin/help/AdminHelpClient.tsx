'use client'

import Link from 'next/link'

interface HelpCategory {
  id: number
  name: string
  icon: string | null
}

interface HelpArticle {
  id: number
  title: string
  slug: string
  createdAt: Date
  category: HelpCategory | null
}

interface AdminHelpClientProps {
  categories: HelpCategory[]
  articles: HelpArticle[]
  totalArticles: number
  totalCategories: number
}

export default function AdminHelpClient({
  categories,
  articles,
  totalArticles,
  totalCategories,
}: AdminHelpClientProps) {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 8 }}>Tổng danh mục</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent)' }}>{totalCategories}</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 8 }}>Tổng bài viết</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent)' }}>{totalArticles}</div>
        </div>
      </div>

      {/* Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 32 }}>
        {/* Categories */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: 0 }}>Danh mục</h3>
            <Link href="/admin/help/categories/new"
              style={{
                padding: '6px 12px',
                background: 'var(--accent)',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              + Thêm
            </Link>
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: 12, fontSize: 13 }}>
                      <Link href={`/admin/help/categories/${cat.id}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                        {cat.icon} {cat.name}
                      </Link>
                    </td>
                    <td style={{ padding: 12, fontSize: 12, color: 'var(--text-3)', textAlign: 'right' }}>
                      {cat.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Articles */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: 0 }}>Bài viết gần đây</h3>
            <Link href="/admin/help/articles/new"
              style={{
                padding: '6px 12px',
                background: 'var(--accent)',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              + Thêm
            </Link>
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {articles.map(art => (
                  <tr key={art.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                        <Link href={`/admin/help/articles/${art.id}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                          {art.title}
                        </Link>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
                        {art.category?.name} • {new Date(art.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* All Articles Link */}
      <Link href="/admin/help/articles"
        style={{
          display: 'inline-block',
          padding: '10px 16px',
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          textDecoration: 'none',
          color: 'var(--text)',
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        Xem tất cả bài viết →
      </Link>
    </div>
  )
}
