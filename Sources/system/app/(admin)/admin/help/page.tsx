export const dynamic = 'force-dynamic'

import AdminLayout from '@/components/admin/AdminLayout'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function HelpPage() {
  let categories: any[] = []
  let articles: any[] = []

  try {
    [categories, articles] = await Promise.all([
      prisma.helpCategory.findMany({ orderBy: { name: 'asc' } }),
      prisma.helpArticle.findMany({
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      }),
    ])
  } catch (e) {
    console.error('DB error:', e)
  }

  return (
    <AdminLayout title="Hướng dẫn & Hỗ trợ (Help Center)">
      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ padding: 12, borderRadius: 8, background: 'var(--surface)', border: '1px solid var(--border)', flex: 1, minWidth: 150 }}>
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 4 }}>Tổng danh mục</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--accent)' }}>{categories.length}</div>
        </div>
        <div style={{ padding: 12, borderRadius: 8, background: 'var(--surface)', border: '1px solid var(--border)', flex: 1, minWidth: 150 }}>
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 4 }}>Tổng bài viết</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--accent)' }}>{articles.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: 24 }}>
        {/* Categories Section */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: 0 }}>Danh mục</h2>
            <Link href="/admin/help/categories/new"
              style={{
                fontSize: 13,
                padding: '8px 16px',
                borderRadius: 8,
                background: 'var(--accent)',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 500,
              }}>
              + Danh mục mới
            </Link>
          </div>

          {categories.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-3)' }}>
              Chưa có danh mục nào. <Link href="/admin/help/categories/new" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Tạo danh mục đầu tiên</Link>
            </div>
          ) : (
            <div style={{ borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: 12, textAlign: 'left', fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>Tên danh mục</th>
                    <th style={{ padding: 12, textAlign: 'left', fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>Slug</th>
                    <th style={{ padding: 12, textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: 12, fontSize: 13, color: 'var(--text)' }}>{cat.name}</td>
                      <td style={{ padding: 12, fontSize: 13, color: 'var(--text-2)' }}>{cat.slug}</td>
                      <td style={{ padding: 12, textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                          <Link href={`/admin/help/categories/${cat.id}`}
                            style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>Sửa</Link>
                          <form method="POST" action={`/api/admin/help/categories/${cat.id}/delete`} style={{ display: 'inline' }}>
                            <button type="submit" onClick={e => { if (!confirm('Xóa danh mục này?')) e.preventDefault() }}
                              style={{ fontSize: 12, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                              Xóa
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Articles Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: 0 }}>Bài viết</h2>
            <Link href="/admin/help/articles/new"
              style={{
                fontSize: 13,
                padding: '8px 16px',
                borderRadius: 8,
                background: 'var(--accent)',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 500,
              }}>
              + Bài viết mới
            </Link>
          </div>

          {articles.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-3)' }}>
              Chưa có bài viết nào. <Link href="/admin/help/articles/new" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Tạo bài viết đầu tiên</Link>
            </div>
          ) : (
            <div style={{ borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: 12, textAlign: 'left', fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>Tiêu đề</th>
                    <th style={{ padding: 12, textAlign: 'left', fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>Danh mục</th>
                    <th style={{ padding: 12, textAlign: 'left', fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>Ngày tạo</th>
                    <th style={{ padding: 12, textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map(article => (
                    <tr key={article.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: 12, fontSize: 13, color: 'var(--text)' }}>
                        <Link href={`/admin/help/articles/${article.id}`} style={{ textDecoration: 'none', color: 'var(--accent)' }}>
                          {article.title}
                        </Link>
                      </td>
                      <td style={{ padding: 12, fontSize: 13, color: 'var(--text-2)' }}>
                        {article.category?.name || '—'}
                      </td>
                      <td style={{ padding: 12, fontSize: 13, color: 'var(--text-2)' }}>
                        {new Date(article.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td style={{ padding: 12, textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                          <Link href={`/admin/help/articles/${article.id}`}
                            style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>Sửa</Link>
                          <form method="POST" action={`/api/admin/help/articles/${article.id}/delete`} style={{ display: 'inline' }}>
                            <button type="submit" onClick={e => { if (!confirm('Xóa bài viết này?')) e.preventDefault() }}
                              style={{ fontSize: 12, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                              Xóa
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
