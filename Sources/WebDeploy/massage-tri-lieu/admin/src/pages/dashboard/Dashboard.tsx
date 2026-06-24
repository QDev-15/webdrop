import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import { useAuth } from '../../contexts/AuthContext'

interface Stats {
  total_services: number
  total_bookings: number
  new_bookings: number
  total_contacts: number
  new_contacts: number
  total_testimonials: number
  total_therapists: number
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Stats>('/stats').then(d => setStats(d)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Chào mừng, {user?.name}!</div>
          <div className="page-sub">Tổng quan hệ thống quản trị Tâm Thư Massage</div>
        </div>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-3)', fontSize: 14 }}>Đang tải dữ liệu...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
            <div className="stat-card">
              <div className="stat-card-icon">💆</div>
              <div className="stat-card-value">{stats?.total_services ?? 0}</div>
              <div className="stat-card-label">Dịch vụ</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon">📅</div>
              <div className="stat-card-value">{stats?.total_bookings ?? 0}</div>
              <div className="stat-card-label">Đặt lịch</div>
              {(stats?.new_bookings ?? 0) > 0 && (
                <div style={{ fontSize: 11, color: 'var(--danger)', marginTop: 4 }}>
                  {stats?.new_bookings} mới chờ
                </div>
              )}
            </div>
            <div className="stat-card">
              <div className="stat-card-icon">✉</div>
              <div className="stat-card-value">{stats?.total_contacts ?? 0}</div>
              <div className="stat-card-label">Liên hệ</div>
              {(stats?.new_contacts ?? 0) > 0 && (
                <div style={{ fontSize: 11, color: 'var(--danger)', marginTop: 4 }}>
                  {stats?.new_contacts} chưa xử lý
                </div>
              )}
            </div>
            <div className="stat-card">
              <div className="stat-card-icon">⭐</div>
              <div className="stat-card-value">{stats?.total_testimonials ?? 0}</div>
              <div className="stat-card-label">Đánh giá</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon">👥</div>
              <div className="stat-card-value">{stats?.total_therapists ?? 0}</div>
              <div className="stat-card-label">Chuyên viên</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {[
              { to: '/bookings', icon: '📅', label: 'Quản lý đặt lịch', badge: stats?.new_bookings },
              { to: '/services', icon: '💆', label: 'Quản lý dịch vụ' },
              { to: '/team', icon: '👥', label: 'Chuyên viên' },
              { to: '/testimonials', icon: '⭐', label: 'Đánh giá khách hàng' },
              { to: '/contacts', icon: '✉', label: 'Tin nhắn liên hệ', badge: stats?.new_contacts },
              { to: '/slides', icon: '🖼', label: 'Hero Slides' },
              { to: '/settings', icon: '⚙', label: 'Cài đặt hệ thống' },
            ].map(item => (
              <Link key={item.to} to={item.to} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'all .15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--warm)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface)')}
                >
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text)', flex: 1 }}>{item.label}</span>
                  {(item.badge ?? 0) > 0 && (
                    <span className="sidebar-badge">{item.badge}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
