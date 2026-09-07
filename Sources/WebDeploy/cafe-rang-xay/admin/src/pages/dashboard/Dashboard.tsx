import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  menuCategories: number
  menuItems: number
  featuredDrinks: number
  retailBeans: number
  brewMethods: number
  roastSteps: number
  workAreas: number
  galleryItems: number
  timelineItems: number
  testimonials: number
  faqs: number
  slides: number
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
          <div className="page-sub">Mộc Rang Roastery — Quản trị hệ thống</div>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading-box"><div className="admin-loading-box-text">Đang tải...</div></div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#f6e5df' }}>🖼</div>
              <div className="stat-card-value">{stats?.slides ?? 0}</div>
              <div className="stat-card-label">Hero Slides</div>
              <Link to="/slides" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#efe9e2' }}>🍽</div>
              <div className="stat-card-value">{stats?.menuItems ?? 0}</div>
              <div className="stat-card-label">Món & đồ uống</div>
              <Link to="/menu-items" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#f6e5df' }}>📂</div>
              <div className="stat-card-value">{stats?.menuCategories ?? 0}</div>
              <div className="stat-card-label">Danh mục thực đơn</div>
              <Link to="/menu-categories" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#efe9e2' }}>☕</div>
              <div className="stat-card-value">{stats?.featuredDrinks ?? 0}</div>
              <div className="stat-card-label">Thức uống nổi bật</div>
              <Link to="/featured-drinks" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#f6e5df' }}>🛍</div>
              <div className="stat-card-value">{stats?.retailBeans ?? 0}</div>
              <div className="stat-card-label">Hạt rang mang về</div>
              <Link to="/retail-beans" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#efe9e2' }}>🫗</div>
              <div className="stat-card-value">{stats?.brewMethods ?? 0}</div>
              <div className="stat-card-label">Phương pháp pha chế</div>
              <Link to="/brew-methods" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#f6e5df' }}>🏭</div>
              <div className="stat-card-value">{stats?.workAreas ?? 0}</div>
              <div className="stat-card-label">Khu vực xưởng</div>
              <Link to="/work-areas" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#efe9e2' }}>📸</div>
              <div className="stat-card-value">{stats?.galleryItems ?? 0}</div>
              <div className="stat-card-label">Thư viện ảnh</div>
              <Link to="/gallery" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#f6e5df' }}>🕰</div>
              <div className="stat-card-value">{stats?.timelineItems ?? 0}</div>
              <div className="stat-card-label">Hành trình thương hiệu</div>
              <Link to="/timeline" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#efe9e2' }}>🔥</div>
              <div className="stat-card-value">{stats?.roastSteps ?? 0}</div>
              <div className="stat-card-label">Quy trình chọn hạt</div>
              <Link to="/roast-steps" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#f6e5df' }}>⭐</div>
              <div className="stat-card-value">{stats?.testimonials ?? 0}</div>
              <div className="stat-card-label">Đánh giá khách hàng</div>
              <Link to="/testimonials" className="btn-ghost btn-sm" style={{ marginTop: 12 }}>Quản lý →</Link>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#efe9e2' }}>❓</div>
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
              <Link to="/menu-items/new" className="btn-accent">+ Thêm món/đồ uống</Link>
              <Link to="/testimonials/new" className="btn-accent">+ Thêm đánh giá</Link>
              <Link to="/faqs" className="btn-accent">+ Thêm câu hỏi</Link>
              <Link to="/settings" className="btn-ghost">⚙ Cài đặt hệ thống</Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
