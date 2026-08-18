import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  services: number
  slides: number
  team: number
  testimonials: number
  contacts: number
  newContacts: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Stats>('/stats')
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Markco — Quản trị hệ thống</div>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading-box">
          <div className="admin-loading-box-text">Đang tải...</div>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#f0e6ff' }}>🖼</div>
              <div className="stat-card-value">{stats?.slides ?? 0}</div>
              <div className="stat-card-label">Hero Slides</div>
              <Link to="/slides" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#e0f5ec' }}>⚙</div>
              <div className="stat-card-value">{stats?.services ?? 0}</div>
              <div className="stat-card-label">Dịch vụ</div>
              <Link to="/services" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#f0e6ff' }}>👥</div>
              <div className="stat-card-value">{stats?.team ?? 0}</div>
              <div className="stat-card-label">Thành viên đội ngũ</div>
              <Link to="/team" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#e0f5ec' }}>💬</div>
              <div className="stat-card-value">{stats?.testimonials ?? 0}</div>
              <div className="stat-card-label">Đánh giá khách hàng</div>
              <Link to="/testimonials" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#eff6ff' }}>✉</div>
              <div className="stat-card-value">{stats?.contacts ?? 0}</div>
              <div className="stat-card-label">
                Liên hệ
                {(stats?.newContacts ?? 0) > 0 && (
                  <span className="badge badge-new" style={{ marginLeft: 8 }}>{stats?.newContacts} mới</span>
                )}
              </div>
              <Link to="/contacts" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Xem tất cả →</Link>
            </div>
          </div>

          <div className="card" style={{ marginTop: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Truy cập nhanh</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/slides/new" className="btn-accent">+ Thêm Hero Slide</Link>
              <Link to="/services/new" className="btn-accent">+ Thêm dịch vụ</Link>
              <Link to="/team/new" className="btn-accent">+ Thêm thành viên</Link>
              <Link to="/testimonials/new" className="btn-accent">+ Thêm đánh giá</Link>
              <Link to="/settings" className="btn-ghost">⚙ Cài đặt hệ thống</Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
