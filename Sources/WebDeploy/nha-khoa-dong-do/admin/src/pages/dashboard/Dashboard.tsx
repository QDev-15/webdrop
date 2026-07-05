import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  services: number
  doctors: number
  bookings: number
  new_bookings: number
  contacts: number
  new_contacts: number
  testimonials: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Stats>('/stats')
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div>

  const cards = [
    { label: 'Đặt lịch mới', value: stats?.new_bookings ?? 0, total: stats?.bookings ?? 0, link: '/bookings', color: '#1d4fd8', bg: '#e8edfd', icon: '📅' },
    { label: 'Liên hệ mới', value: stats?.new_contacts ?? 0, total: stats?.contacts ?? 0, link: '/contacts', color: '#0891b2', bg: '#e0f7fa', icon: '✉' },
    { label: 'Dịch vụ', value: stats?.services ?? 0, total: null, link: '/services', color: '#7c3aed', bg: '#ede9fe', icon: '🦷' },
    { label: 'Bác sĩ', value: stats?.doctors ?? 0, total: null, link: '/team', color: '#059669', bg: '#d1fae5', icon: '👨‍⚕️' },
    { label: 'Đánh giá', value: stats?.testimonials ?? 0, total: null, link: '/testimonials', color: '#d97706', bg: '#fef3c7', icon: '⭐' },
  ]

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Tổng quan Nha Khoa Đông Đô</div>
        </div>
      </div>

      <div className="stats-grid">
        {cards.map(c => (
          <Link key={c.label} to={c.link} className="stat-card" style={{ textDecoration: 'none' }}>
            <div className="stat-card-icon" style={{ background: c.bg, color: c.color }}>{c.icon}</div>
            <div className="stat-card-value" style={{ color: c.color }}>{c.value}</div>
            <div className="stat-card-label">{c.label}</div>
            {c.total != null && (
              <div className="stat-card-total">Tổng: {c.total}</div>
            )}
          </Link>
        ))}
      </div>

      <div>
        <div className="page-sub" style={{ marginBottom: '10px', fontWeight: 600, color: 'var(--text-2)' }}>Truy cập nhanh</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/bookings" className="btn-accent">Xem đặt lịch mới</Link>
          <Link to="/services/new" className="btn-ghost">Thêm dịch vụ</Link>
          <Link to="/team/new" className="btn-ghost">Thêm bác sĩ</Link>
          <Link to="/settings" className="btn-ghost">Cài đặt website</Link>
        </div>
      </div>
    </>
  )
}
