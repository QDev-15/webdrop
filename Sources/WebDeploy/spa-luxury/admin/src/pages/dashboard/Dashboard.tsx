import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  total_bookings: number
  new_bookings: number
  total_contacts: number
  new_contacts: number
  total_services: number
  total_testimonials: number
}

interface Booking {
  id: number
  name: string
  phone: string
  email: string
  service_name: string
  num_people: number
  preferred_date: string
  status: string
  created_at: string
}

const BOOKING_STATUS_LABELS: Record<string, string> = {
  new: 'Mới',
  confirmed: 'Đã xác nhận',
  cancelled: 'Đã hủy',
}

const STAT_CARDS = [
  { key: 'total_bookings', icon: '📅', label: 'Tổng đặt gói', accent: false },
  { key: 'new_bookings', icon: '🆕', label: 'Đặt gói mới', accent: true },
  { key: 'total_contacts', icon: '✉️', label: 'Tổng liên hệ', accent: false },
  { key: 'new_contacts', icon: '💬', label: 'Liên hệ mới', accent: true },
  { key: 'total_services', icon: '💆', label: 'Dịch vụ', accent: false },
  { key: 'total_testimonials', icon: '⭐', label: 'Đánh giá', accent: false },
] as const

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<Stats>('/stats'),
      api.get<Booking[]>('/bookings'),
    ])
      .then(([s, b]) => {
        setStats(s)
        setRecentBookings(b.slice(0, 5))
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Tổng quan</div>
          <div className="page-sub">Chào mừng bạn quay lại bảng quản trị</div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
        {STAT_CARDS.map(card => (
          <div key={card.key} className="stat-card" style={card.accent ? { borderColor: 'var(--accent-mid)', background: 'var(--accent-light)' } : {}}>
            <div className="stat-card-icon">{card.icon}</div>
            <div className="stat-card-value" style={card.accent ? { color: 'var(--accent)' } : {}}>
              {stats ? (stats[card.key] ?? 0) : '—'}
            </div>
            <div className="stat-card-label">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontWeight: 600, fontSize: 15 }}>Đặt gói gần đây</div>
        <Link to="/bookings" className="btn-ghost btn-sm">Xem tất cả</Link>
      </div>

      {recentBookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <div className="empty-state-text">Chưa có đặt gói nào.</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Gói đặt</th>
                <th>Số người</th>
                <th>Ngày ưu tiên</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(b => (
                <tr key={b.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{b.name}</div>
                    {b.phone && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{b.phone}</div>}
                  </td>
                  <td style={{ color: 'var(--text-2)' }}>{b.service_name || '—'}</td>
                  <td style={{ color: 'var(--text-2)' }}>{b.num_people || 1}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-3)' }}>
                    {b.preferred_date ? new Date(b.preferred_date).toLocaleDateString('vi-VN') : '—'}
                  </td>
                  <td>
                    <span className={`badge badge-${b.status}`}>
                      {BOOKING_STATUS_LABELS[b.status] ?? b.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-3)' }}>
                    {new Date(b.created_at).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
