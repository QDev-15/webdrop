export const dynamic = 'force-dynamic'

import AdminLayout from '@/components/admin/AdminLayout'
import { DeleteCategoryForm, DeleteArticleForm } from './DeleteCategoryForm'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

const PER_PAGE = 10

export default async function HelpPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page || '1'))
  const skip = (page - 1) * PER_PAGE

  let categories: any[] = []
  let articles: any[] = []
  let totalArticles = 0

  try {
    [categories, articles, totalArticles] = await Promise.all([
      prisma.helpCategory.findMany({ orderBy: { name: 'asc' } }),
      prisma.helpArticle.findMany({
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: PER_PAGE,
      }),
      prisma.helpArticle.count(),
    ])
  } catch (e) {
    console.error('DB error:', e)
  }

  const totalPages = Math.ceil(totalArticles / PER_PAGE)

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
          <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--accent)' }}>{totalArticles}</div>
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
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
                          <Link href={`/admin/help/categories/${cat.id}`}
                            style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none', marginTop: 1 }}>Sửa</Link>
                          <DeleteCategoryForm catId={cat.id} />
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
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
                          <Link href={`/admin/help/articles/${article.id}`}
                            style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none', marginTop: 1 }}>Sửa</Link>
                          <DeleteArticleForm artId={article.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center', marginTop: 20, padding: '16px 0' }}>
              {page > 1 && (
                <Link href={`/admin/help?page=${page - 1}`}
                  style={{
                    padding: '6px 12px',
                    fontSize: 12,
                    borderRadius: 6,
                    border: '1px solid var(--border)',
                    textDecoration: 'none',
                    color: 'var(--accent)',
                  }}>
                  ← Trước
                </Link>
              )}

              <div style={{ display: 'flex', gap: 4 }}>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = page > 3 ? page - 2 + i : i + 1
                  if (pageNum > totalPages) return null
                  return (
                    <Link key={pageNum}
                      href={`/admin/help?page=${pageNum}`}
                      style={{
                        padding: '6px 10px',
                        fontSize: 12,
                        borderRadius: 6,
                        border: pageNum === page ? '1px solid var(--accent)' : '1px solid var(--border)',
                        backgroundColor: pageNum === page ? 'var(--accent-light)' : 'transparent',
                        color: pageNum === page ? 'var(--accent)' : 'var(--text-2)',
                        textDecoration: 'none',
                        fontWeight: pageNum === page ? 600 : 400,
                      }}>
                      {pageNum}
                    </Link>
                  )
                })}
              </div>

              {page < totalPages && (
                <Link href={`/admin/help?page=${page + 1}`}
                  style={{
                    padding: '6px 12px',
                    fontSize: 12,
                    borderRadius: 6,
                    border: '1px solid var(--border)',
                    textDecoration: 'none',
                    color: 'var(--accent)',
                  }}>
                  Sau →
                </Link>
              )}

              <div style={{ marginLeft: 16, fontSize: 12, color: 'var(--text-3)' }}>
                Trang {page}/{totalPages} • {totalArticles} bài
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
