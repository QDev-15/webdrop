import AdminLayout from '@/components/admin/AdminLayout'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'

export default async function EditHelpCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const categoryId = parseInt(id)

  if (isNaN(categoryId)) notFound()

  const category = await prisma.helpCategory.findUnique({
    where: { id: categoryId },
  })

  if (!category) notFound()

  async function handleUpdate(formData: FormData) {
    'use server'

    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const description = formData.get('description') as string
    const icon = formData.get('icon') as string

    await prisma.helpCategory.update({
      where: { id: categoryId },
      data: {
        name,
        slug,
        description: description || null,
        icon: icon || null,
      },
    })
    redirect('/admin/help')
  }

  return (
    <AdminLayout title={`Sửa danh mục: ${category.name}`}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <form action={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Name */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--text)' }}>Tên danh mục *</label>
            <input
              type="text"
              name="name"
              defaultValue={category.name}
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
              defaultValue={category.slug}
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

          {/* Icon */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--text)' }}>Icon (emoji)</label>
            <input
              type="text"
              name="icon"
              defaultValue={category.icon || ''}
              maxLength={2}
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

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--text)' }}>Mô tả</label>
            <textarea
              name="description"
              defaultValue={category.description || ''}
              rows={3}
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
