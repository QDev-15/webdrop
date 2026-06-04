import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../contexts/AuthContext'

interface Stats {
  contacts: number
  new_contacts: number
  services: number
  projects: number
  team: number
  testimonials: number
  slides: number
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    api.get<Stats>('/stats').then(setStats).catch(console.error)
  }, [])

  const cards = [
    { label: 'Hero Slides',    value: stats?.slides ?? '-',       link: '/slides',       icon: '🖼',  color: 'var(--accent-light)' },
    { label: 'Dịch vụ',        value: stats?.services ?? '-',     link: '/services',     icon: '⚡',  color: '#eff6ff' },
    { label: 'Dự án',          value: stats?.projects ?? '-',     link: '/projects',     icon: '💼',  color: '#fdf4ff' },
    { label: 'Đội ngũ',        value: stats?.team ?? '-',         link: '/team',         icon: '👥',  color: '#fffbeb' },
    { label: 'Đánh giá',       value: stats?.testimonials ?? '-', link: '/testimonials', icon: '⭐',  color: '#fff7ed' },
    { label: 'Liên hệ mới',   value: stats?.new_contacts ?? '-', link: '/contacts',     icon: '✉️', color: stats?.new_contacts ? '#fff0f0' : 'var(--warm)' },
  ]

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Xin chào, {user?.name} 👋</div>
          <div className="page-subtitle">Tổng quan hệ thống</div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn-ghost">Xem website →</a>
        </div>
      </div>

      <div className="stats-grid">
        {cards.map(card => (
          <Link key={card.label} to={card.link} style={{ textDecoration: 'none' }}>
            <div className="stat-card" style={{ cursor: 'pointer', transition: 'box-shadow .2s', background: card.color }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>{card.icon}</div>
              <div className="stat-label">{card.label}</div>
              <div className="stat-value">{card.value}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Thao tác nhanh</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link to="/slides/new" className="btn-ghost" style={{ justifyContent: 'flex-start' }}>➕ Thêm Hero Slide mới</Link>
            <Link to="/services/new" className="btn-ghost" style={{ justifyContent: 'flex-start' }}>➕ Thêm Dịch vụ mới</Link>
            <Link to="/projects/new" className="btn-ghost" style={{ justifyContent: 'flex-start' }}>➕ Thêm Dự án mới</Link>
            <Link to="/team/new" className="btn-ghost" style={{ justifyContent: 'flex-start' }}>➕ Thêm Thành viên mới</Link>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Cài đặt nhanh</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link to="/settings" className="btn-ghost" style={{ justifyContent: 'flex-start' }}>⚙️ Thông tin công ty</Link>
            <Link to="/settings" className="btn-ghost" style={{ justifyContent: 'flex-start' }}>🌐 SEO & Mạng xã hội</Link>
            <Link to="/contacts" className="btn-ghost" style={{ justifyContent: 'flex-start' }}>
              ✉️ Xem liên hệ {stats?.new_contacts ? <span className="sidebar-badge" style={{ marginLeft: '8px' }}>{stats.new_contacts}</span> : null}
            </Link>
            <Link to="/profile" className="btn-ghost" style={{ justifyContent: 'flex-start' }}>🔐 Đổi mật khẩu</Link>
          </div>
        </div>
      </div>
    </>
  )
}
