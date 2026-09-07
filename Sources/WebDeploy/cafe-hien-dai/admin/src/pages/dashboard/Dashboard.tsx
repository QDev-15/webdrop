import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  slides: number
  menuCategories: number
  menuItems: number
  gallery: number
  testimonials: number
  spaces: number
  team: number
  timeline: number
  faqs: number
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
          <div className="page-sub">MONO Coffee — Quản trị hệ thống</div>
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
              <div className="stat-card-icon" style={{ background: '#eaeef1' }}>🖼</div>
              <div className="stat-card-value">{stats?.slides ?? 0}</div>
              <div className="stat-card-label">Hero Slides</div>
              <Link to="/slides" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#eaeef1' }}>📂</div>
              <div className="stat-card-value">{stats?.menuCategories ?? 0}</div>
              <div className="stat-card-label">Danh mục thực đơn</div>
              <Link to="/menu-categories" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#eaeef1' }}>🍽</div>
              <div className="stat-card-value">{stats?.menuItems ?? 0}</div>
              <div className="stat-card-label">Món đồ uống</div>
              <Link to="/menu-items" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#eaeef1' }}>📸</div>
              <div className="stat-card-value">{stats?.gallery ?? 0}</div>
              <div className="stat-card-label">Ảnh thư viện</div>
              <Link to="/gallery" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#eaeef1' }}>💬</div>
              <div className="stat-card-value">{stats?.testimonials ?? 0}</div>
              <div className="stat-card-label">Đánh giá khách hàng</div>
              <Link to="/testimonials" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#eaeef1' }}>🏠</div>
              <div className="stat-card-value">{stats?.spaces ?? 0}</div>
              <div className="stat-card-label">Khu vực quán</div>
              <Link to="/spaces" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#eaeef1' }}>👥</div>
              <div className="stat-card-value">{stats?.team ?? 0}</div>
              <div className="stat-card-label">Thành viên đội ngũ</div>
              <Link to="/team" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#eaeef1' }}>📅</div>
              <div className="stat-card-value">{stats?.timeline ?? 0}</div>
              <div className="stat-card-label">Mốc hành trình</div>
              <Link to="/timeline" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#eaeef1' }}>❓</div>
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
              <Link to="/menu-items/new" className="btn-accent">+ Thêm món đồ uống</Link>
              <Link to="/testimonials/new" className="btn-accent">+ Thêm đánh giá</Link>
              <Link to="/settings" className="btn-ghost">⚙ Cài đặt hệ thống</Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
