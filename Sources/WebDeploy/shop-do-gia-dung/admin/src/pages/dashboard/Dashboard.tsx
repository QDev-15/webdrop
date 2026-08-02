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

  const cards = [
    { label: 'Sản phẩm', value: stats?.products ?? 0, icon: '🛍', color: '#b5651d', to: '/products' },
    { label: 'Danh mục', value: stats?.categories ?? 0, icon: '📂', color: '#87a06b', to: '/product-categories' },
    { label: 'Liên hệ mới', value: stats?.new_contacts ?? 0, icon: '✉', color: '#d97706', to: '/contacts' },
    { label: 'Đơn hàng chờ', value: stats?.pending_orders ?? 0, icon: '📦', color: '#0f6d82', to: '/orders' },
  ]

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-sub">Tổng quan hoạt động cửa hàng</p>
        </div>
        <Link to="/products/new" className="btn btn-primary">+ Thêm sản phẩm</Link>
      </div>

      {loading ? (
        <div className="admin-loading-box">Đang tải...</div>
      ) : (
        <div className="stats-grid">
          {cards.map(card => (
            <Link key={card.label} to={card.to} style={{ textDecoration: 'none' }}>
              <div className="stat-card">
                <div className="stat-card-icon" style={{ background: card.color + '18', color: card.color }}>
                  {card.icon}
                </div>
                <div className="stat-card-value">{card.value}</div>
                <div className="stat-card-label">{card.label}</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Thao tác nhanh</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link to="/products/new" className="btn btn-primary" style={{ justifyContent: 'center' }}>
              🛍 Thêm sản phẩm mới
            </Link>
            <Link to="/product-categories/new" className="btn btn-outline" style={{ justifyContent: 'center' }}>
              📂 Thêm danh mục mới
            </Link>
            <Link to="/slides/new" className="btn btn-outline" style={{ justifyContent: 'center' }}>
              🖼 Thêm slide mới
            </Link>
            <Link to="/settings" className="btn btn-outline" style={{ justifyContent: 'center' }}>
              ⚙ Cài đặt hệ thống
            </Link>
          </div>
        </div>

        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Hướng dẫn sử dụng</div>
          <div style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.7 }}>
            <p style={{ marginBottom: 8 }}>
              <strong>Bước 1:</strong> Thêm danh mục sản phẩm tại <Link to="/product-categories" style={{ color: 'var(--accent)' }}>Danh mục</Link>.
            </p>
            <p style={{ marginBottom: 8 }}>
              <strong>Bước 2:</strong> Thêm sản phẩm tại <Link to="/products" style={{ color: 'var(--accent)' }}>Sản phẩm</Link>.
            </p>
            <p style={{ marginBottom: 8 }}>
              <strong>Bước 3:</strong> Tùy chỉnh thông tin cửa hàng tại <Link to="/settings" style={{ color: 'var(--accent)' }}>Cài đặt</Link>.
            </p>
            <p>
              <strong>Bước 4:</strong> Quản lý đơn hàng tại <Link to="/orders" style={{ color: 'var(--accent)' }}>Đơn hàng</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
