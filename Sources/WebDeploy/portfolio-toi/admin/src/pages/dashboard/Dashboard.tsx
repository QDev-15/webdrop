import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  projects: number
  skills: number
  testimonials: number
  contacts: number
  new_contacts: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Stats>('/stats')
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ color: 'var(--text-3)', fontSize: 14 }}>Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Tổng quan</div>
          <div className="page-sub">Chào mừng trở lại! Đây là tình trạng website của bạn.</div>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ fontSize: 12 }}>
          Xem website ↗
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div className="stat-card">
          <div className="stat-card-icon">🗂</div>
          <div className="stat-card-value">{stats?.projects ?? 0}</div>
          <div className="stat-card-label">Dự án</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">✨</div>
          <div className="stat-card-value">{stats?.skills ?? 0}</div>
          <div className="stat-card-label">Kỹ năng</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">⭐</div>
          <div className="stat-card-value">{stats?.testimonials ?? 0}</div>
          <div className="stat-card-label">Đánh giá</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">✉</div>
          <div className="stat-card-value">{stats?.contacts ?? 0}</div>
          <div className="stat-card-label">Liên hệ
            {(stats?.new_contacts ?? 0) > 0 && (
              <span style={{ marginLeft: 8, background: 'var(--danger)', color: '#fff', fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 10 }}>
                {stats?.new_contacts} mới
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Thao tác nhanh</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link to="/projects/new" className="btn-accent btn-sm">+ Thêm dự án mới</Link>
            <Link to="/testimonials/new" className="btn-ghost btn-sm">+ Thêm đánh giá</Link>
            <Link to="/slides/new" className="btn-ghost btn-sm">+ Thêm Hero Slide</Link>
          </div>
        </div>
        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Cần xử lý</div>
          {(stats?.new_contacts ?? 0) > 0 ? (
            <Link to="/contacts" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: '#fff0f0', borderRadius: 8, textDecoration: 'none', fontSize: 13, color: 'var(--danger)' }}>
              <span>✉</span>
              <span>{stats?.new_contacts} liên hệ mới chờ phản hồi</span>
            </Link>
          ) : (
            <div style={{ color: 'var(--text-3)', fontSize: 13 }}>Không có việc cần xử lý.</div>
          )}
        </div>
      </div>
    </div>
  )
}
