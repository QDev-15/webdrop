import AdminLayout from '@/components/admin/AdminLayout'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'

export default async function EditHelpArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const articleId = parseInt(id)

  if (isNaN(articleId)) notFound()

  const article = await prisma.helpArticle.findUnique({
    where: { id: articleId },
    include: { category: true },
  })

  if (!article) notFound()

  const categories = await prisma.helpCategory.findMany({ orderBy: { name: 'asc' } })

  async function handleUpdate(formData: FormData) {
    'use server'

    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const content = formData.get('content') as string
    const excerpt = formData.get('excerpt') as string
    const categoryId = formData.get('categoryId') as string
    const metaTitle = formData.get('metaTitle') as string
    const metaDesc = formData.get('metaDesc') as string

    await prisma.helpArticle.update({
      where: { id: articleId },
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
    redirect(`/admin/help/articles/${articleId}`)
  }

  return (
    <AdminLayout title={`Sửa bài viết: ${article.title}`}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <form action={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--text)' }}>Tiêu đề *</label>
            <input
              type="text"
              name="title"
              defaultValue={article.title}
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
              defaultValue={article.slug}
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
              defaultValue={article.excerpt || ''}
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
              defaultValue={article.categoryId}
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
              defaultValue={article.content}
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
                defaultValue={article.metaTitle || ''}
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
                defaultValue={article.metaDescription || ''}
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

          {/* Metadata */}
          <div style={{ paddingTop: 16, borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-3)' }}>
            <div style={{ marginBottom: 6 }}>Tạo: {new Date(article.createdAt).toLocaleString('vi-VN')}</div>
            <div>Cập nhật: {new Date(article.updatedAt).toLocaleString('vi-VN')}</div>
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
              Lưu thay đổi
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
              Quay lại
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
