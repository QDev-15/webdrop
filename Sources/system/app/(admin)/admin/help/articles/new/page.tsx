import AdminLayout from '@/components/admin/AdminLayout'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function NewHelpArticlePage() {
  const categories = await prisma.helpCategory.findMany({ orderBy: { name: 'asc' } })

  async function handleSubmit(formData: FormData) {
    'use server'

    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const content = formData.get('content') as string
    const excerpt = formData.get('excerpt') as string
    const categoryId = formData.get('categoryId') as string
    const metaTitle = formData.get('metaTitle') as string
    const metaDesc = formData.get('metaDesc') as string

    const article = await prisma.helpArticle.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        categoryId: parseInt(categoryId),
        metaTitle: metaTitle || null,
        metaDescription: metaDesc || null,
      },
    })
    redirect(`/admin/help/articles/${article.id}`)
  }

  return (
    <AdminLayout title="Tạo bài viết hỗ trợ">
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--text)' }}>Tiêu đề *</label>
            <input
              type="text"
              name="title"
              placeholder="VD: Cách tải template"
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                fontSize: 13,
                fontFamily: 'var(--sans)',
              }}
            />
          </div>

          {/* Slug */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--text)' }}>Slug *</label>
            <input
              type="text"
              name="slug"
              placeholder="cach-tai-template"
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                fontSize: 13,
                fontFamily: 'var(--sans)',
              }}
            />
          </div>

          {/* Excerpt */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--text)' }}>Tóm tắt</label>
            <textarea
              name="excerpt"
              placeholder="Tóm tắt ngắn về bài viết"
              rows={2}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                fontSize: 13,
                fontFamily: 'var(--sans)',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Category */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--text)' }}>Danh mục *</label>
            <select
              name="categoryId"
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                fontSize: 13,
                fontFamily: 'var(--sans)',
              }}
            >
              <option value="">Chọn danh mục</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--text)' }}>Nội dung *</label>
            <textarea
              name="content"
              placeholder="Nội dung bài viết..."
              required
              rows={10}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                fontSize: 13,
                fontFamily: 'monospace',
                resize: 'vertical',
              }}
            />
          </div>

          {/* SEO */}
          <div style={{ paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: 'var(--text)' }}>SEO</h3>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--text)' }}>Meta Title</label>
              <input
                type="text"
                name="metaTitle"
                placeholder="Tiêu đề SEO (tuỳ chọn)"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  fontSize: 13,
                  fontFamily: 'var(--sans)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--text)' }}>Meta Description</label>
              <textarea
                name="metaDesc"
                placeholder="Mô tả SEO (tuỳ chọn)"
                rows={2}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  fontSize: 13,
                  fontFamily: 'var(--sans)',
                  resize: 'vertical',
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, paddingTop: 16 }}>
            <button
              type="submit"
              style={{
                padding: '8px 20px',
                borderRadius: 8,
                background: 'var(--accent)',
                color: '#fff',
                border: 'none',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Tạo bài viết
            </button>
            <Link href="/admin/help"
              style={{
                padding: '8px 20px',
                borderRadius: 8,
                background: 'var(--bg)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Hủy
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
