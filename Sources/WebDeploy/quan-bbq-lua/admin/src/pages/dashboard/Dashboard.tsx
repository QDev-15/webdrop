import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  menu_items: number
  menu_categories: number
  reservations: number
  pending_reservations: number
  confirmed_reservations: number
  contacts: number
  new_contacts: number
  gallery_items: number
  testimonials: number
  recent_reservations: RecentReservation[]
}

interface RecentReservation {
  name: string
  phone: string
  date: string
  time: string
  guests: number
  table_type: string
  status: string
  created_at: string
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  cancelled: 'Đã hủy',
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#d97706',
  confirmed: 'var(--accent)',
  cancelled: 'var(--danger)',
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<Stats>('/stats')
      .then(setStats)
      .catch(() => setError('Không tải được thống kê. Vui lòng thử lại.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="admin-loading">Đang tải...</div>
  if (error) return (
    <div>
      <div className="page-header">
        <div className="page-title">Dashboard</div>
      </div>
      <div className="alert alert-error">{error}</div>
    </div>
  )
  if (!stats) return null

  const cards = [
    { label: 'Món ăn', value: stats.menu_items, icon: '🥩', link: '/menu-items', color: '#c2410c' },
    { label: 'Danh mục thực đơn', value: stats.menu_categories, icon: '📂', link: '/menu-categories', color: '#9a3412' },
    { label: 'Đặt bàn', value: stats.reservations, icon: '📅', link: '/reservations', color: '#16a34a' },
    { label: 'Chờ xác nhận', value: stats.pending_reservations, icon: '⏳', link: '/reservations', color: '#d97706' },
    { label: 'Ảnh gallery', value: stats.gallery_items, icon: '🖼', link: '/gallery', color: '#7c3aed' },
    { label: 'Đánh giá', value: stats.testimonials, icon: '⭐', link: '/testimonials', color: '#f59e0b' },
    { label: 'Liên hệ', value: stats.contacts, icon: '✉', link: '/contacts', color: '#0891b2' },
    { label: 'Liên hệ mới', value: stats.new_contacts, icon: '🔔', link: '/contacts', color: '#dc2626' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Tổng quan hoạt động BBQ Lửa Hồng</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
        {cards.map(card => (
          <Link key={card.label} to={card.link} style={{ textDecoration: 'none' }}>
            <div className="card stat-card" style={{ borderLeft: `4px solid ${card.color}`, cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 24 }}>{card.icon}</span>
                <span style={{ fontSize: 28, fontWeight: 700, color: card.color }}>{card.value}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>{card.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Reservations */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>Đặt bàn gần đây</div>
          <Link to="/reservations" style={{ fontSize: 13, color: 'var(--accent)' }}>Xem tất cả →</Link>
        </div>
        {stats.recent_reservations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <div className="empty-state-text">Chưa có đặt bàn nào.</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Ngày & Giờ</th>
                  <th>Số khách</th>
                  <th>Loại bàn</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_reservations.map((r, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{r.phone}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{r.date}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{r.time}</div>
                    </td>
                    <td>{r.guests} người</td>
                    <td style={{ fontSize: 12, color: 'var(--text-2)' }}>{r.table_type || '—'}</td>
                    <td>
                      <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 8px', borderRadius: 5, background: `${STATUS_COLORS[r.status]}22`, color: STATUS_COLORS[r.status] }}>
                        {STATUS_LABELS[r.status] ?? r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 12 }}>Thao tác nhanh</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link to="/menu-items/new" className="btn-accent btn-sm" style={{ textAlign: 'center' }}>+ Thêm món ăn</Link>
            <Link to="/reservations" className="btn-ghost btn-sm" style={{ textAlign: 'center' }}>Xem đặt bàn chờ ({stats.pending_reservations})</Link>
            <Link to="/gallery" className="btn-ghost btn-sm" style={{ textAlign: 'center' }}>Quản lý ảnh gallery</Link>
          </div>
        </div>
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 12 }}>Thông tin nhanh</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--text-2)' }}>Combo & Set:</span>
              <span style={{ fontWeight: 500 }}>4 combo</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--text-2)' }}>Danh mục thực đơn:</span>
              <span style={{ fontWeight: 500 }}>{stats.menu_categories}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--text-2)' }}>Đặt bàn đã xác nhận:</span>
              <span style={{ fontWeight: 500, color: 'var(--accent)' }}>{stats.confirmed_reservations}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--text-2)' }}>Tin nhắn mới:</span>
              <span style={{ fontWeight: 500, color: stats.new_contacts > 0 ? '#dc2626' : undefined }}>{stats.new_contacts}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
