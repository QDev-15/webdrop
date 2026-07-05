import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  bookings_total?: number
  bookings_new?: number
  contacts_total?: number
  contacts_new?: number
  services_total?: number
  team_total?: number
  testimonials_total?: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Stats>('/stats').then(setStats).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="admin-loading">Đang tải...</div>

  const cards = [
    { icon: '📅', label: 'Đặt lịch mới', value: stats.bookings_new ?? 0, sub: `${stats.bookings_total ?? 0} tổng`, link: '/bookings', color: '#6b8067' },
    { icon: '✉️', label: 'Liên hệ mới', value: stats.contacts_new ?? 0, sub: `${stats.contacts_total ?? 0} tổng`, link: '/contacts', color: '#5b7a91' },
    { icon: '🦷', label: 'Dịch vụ', value: stats.services_total ?? 0, sub: 'đang hoạt động', link: '/services', color: '#7a6b8a' },
    { icon: '👨‍⚕️', label: 'Bác sĩ', value: stats.team_total ?? 0, sub: 'trong đội ngũ', link: '/team', color: '#8a7a6b' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Tổng quan</div>
          <div className="page-sub">Nha Khoa An Tâm — ZEN-MINIMAL</div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {cards.map((c, i) => (
          <Link key={i} to={c.link} style={{ textDecoration: 'none' }}>
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: c.color + '18', color: c.color }}>{c.icon}</div>
              <div className="stat-card-value">{c.value}</div>
              <div className="stat-card-label">{c.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>{c.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16, color: 'var(--text)' }}>Thao tác nhanh</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link to="/bookings" className="btn-ghost btn-sm">📅 Xem đặt lịch</Link>
          <Link to="/services/new" className="btn-accent btn-sm">+ Thêm dịch vụ</Link>
          <Link to="/team/new" className="btn-accent btn-sm">+ Thêm bác sĩ</Link>
          <Link to="/testimonials/new" className="btn-ghost btn-sm">⭐ Thêm đánh giá</Link>
          <Link to="/slides" className="btn-ghost btn-sm">🖼️ Hero slides</Link>
          <Link to="/settings" className="btn-ghost btn-sm">⚙️ Cài đặt</Link>
        </div>
      </div>

      {/* Info */}
      <div className="card">
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14, color: 'var(--text)' }}>Thông tin hệ thống</div>
        <div style={{ display: 'grid', gap: 8, fontSize: 13, color: 'var(--text-2)' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: 'var(--text-3)', width: 130, flexShrink: 0 }}>Identity</span>
            <span>ZEN-MINIMAL · Sage green #6b8067</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: 'var(--text-3)', width: 130, flexShrink: 0 }}>Font</span>
            <span>Cormorant Garamond + DM Sans</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: 'var(--text-3)', width: 130, flexShrink: 0 }}>Ngách</span>
            <span>Nha khoa tổng quát</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: 'var(--text-3)', width: 130, flexShrink: 0 }}>Phiên bản</span>
            <span>1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  )
}
