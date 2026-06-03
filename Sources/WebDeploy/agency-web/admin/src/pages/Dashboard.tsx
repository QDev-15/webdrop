import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../contexts/AuthContext'

interface Stats {
  contacts_total: number
  contacts_new: number
  services_total: number
  projects_total: number
  team_total: number
  testimonials_total: number
  posts_total: number
  posts_published: number
  slides_total: number
  recent_contacts: {
    id: number; name: string; phone: string; email: string
    subject: string; service: string; status: string; created_at: string
  }[]
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    api.get<Stats>('/stats').then(setStats).catch(() => {})
  }, [])

  const cards = stats ? [
    { label: 'Hero Slides',    value: stats.slides_total,    link: '/slides',       color: 'var(--accent)' },
    { label: 'Dịch vụ',       value: stats.services_total,  link: '/services',     color: '#7c3aed' },
    { label: 'Dự án',         value: stats.projects_total,  link: '/projects',     color: '#0891b2' },
    { label: 'Thành viên',    value: stats.team_total,      link: '/team',         color: '#d97706' },
    { label: 'Đánh giá',      value: stats.testimonials_total, link: '/testimonials', color: '#f59e0b' },
    { label: 'Bài viết',      value: stats.posts_total,     link: '/posts',        color: '#6b7280' },
    { label: 'Liên hệ mới',   value: stats.contacts_new,    link: '/contacts',     color: '#e24b4a' },
    { label: 'Tổng liên hệ',  value: stats.contacts_total,  link: '/contacts',     color: '#475569' },
  ] : []

  return (
    <>
      <div className="page-hd">
        <div>
          <h1 className="page-hd-title">Chào mừng, {user?.name} 👋</h1>
          <div className="page-hd-sub">Quản trị nội dung website Agency Web</div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        {cards.map(c => (
          <Link key={c.label} to={c.link} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ borderLeft: `3px solid ${c.color}` }}>
              <div className="card-title">{c.label}</div>
              <div className="stat-big">{c.value ?? '—'}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* RECENT CONTACTS */}
      {stats?.recent_contacts && stats.recent_contacts.length > 0 && (
        <div className="card">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div style={{ fontWeight: 600, fontSize: '14px' }}>Liên hệ gần đây</div>
            <Link to="/contacts" className="btn btn-ghost btn-sm">Xem tất cả →</Link>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tên</th><th>SĐT</th><th>Dịch vụ</th><th>Trạng thái</th><th>Ngày</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_contacts.map(c => (
                  <tr key={c.id}>
                    <td className="td-name">
                      <Link to={`/contacts/${c.id}`} style={{ color: 'var(--accent)' }}>{c.name}</Link>
                    </td>
                    <td>{c.phone}</td>
                    <td>{c.service || c.subject || '—'}</td>
                    <td><span className={`badge badge-${c.status}`}>{c.status}</span></td>
                    <td>{fmtDate(c.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QUICK LINKS */}
      <div className="card mt-4">
        <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '14px' }}>Thao tác nhanh</div>
        <div className="d-flex gap-2 flex-wrap">
          <Link to="/slides/new"       className="btn btn-ghost btn-sm">+ Slide mới</Link>
          <Link to="/services/new"     className="btn btn-ghost btn-sm">+ Dịch vụ mới</Link>
          <Link to="/projects/new"     className="btn btn-ghost btn-sm">+ Dự án mới</Link>
          <Link to="/team/new"         className="btn btn-ghost btn-sm">+ Thành viên mới</Link>
          <Link to="/testimonials/new" className="btn btn-ghost btn-sm">+ Đánh giá mới</Link>
          <Link to="/posts/new"        className="btn btn-ghost btn-sm">+ Bài viết mới</Link>
          <Link to="/settings"         className="btn btn-primary btn-sm">Cài đặt ⚙</Link>
        </div>
      </div>
    </>
  )
}
