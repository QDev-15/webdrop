export const dynamic = 'force-dynamic'

import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import ProjectDetailClient from './ProjectDetailClient'

const STATUS_LABEL: Record<string, string> = {
  planning: 'Lên kế hoạch', designing: 'Thiết kế', developing: 'Phát triển',
  reviewing: 'Review', delivered: 'Đã bàn giao', done: 'Hoàn thành',
}
const STATUS_COLOR: Record<string, string> = {
  planning: '#6b7280', designing: '#9333ea', developing: '#d97706',
  reviewing: '#ea580c', delivered: '#0369a1', done: 'var(--accent)',
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id: parseInt(id) },
    include: {
      customer: { select: { id: true, name: true, phone: true, email: true } },
      order: { select: { id: true, code: true, total: true, status: true } },
      milestones: { orderBy: { id: 'asc' } },
      notes: {
        orderBy: { createdAt: 'desc' },
        include: { createdByUser: { select: { name: true } } },
      },
    },
  }).catch(() => null)

  if (!project) notFound()

  const done = project.milestones.filter(m => m.status === 'done').length
  const total = project.milestones.length

  return (
    <AdminLayout title={project.name}>
      <div className="d-flex align-items-center gap-2 mb-4">
        <Link href="/admin/projects" style={{ fontSize: 13, color: 'var(--text-2)', textDecoration: 'none' }}>← Dự án</Link>
        <span style={{ color: 'var(--text-3)' }}>›</span>
        <span style={{ fontSize: 13, color: 'var(--text)' }}>{project.name}</span>
      </div>

      <div className="row g-3">
        {/* Left: Info */}
        <div className="col-lg-4">
          {/* Project card */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px', marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{project.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{project.type === 'goi_b' ? 'Gói B' : 'Gói C'} · {new Date(project.createdAt).toLocaleDateString('vi-VN')}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 500, color: STATUS_COLOR[project.status], background: STATUS_COLOR[project.status] + '18', padding: '4px 12px', borderRadius: 20, flexShrink: 0, marginLeft: 8 }}>
                {STATUS_LABEL[project.status]}
              </span>
            </div>

            {/* Progress */}
            {total > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-2)', marginBottom: 6 }}>
                  <span>Tiến độ</span><span>{done}/{total} milestones</span>
                </div>
                <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--accent)', borderRadius: 3, width: `${total > 0 ? Math.round(done / total * 100) : 0}%`, transition: 'width .4s' }} />
                </div>
              </div>
            )}

            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 13, color: 'var(--text-2)' }}>👤 <Link href={`/admin/customers/${project.customer.id}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>{project.customer.name}</Link></div>
              {project.customer.phone && <div style={{ fontSize: 13, color: 'var(--text-2)' }}>📞 {project.customer.phone}</div>}
              {project.domain && <div style={{ fontSize: 13 }}>🌐 <a href={`https://${project.domain}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>{project.domain}</a></div>}
              {project.adminUrl && <div style={{ fontSize: 13, color: 'var(--text-2)' }}>⚙️ {project.adminUrl}</div>}
            </div>

            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border-light)' }}>
              <Link href={`/admin/orders/${project.order.id}`}
                style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                📋 Đơn hàng {project.order.code} →
              </Link>
            </div>
          </div>

          {/* Hosting info */}
          {project.hostingInfo && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px', marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 8 }}>Thông tin Hosting</div>
              <pre style={{ fontSize: 12, color: 'var(--text-2)', whiteSpace: 'pre-wrap', fontFamily: 'monospace', margin: 0 }}>{project.hostingInfo}</pre>
            </div>
          )}
        </div>

        {/* Right: Milestones + Notes */}
        <div className="col-lg-8">
          <ProjectDetailClient
            projectId={project.id}
            currentStatus={project.status}
            milestones={project.milestones.map(m => ({
              id: m.id, title: m.title, description: m.description,
              status: m.status, dueAt: m.dueAt ? m.dueAt.toISOString() : null,
              completedAt: m.completedAt ? m.completedAt.toISOString() : null,
            }))}
            notes={project.notes.map(n => ({
              id: n.id, content: n.content,
              createdAt: n.createdAt.toISOString(),
              author: n.createdByUser?.name || 'Admin',
            }))}
          />
        </div>
      </div>
    </AdminLayout>
  )
}
