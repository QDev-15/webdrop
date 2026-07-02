import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  bookings: number
  new_bookings: number
  contacts: number
  new_contacts: number
  services: number
  team: number
  testimonials: number
  recent_bookings: RecentBooking[]
}

interface RecentBooking {
  id: number
  full_name: string
  phone: string
  service_name: string
  status: string
  created_at: string
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Mới', confirmed: 'Đã xác nhận', completed: 'Hoàn thành', cancelled: 'Đã hủy',
}
const STATUS_BADGE: Record<string, string> = {
  new: 'badge-new', confirmed: 'badge-confirmed', completed: 'badge-published', cancelled: 'badge-cancelled',
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Stats>('/stats')
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="admin-loading">Đang tải...</div>
  if (!stats) return null

  const cards = [
    { icon: '📅', label: 'Lịch đặt mới', value: stats.new_bookings, to: '/bookings' },
    { icon: '📋', label: 'Tổng lượt đặt lịch', value: stats.bookings, to: '/bookings' },
    { icon: '✂', label: 'Dịch vụ đang hiện', value: stats.services, to: '/services' },
    { icon: '💈', label: 'Stylist', value: stats.team, to: '/team' },
    { icon: '★', label: 'Đánh giá', value: stats.testimonials, to: '/testimonials' },
    { icon: '✉', label: 'Liên hệ mới', value: stats.new_contacts, to: '/contacts' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Tổng quan hoạt động tiệm tóc</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
        {cards.map(c => (
          <Link key={c.label} to={c.to} className="stat-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div className="stat-card-icon">{c.icon}</div>
            <div className="stat-card-value">{c.value}</div>
            <div className="stat-card-label">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>Lịch đặt gần đây</div>
          <Link to="/bookings" className="btn-ghost btn-sm">Xem tất cả</Link>
        </div>

        {stats.recent_bookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <div className="empty-state-text">Chưa có lịch đặt nào.</div>
          </div>
        ) : (
          <div className="table-wrap" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Điện thoại</th>
                  <th>Dịch vụ</th>
                  <th>Trạng thái</th>
                  <th>Ngày đặt</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_bookings.map(b => (
                  <tr key={b.id}>
                    <td>{b.full_name}</td>
                    <td>{b.phone}</td>
                    <td style={{ color: 'var(--text-2)' }}>{b.service_name || '—'}</td>
                    <td><span className={`badge ${STATUS_BADGE[b.status] ?? ''}`}>{STATUS_LABELS[b.status] ?? b.status}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{new Date(b.created_at).toLocaleDateString('vi-VN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
