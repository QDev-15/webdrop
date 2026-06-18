export const dynamic = 'force-dynamic'

import AdminLayout from '@/components/admin/AdminLayout'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import Link from 'next/link'
import { Suspense } from 'react'
import TemplateFilters from './TemplateFilters'

type TemplateWithIndustry = Prisma.TemplateGetPayload<{
  include: { industry: { select: { name: true; slug: true } } }
}>

function formatPrice(amount: unknown): string {
  const n = typeof amount === 'number' ? amount : (amount as { toNumber(): number }).toNumber()
  return n.toLocaleString('vi-VN') + 'đ'
}

const statusLabel: Record<string, string> = { published: 'Đang bán', draft: 'Nháp' }
const statusColor: Record<string, string> = { published: 'var(--accent)', draft: 'var(--text-3)' }

export default async function AdminTemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; status?: string; industry?: string; website?: string }>
}) {
  const sp       = await searchParams
  const q        = sp.q?.trim() ?? ''
  const category = sp.category ?? ''
  const status   = sp.status   ?? ''
  const industry = sp.industry ?? ''
  const website  = sp.website  ?? ''

  const where: Prisma.TemplateWhereInput = {
    ...(q        && { name: { contains: q, mode: 'insensitive' } }),
    ...(category && { category: category as 'web' | 'admin' }),
    ...(status   && { status:   status   as 'published' | 'draft' }),
    ...(industry && { industry: { slug: industry } }),
    ...(website === 'yes' && { hasWebsite: true }),
    ...(website === 'no'  && { hasWebsite: false }),
  }

  let templates: TemplateWithIndustry[] = []
  let industries: { slug: string; name: string }[] = []

  try {
    ;[templates, industries] = await Promise.all([
      prisma.template.findMany({
        where,
        include: { industry: { select: { name: true, slug: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.industry.findMany({ orderBy: { sortOrder: 'asc' }, select: { slug: true, name: true } }),
    ])
  } catch { /* DB chưa kết nối */ }

  const total     = templates.length
  const published = templates.filter(t => t.status === 'published').length
  const draft     = templates.filter(t => t.status === 'draft').length

  return (
    <AdminLayout title="Quản lý Template">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ fontSize: 13, color: 'var(--text-2)' }}>Tổng: <strong>{total}</strong></div>
          <div style={{ fontSize: 13, color: 'var(--accent)' }}>Đang bán: <strong>{published}</strong></div>
          <div style={{ fontSize: 13, color: 'var(--text-3)' }}>Nháp: <strong>{draft}</strong></div>
        </div>
        <Link href="/admin/templates/new"
          style={{ fontSize: 13, padding: '8px 18px', borderRadius: 8, background: 'var(--accent)', color: '#fff', textDecoration: 'none', fontWeight: 500 }}>
          + Thêm template
        </Link>
      </div>

      {/* Filters */}
      <Suspense>
        <TemplateFilters industries={industries} total={total} withWebsite={templates.filter(t => t.hasWebsite).length} />
      </Suspense>

      {/* Grid */}
      {templates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-3)', fontSize: 14 }}>
          {q || category || status || industry
            ? 'Không tìm thấy template phù hợp.'
            : <>Chưa có template nào. <br /><span style={{ fontSize: 12 }}>Chạy <code>npm run db:seed</code> để tạo dữ liệu mẫu.</span></>
          }
        </div>
      ) : (
        <div className="row g-3">
          {templates.map(t => (
            <div key={t.id} className="col-lg-4 col-md-6">
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                {t.thumbnail && (
                  <div style={{ height: 160, overflow: 'hidden', background: 'var(--warm)' }}>
                    <img src={t.thumbnail} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  </div>
                )}
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{t.name}</div>
                    <span style={{ fontSize: 11, color: statusColor[t.status], background: t.status === 'published' ? 'var(--accent-light)' : 'var(--warm)', borderRadius: 5, padding: '2px 8px', flexShrink: 0, marginLeft: 8 }}>
                      {statusLabel[t.status]}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{t.industry?.name || t.category} · {t.salesCount} lượt mua</span>
                    {t.hasWebsite
                      ? <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: '#e8f4ef', color: 'var(--accent)', flexShrink: 0 }}>🌐 Gói B</span>
                      : <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'var(--warm)', color: 'var(--text-3)', flexShrink: 0 }}>Template only</span>
                    }
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--accent)' }}>{formatPrice(t.price)}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {t.demoUrl && (
                        <a href={t.demoUrl} target="_blank" rel="noopener noreferrer"
                          style={{ fontSize: 12, color: 'var(--text-2)', textDecoration: 'none' }}>Demo ↗</a>
                      )}
                      <Link href={`/admin/templates/${t.id}/edit`}
                        style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>Sửa</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
