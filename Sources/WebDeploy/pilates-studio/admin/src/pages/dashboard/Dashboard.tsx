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
  total_team: number
  recent_bookings: Array<{
    id: number
    name: string
    phone: string
    class_type: string
    status: string
    created_at: string
  }>
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Mới',
  contacted: 'Đã liên hệ',
  confirmed: 'Đã xác nhận',
  cancelled: 'Đã hủy',
}

const STATUS_BADGE: Record<string, string> = {
  new: 'badge-new',
  contacted: 'badge-pending',
  confirmed: 'badge-confirmed',
  cancelled: 'badge-cancelled',
}

const CLASS_LABELS: Record<string, string> = {
  mat: 'Mat Pilates',
  reformer: 'Reformer Pilates',
  clinical: 'Clinical Pilates',
  prenatal: 'Prenatal Pilates',
  trial: 'Dùng thử miễn phí',
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Stats>('/stats')
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="admin-loading">Đang tải...</div>
  if (!stats) return <div className="admin-loading">Không tải được dữ liệu.</div>

  const statCards = [
    { icon: '📅', label: 'Tổng đăng ký', value: stats.total_bookings, sub: `${stats.new_bookings} mới`, link: '/bookings', color: '#1a6b52' },
    { icon: '✉️', label: 'Liên hệ',      value: stats.total_contacts, sub: `${stats.new_contacts} chưa đọc`, link: '/contacts', color: '#d97706' },
    { icon: '🧘', label: 'Lớp học',      value: stats.total_services, sub: 'dịch vụ đang hoạt động',  link: '/services', color: '#6366f1' },
    { icon: '👥', label: 'Huấn luyện viên', value: stats.total_team, sub: 'đang hoạt động', link: '/team', color: '#0891b2' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Tổng quan</div>
          <div className="page-sub">Chào mừng trở lại — đây là tình hình hiện tại của studio.</div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        {statCards.map(c => (
          <Link to={c.link} key={c.label} style={{ textDecoration: 'none' }}>
            <div className="stat-card" style={{ cursor: 'pointer', transition: 'box-shadow .15s' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,.08)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '')}
            >
              <div className="stat-card-icon">{c.icon}</div>
              <div className="stat-card-value" style={{ color: c.color }}>{c.value}</div>
              <div className="stat-card-label">{c.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>{c.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>Đăng ký gần đây</div>
          <Link to="/bookings" className="btn-ghost btn-sm">Xem tất cả</Link>
        </div>

        {stats.recent_bookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <div className="empty-state-text">Chưa có đăng ký nào.</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Học viên</th>
                  <th>Loại lớp</th>
                  <th>Trạng thái</th>
                  <th>Ngày đăng ký</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_bookings.map(b => (
                  <tr key={b.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{b.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{b.phone}</div>
                    </td>
                    <td style={{ fontSize: 13 }}>{CLASS_LABELS[b.class_type] ?? b.class_type ?? '—'}</td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[b.status] ?? ''}`}>
                        {STATUS_LABELS[b.status] ?? b.status}
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
    </div>
  )
}
