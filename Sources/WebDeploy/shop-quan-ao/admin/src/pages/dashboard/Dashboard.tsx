import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  products: number
  categories: number
  new_contacts: number
  pending_orders: number
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
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-sub">Tổng quan cửa hàng Lys Chic</p>
      </div>

      {loading ? (
        <div className="admin-loading-box">Đang tải...</div>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🛍</div>
            <div className="stat-info">
              <div className="stat-num">{stats?.products ?? 0}</div>
              <div className="stat-label">Sản phẩm</div>
            </div>
            <Link to="/products" className="stat-link">Xem →</Link>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📂</div>
            <div className="stat-info">
              <div className="stat-num">{stats?.categories ?? 0}</div>
              <div className="stat-label">Danh mục</div>
            </div>
            <Link to="/product-categories" className="stat-link">Xem →</Link>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🧾</div>
            <div className="stat-info">
              <div className="stat-num">{stats?.pending_orders ?? 0}</div>
              <div className="stat-label">Đơn chờ xử lý</div>
            </div>
            <Link to="/orders" className="stat-link">Xem →</Link>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✉</div>
            <div className="stat-info">
              <div className="stat-num">{stats?.new_contacts ?? 0}</div>
              <div className="stat-label">Liên hệ mới</div>
            </div>
            <Link to="/contacts" className="stat-link">Xem →</Link>
          </div>
        </div>
      )}

      <div className="admin-quick-links" style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Thao tác nhanh</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/products/new" className="btn btn-primary">+ Thêm sản phẩm</Link>
          <Link to="/product-categories/new" className="btn btn-outline">+ Thêm danh mục</Link>
          <Link to="/slides/new" className="btn btn-outline">+ Thêm Hero Slide</Link>
        </div>
      </div>
    </div>
  )
}
