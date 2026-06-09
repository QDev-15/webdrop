import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  contacts: number
  new_contacts: number
  services: number
  projects: number
  testimonials: number
  hero_slides: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    api.get<Stats>('/stats').then(setStats).catch(() => {})
  }, [])

  const cards = [
    { label: 'Dịch vụ', value: stats?.services ?? '—', icon: '🏗', to: '/services', color: '#d84315' },
    { label: 'Dự án', value: stats?.projects ?? '—', icon: '🏢', to: '/projects', color: '#1a6b52' },
    { label: 'Đánh giá', value: stats?.testimonials ?? '—', icon: '⭐', to: '/testimonials', color: '#d97706' },
    { label: 'Liên hệ mới', value: stats?.new_contacts ?? '—', icon: '✉', to: '/contacts', color: '#1d4ed8' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Tổng quan hệ thống</div>
        </div>
        <Link to="/contacts" className="btn-accent">
          Xem liên hệ mới
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {cards.map(card => (
          <Link key={card.to} to={card.to} style={{ textDecoration: 'none' }}>
            <div className="stat-card" style={{ cursor: 'pointer', transition: 'box-shadow .15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,0,0,.08)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'}>
              <div className="stat-card-icon">{card.icon}</div>
              <div className="stat-card-value" style={{ color: card.color }}>{card.value}</div>
              <div className="stat-card-label">{card.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Truy cập nhanh</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { to: '/slides', label: 'Quản lý Hero Slides', icon: '🖼' },
              { to: '/services', label: 'Quản lý Dịch vụ', icon: '🏗' },
              { to: '/projects', label: 'Quản lý Dự án', icon: '🏢' },
              { to: '/settings', label: 'Cài đặt website', icon: '⚙' },
            ].map(item => (
              <Link key={item.to} to={item.to} className="btn-ghost" style={{ justifyContent: 'flex-start' }}>
                <span>{item.icon}</span> {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Thông tin hệ thống</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Hero Slides', value: stats?.hero_slides ?? '—' },
              { label: 'Dịch vụ', value: stats?.services ?? '—' },
              { label: 'Dự án', value: stats?.projects ?? '—' },
              { label: 'Tổng liên hệ', value: stats?.contacts ?? '—' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ color: 'var(--text-2)' }}>{item.label}</span>
                <span style={{ fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
