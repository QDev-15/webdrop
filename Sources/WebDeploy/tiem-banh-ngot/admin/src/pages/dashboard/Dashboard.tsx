import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  total_products: number
  total_orders: number
  pending_orders: number
  new_contacts: number
  total_gallery: number
  recent_orders: RecentOrder[]
  recent_contacts: RecentContact[]
}

interface RecentOrder {
  id: number
  name: string
  phone: string
  cake_type: string
  status: string
  created_at: string
}

interface RecentContact {
  id: number
  name: string
  email: string
  subject: string
  status: string
  created_at: string
}

const ORDER_STATUS: Record<string, { label: string; color: string }> = {
  pending:     { label: 'Chờ xử lý',  color: '#fffbeb' },
  confirmed:   { label: 'Đã xác nhận', color: '#eff6ff' },
  in_progress: { label: 'Đang làm',   color: '#fdf4ff' },
  ready:       { label: 'Sẵn sàng',   color: '#f0fdf4' },
  completed:   { label: 'Hoàn thành', color: 'var(--accent-light)' },
  cancelled:   { label: 'Đã hủy',     color: '#fff0f0' },
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<Stats>('/stats')
      .then(setStats)
      .catch(err => setError(err instanceof Error ? err.message : 'Không tải được dữ liệu.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="admin-loading">Đang tải...</div>
  if (error) return <div className="alert alert-error">{error}</div>
  if (!stats) return null

  const statCards = [
    { icon: '🎂', label: 'Sản phẩm bánh', value: stats.total_products, link: '/products', color: 'var(--accent-light)' },
    { icon: '📋', label: 'Đơn đặt bánh', value: stats.total_orders, link: '/orders', color: '#eff6ff' },
    { icon: '⏳', label: 'Chờ xử lý', value: stats.pending_orders, link: '/orders', color: '#fffbeb' },
    { icon: '✉', label: 'Liên hệ mới', value: stats.new_contacts, link: '/contacts', color: '#fdf4ff' },
    { icon: '🖼', label: 'Ảnh gallery', value: stats.total_gallery, link: '/gallery', color: '#f0fdf4' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Tổng quan La Douceur Patisserie</div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        {statCards.map(s => (
          <Link key={s.label} to={s.link} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ background: s.color, border: 'none', cursor: 'pointer', transition: 'transform .2s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)', letterSpacing: '-1px' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Recent orders */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Đơn đặt bánh gần đây</div>
            <Link to="/orders" style={{ fontSize: 12, color: 'var(--accent)' }}>Xem tất cả →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {stats.recent_orders.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--text-3)', textAlign: 'center', padding: '20px 0' }}>Chưa có đơn đặt bánh.</div>
            ) : stats.recent_orders.map(o => (
              <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{o.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{o.cake_type || 'Bánh'} · {o.phone}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: (ORDER_STATUS[o.status] ?? { color: 'var(--warm)' }).color, fontWeight: 500 }}>
                    {(ORDER_STATUS[o.status] ?? { label: o.status }).label}
                  </span>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>
                    {new Date(o.created_at).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent contacts */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Liên hệ gần đây</div>
            <Link to="/contacts" style={{ fontSize: 12, color: 'var(--accent)' }}>Xem tất cả →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {stats.recent_contacts.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--text-3)', textAlign: 'center', padding: '20px 0' }}>Chưa có liên hệ nào.</div>
            ) : stats.recent_contacts.map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{c.subject || 'Liên hệ'} · {c.email}</div>
                </div>
                <span className={`badge badge-${c.status}`} style={{ fontSize: 11 }}>
                  {c.status === 'new' ? 'Mới' : c.status === 'read' ? 'Đã đọc' : 'Đã trả lời'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="card" style={{ marginTop: 24, background: 'var(--accent-light)', border: 'none' }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Thao tác nhanh</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/slides" className="btn-ghost btn-sm">🖼 Quản lý slides</Link>
          <Link to="/products/new" className="btn-ghost btn-sm">+ Thêm sản phẩm</Link>
          <Link to="/gallery" className="btn-ghost btn-sm">📸 Thư viện ảnh</Link>
          <Link to="/settings" className="btn-ghost btn-sm">⚙ Cài đặt website</Link>
        </div>
      </div>
    </div>
  )
}
