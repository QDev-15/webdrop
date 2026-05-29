import AdminLayout from '@/components/admin/AdminLayout'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import Link from 'next/link'

type TemplateWithIndustry = Prisma.TemplateGetPayload<{
  include: { industry: { select: { name: true } } }
}>

function formatPrice(amount: unknown): string {
  const n = typeof amount === 'number' ? amount : (amount as { toNumber(): number }).toNumber()
  return n.toLocaleString('vi-VN') + 'đ'
}

export default async function AdminTemplatesPage() {
  let templates: TemplateWithIndustry[] = []
  try {
    templates = await prisma.template.findMany({
      include: { industry: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    })
  } catch { /* DB chưa kết nối — dùng empty */ }

  const published = templates.filter(t => t.status === 'published').length
  const draft = templates.filter(t => t.status === 'draft').length

  const statusLabel: Record<string, string> = { published: 'Đang bán', draft: 'Nháp' }
  const statusColor: Record<string, string> = { published: 'var(--accent)', draft: 'var(--text-3)' }

  return (
    <AdminLayout title="Quản lý Template">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ fontSize: 13, color: 'var(--text-2)' }}>Tổng: <strong>{templates.length}</strong></div>
          <div style={{ fontSize: 13, color: 'var(--accent)' }}>Đang bán: <strong>{published}</strong></div>
          <div style={{ fontSize: 13, color: 'var(--text-3)' }}>Nháp: <strong>{draft}</strong></div>
        </div>
        <Link
          href="/admin/templates/new"
          style={{ fontSize: 13, padding: '8px 18px', borderRadius: 8, background: 'var(--accent)', color: '#fff', textDecoration: 'none', fontWeight: 500 }}
        >
          + Thêm template
        </Link>
      </div>

      {templates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-3)', fontSize: 14 }}>
          Chưa có template nào. <br />
          <span style={{ fontSize: 12 }}>Chạy <code>npm run db:seed</code> để tạo dữ liệu mẫu.</span>
        </div>
      ) : (
        <div className="row g-3">
          {templates.map(t => (
            <div key={t.id} className="col-lg-4 col-md-6">
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', transition: 'box-shadow .15s' }}>
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
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 10 }}>
                    {t.industry?.name || t.category} · {t.salesCount} lượt mua
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
