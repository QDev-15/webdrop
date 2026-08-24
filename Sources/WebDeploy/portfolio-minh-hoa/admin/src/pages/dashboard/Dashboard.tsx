import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  projects: number
  slides: number
  testimonials: number
  faqs: number
  pricing: number
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
          <div className="page-sub">Lam Trúc Illustration — Quản trị hệ thống</div>
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
              <div className="stat-card-icon" style={{ background: '#faedd2' }}>🖼</div>
              <div className="stat-card-value">{stats?.slides ?? 0}</div>
              <div className="stat-card-label">Hero Slides</div>
              <Link to="/slides" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#fbe0d1' }}>🎨</div>
              <div className="stat-card-value">{stats?.projects ?? 0}</div>
              <div className="stat-card-label">Dự án (Case Study)</div>
              <Link to="/projects" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#faedd2' }}>💬</div>
              <div className="stat-card-value">{stats?.testimonials ?? 0}</div>
              <div className="stat-card-label">Đánh giá khách hàng</div>
              <Link to="/testimonials" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#fbe0d1' }}>💰</div>
              <div className="stat-card-value">{stats?.pricing ?? 0}</div>
              <div className="stat-card-label">Gói giá dịch vụ</div>
              <Link to="/pricing" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#faedd2' }}>❓</div>
              <div className="stat-card-value">{stats?.faqs ?? 0}</div>
              <div className="stat-card-label">Câu hỏi thường gặp</div>
              <Link to="/faqs" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
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
              <Link to="/projects/new" className="btn-accent">+ Thêm dự án</Link>
              <Link to="/testimonials/new" className="btn-accent">+ Thêm đánh giá</Link>
              <Link to="/pricing/new" className="btn-accent">+ Thêm gói giá</Link>
              <Link to="/faqs/new" className="btn-accent">+ Thêm câu hỏi</Link>
              <Link to="/settings" className="btn-ghost">⚙ Cài đặt hệ thống</Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
