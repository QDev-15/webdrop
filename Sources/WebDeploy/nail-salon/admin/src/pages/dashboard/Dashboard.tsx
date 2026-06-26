import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  services: number; bookings: number; new_bookings: number
  contacts: number; new_contacts: number; team: number
  testimonials: number; gallery: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<Stats>('/stats')
      .then(setStats)
      .catch(() => setError('Không thể tải thống kê.'))
  }, [])

  if (error) return <div className="alert alert-error">{error}</div>
  if (!stats) return <div className="admin-loading">Đang tải...</div>

  const cards = [
    { icon: '💅', label: 'Dịch vụ',      value: stats.services,    link: '/services',    badge: 0 },
    { icon: '📅', label: 'Lịch hẹn',     value: stats.bookings,    link: '/bookings',    badge: stats.new_bookings },
    { icon: '✉',  label: 'Liên hệ',      value: stats.contacts,    link: '/contacts',    badge: stats.new_contacts },
    { icon: '👩', label: 'Đội ngũ',       value: stats.team,        link: '/team',        badge: 0 },
    { icon: '⭐', label: 'Đánh giá',      value: stats.testimonials,link: '/testimonials',badge: 0 },
    { icon: '🖼', label: 'Ảnh gallery',   value: stats.gallery,     link: '/gallery',     badge: 0 },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Tổng quan hệ thống NAIL Studio</div>
        </div>
        <Link to="/bookings" className="btn-accent">
          📅 Xem lịch hẹn mới ({stats.new_bookings})
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        {cards.map(c => (
          <Link key={c.label} to={c.link} style={{ textDecoration: 'none' }}>
            <div className="stat-card" style={{ position: 'relative' }}>
              {c.badge > 0 && (
                <span style={{ position: 'absolute', top: 12, right: 12, background: '#e24b4a', color: '#fff', fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 10 }}>
                  +{c.badge} mới
                </span>
              )}
              <div className="stat-card-icon">{c.icon}</div>
              <div className="stat-card-value">{c.value}</div>
              <div className="stat-card-label">{c.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="card">
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Truy cập nhanh</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link to="/services/new"      className="btn-ghost btn-sm">+ Thêm dịch vụ</Link>
          <Link to="/team/new"          className="btn-ghost btn-sm">+ Thêm thợ</Link>
          <Link to="/testimonials/new"  className="btn-ghost btn-sm">+ Thêm đánh giá</Link>
          <Link to="/slides/new"        className="btn-ghost btn-sm">+ Thêm ảnh hero</Link>
          <Link to="/settings"          className="btn-ghost btn-sm">⚙ Cài đặt</Link>
        </div>
      </div>
    </div>
  )
}
