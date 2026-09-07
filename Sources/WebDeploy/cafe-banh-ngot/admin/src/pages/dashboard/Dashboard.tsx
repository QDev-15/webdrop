import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  slides_total: number
  menu_items_total: number
  menu_categories_total: number
  gallery_total: number
  testimonials_total: number
  contacts_total: number
  contacts_new: number
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
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Rosette Bakery & Cafe — Quản trị hệ thống</div>
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
              <div className="stat-card-icon" style={{ background: 'var(--accent-light)' }}>🖼</div>
              <div className="stat-card-value">{stats?.slides_total ?? 0}</div>
              <div className="stat-card-label">Hero Slides</div>
              <Link to="/slides" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: 'var(--accent-light)' }}>📂</div>
              <div className="stat-card-value">{stats?.menu_categories_total ?? 0}</div>
              <div className="stat-card-label">Danh mục thực đơn</div>
              <Link to="/menu-categories" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: 'var(--accent-light)' }}>🧁</div>
              <div className="stat-card-value">{stats?.menu_items_total ?? 0}</div>
              <div className="stat-card-label">Món & Đồ uống</div>
              <Link to="/menu-items" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: 'var(--accent-light)' }}>📸</div>
              <div className="stat-card-value">{stats?.gallery_total ?? 0}</div>
              <div className="stat-card-label">Ảnh thư viện</div>
              <Link to="/gallery" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: 'var(--accent-light)' }}>⭐</div>
              <div className="stat-card-value">{stats?.testimonials_total ?? 0}</div>
              <div className="stat-card-label">Đánh giá khách hàng</div>
              <Link to="/testimonials" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#eff6ff' }}>✉</div>
              <div className="stat-card-value">{stats?.contacts_total ?? 0}</div>
              <div className="stat-card-label">
                Liên hệ
                {(stats?.contacts_new ?? 0) > 0 && (
                  <span className="badge badge-new" style={{ marginLeft: 8 }}>{stats?.contacts_new} mới</span>
                )}
              </div>
              <Link to="/contacts" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Xem tất cả →</Link>
            </div>
          </div>

          <div className="card" style={{ marginTop: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Truy cập nhanh</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/slides/new" className="btn-accent">+ Thêm Hero Slide</Link>
              <Link to="/menu-items/new" className="btn-accent">+ Thêm món ăn</Link>
              <Link to="/testimonials/new" className="btn-accent">+ Thêm đánh giá</Link>
              <Link to="/settings" className="btn-ghost">⚙ Cài đặt hệ thống</Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
