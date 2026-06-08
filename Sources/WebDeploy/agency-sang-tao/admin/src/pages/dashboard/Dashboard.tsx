import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import { api } from '../../api/client'

interface Stats {
  projects: number
  services: number
  team_members: number
  testimonials: number
  contacts: number
  new_contacts: number
  hero_slides: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    api.get<Stats>('/stats').then(setStats).catch(console.error)
  }, [])

  const cards = [
    { icon: '🗂', label: 'Dự án', value: stats?.projects ?? '—', link: '/projects', color: '#f59e0b' },
    { icon: '⚡', label: 'Dịch vụ', value: stats?.services ?? '—', link: '/services', color: '#8b5cf6' },
    { icon: '👥', label: 'Đội ngũ', value: stats?.team_members ?? '—', link: '/team', color: '#06b6d4' },
    { icon: '⭐', label: 'Đánh giá', value: stats?.testimonials ?? '—', link: '/testimonials', color: '#f59e0b' },
    { icon: '✉', label: 'Liên hệ mới', value: stats?.new_contacts ?? '—', link: '/contacts', color: '#e24b4a' },
    { icon: '🖼', label: 'Hero Slides', value: stats?.hero_slides ?? '—', link: '/slides', color: '#1a6b52' },
  ]

  return (
    <AdminLayout title="Dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tổng quan</h1>
          <p className="page-sub">Quản lý nội dung website Agency Sáng Tạo</p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {cards.map((card) => (
          <div key={card.label} className="col-sm-6 col-lg-4">
            <Link to={card.link} style={{ textDecoration: 'none' }}>
              <div className="stat-card" style={{ cursor: 'pointer', transition: 'transform .15s, box-shadow .15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,.08)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '' }}>
                <div className="stat-card-icon" style={{ color: card.color }}>{card.icon}</div>
                <div className="stat-card-value">{card.value}</div>
                <div className="stat-card-label">{card.label}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-12">
          <div className="card">
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Truy cập nhanh</h3>
            <div className="d-flex gap-2 flex-wrap">
              <Link to="/projects" className="btn-accent btn-sm">+ Thêm dự án</Link>
              <Link to="/services" className="btn-accent btn-sm">+ Thêm dịch vụ</Link>
              <Link to="/team" className="btn-accent btn-sm">+ Thêm thành viên</Link>
              <Link to="/settings" className="btn-ghost btn-sm">Cài đặt</Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
