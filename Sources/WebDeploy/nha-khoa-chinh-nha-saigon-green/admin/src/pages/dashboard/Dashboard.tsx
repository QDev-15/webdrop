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
  recent_bookings: Array<{
    id: number
    full_name: string
    phone: string
    service_name: string
    status: string
    created_at: string
  }>
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Mới',
  confirmed: 'Đã xác nhận',
  completed: 'Hoàn thành',
  cancelled: 'Huỷ',
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

  if (loading) return <div className="admin-loading">Đang tải...</div>
  if (!stats) return <div className="empty-state"><div className="empty-state-text">Không thể tải dữ liệu.</div></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Tổng quan</div>
          <div className="page-sub">Chào mừng trở lại — Chỉnh Nha Sài Gòn Admin</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        <div className="stat-card">
          <div className="stat-card-icon">📅</div>
          <div className="stat-card-value">{stats.bookings}</div>
          <div className="stat-card-label">Tổng đặt lịch</div>
          {stats.new_bookings > 0 && (
            <div style={{ marginTop: 6, fontSize: 12, color: 'var(--danger)', fontWeight: 600 }}>
              {stats.new_bookings} mới chờ xử lý
            </div>
          )}
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">✉</div>
          <div className="stat-card-value">{stats.contacts}</div>
          <div className="stat-card-label">Liên hệ</div>
          {stats.new_contacts > 0 && (
            <div style={{ marginTop: 6, fontSize: 12, color: 'var(--danger)', fontWeight: 600 }}>
              {stats.new_contacts} chưa đọc
            </div>
          )}
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">✦</div>
          <div className="stat-card-value">{stats.services}</div>
          <div className="stat-card-label">Dịch vụ đang hoạt động</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">👨‍⚕️</div>
          <div className="stat-card-value">{stats.team}</div>
          <div className="stat-card-label">Bác sĩ chuyên khoa</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">★</div>
          <div className="stat-card-value">{stats.testimonials}</div>
          <div className="stat-card-label">Đánh giá khách hàng</div>
        </div>
      </div>

      {/* Recent bookings */}
      <div className="page-header" style={{ marginBottom: 12 }}>
        <div className="page-title" style={{ fontSize: 16 }}>Đặt lịch gần đây</div>
        <Link to="/bookings" className="btn-ghost btn-sm">Xem tất cả →</Link>
      </div>

      {stats.recent_bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <div className="empty-state-text">Chưa có đặt lịch nào.</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Dịch vụ quan tâm</th>
                <th>Trạng thái</th>
                <th>Ngày đặt</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent_bookings.map(b => (
                <tr key={b.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{b.full_name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{b.phone}</div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{b.service_name || '—'}</td>
                  <td>
                    <span className={`badge badge-${b.status}`}>
                      {STATUS_LABELS[b.status] ?? b.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-3)' }}>
                    {new Date(b.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td>
                    <Link to="/bookings" className="btn-ghost btn-sm">Xem</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Quick links */}
      <div style={{ marginTop: 28 }}>
        <div className="page-title" style={{ fontSize: 16, marginBottom: 12 }}>Truy cập nhanh</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link to="/services/new" className="btn-accent">+ Thêm dịch vụ</Link>
          <Link to="/team/new" className="btn-accent">+ Thêm bác sĩ</Link>
          <Link to="/slides/new" className="btn-accent">+ Thêm slide</Link>
          <Link to="/testimonials/new" className="btn-accent">+ Thêm đánh giá</Link>
          <Link to="/settings" className="btn-ghost">⚙ Cài đặt website</Link>
        </div>
      </div>
    </div>
  )
}
