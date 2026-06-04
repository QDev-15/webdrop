import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Stats {
  contacts: number
  new_contacts: number
  demo_requests: number
  new_demos: number
  features: number
  pricing_plans: number
  testimonials: number
  faqs: number
  hero_slides: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    api.get<Stats>('/stats').then(setStats).catch(console.error)
  }, [])

  if (!stats) return <div className="loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">Tổng quan hệ thống TechFlow</p>
        </div>
        <a href="/" target="_blank" className="btn btn-ghost btn-sm">Xem website ↗</a>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Liên hệ mới</div>
          <div className="stat-value" style={{ color: stats.new_contacts > 0 ? '#dc2626' : undefined }}>{stats.new_contacts}</div>
          <div className="stat-sub">Tổng: {stats.contacts}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Đặt lịch demo</div>
          <div className="stat-value" style={{ color: stats.new_demos > 0 ? '#d97706' : undefined }}>{stats.new_demos}</div>
          <div className="stat-sub">Tổng: {stats.demo_requests}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Tính năng</div>
          <div className="stat-value">{stats.features}</div>
          <div className="stat-sub">Sản phẩm</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Gói giá</div>
          <div className="stat-value">{stats.pricing_plans}</div>
          <div className="stat-sub">Bảng giá</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card">
          <h2 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: 'var(--text)' }}>Truy cập nhanh</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { to: '/slides/new',   label: '+ Thêm hero slide' },
              { to: '/features/new', label: '+ Thêm tính năng' },
              { to: '/pricing/new',  label: '+ Thêm gói giá' },
              { to: '/faqs/new',     label: '+ Thêm câu hỏi FAQ' },
            ].map(item => (
              <Link key={item.to} to={item.to} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: 'var(--text)' }}>Nội dung hiện có</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Hero Slides',   value: stats.hero_slides,   to: '/slides' },
              { label: 'Tính năng',     value: stats.features,      to: '/features' },
              { label: 'Gói giá',       value: stats.pricing_plans, to: '/pricing' },
              { label: 'Đánh giá',      value: stats.testimonials,  to: '/testimonials' },
              { label: 'FAQ',           value: stats.faqs,          to: '/faqs' },
            ].map(item => (
              <Link key={item.to} to={item.to} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-2)', padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
                <span>{item.label}</span>
                <strong style={{ color: 'var(--text)' }}>{item.value}</strong>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
