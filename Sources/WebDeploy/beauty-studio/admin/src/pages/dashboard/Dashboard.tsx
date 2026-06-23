import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  total_bookings: number
  pending_bookings: number
  total_contacts: number
  new_contacts: number
  total_services: number
  total_team: number
  recent_bookings: Array<{
    id: number
    name: string
    phone: string
    service_group: string
    book_date: string
    book_time: string
    status: string
    created_at: string
  }>
}

const statusLabel: Record<string, string> = {
  pending:   'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  cancelled: 'Đã hủy',
  done:      'Hoàn thành',
}

const statusBadge: Record<string, string> = {
  pending:   'badge-pending',
  confirmed: 'badge-confirmed',
  cancelled: 'badge-cancelled',
  done:      'badge-published',
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

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Tổng quan</div>
          <div className="page-sub">Chào mừng đến với bảng điều khiển Beauty Studio</div>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16, marginBottom: 28 }}>
        <div className="stat-card">
          <div className="stat-card-icon">📅</div>
          <div className="stat-card-value">{stats?.total_bookings ?? 0}</div>
          <div className="stat-card-label">Tổng lịch hẹn</div>
        </div>
        <div className="stat-card" style={{ borderColor: stats?.pending_bookings ? 'var(--accent)' : undefined }}>
          <div className="stat-card-icon">⏳</div>
          <div className="stat-card-value" style={{ color: stats?.pending_bookings ? 'var(--accent)' : undefined }}>{stats?.pending_bookings ?? 0}</div>
          <div className="stat-card-label">Chờ xác nhận</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">✉</div>
          <div className="stat-card-value">{stats?.total_contacts ?? 0}</div>
          <div className="stat-card-label">Liên hệ</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">💄</div>
          <div className="stat-card-value">{stats?.total_services ?? 0}</div>
          <div className="stat-card-label">Dịch vụ</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">👥</div>
          <div className="stat-card-value">{stats?.total_team ?? 0}</div>
          <div className="stat-card-label">Stylist & Artist</div>
        </div>
      </div>

      {/* Recent bookings */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>Lịch hẹn gần đây</div>
          <Link to="/bookings" className="btn-ghost btn-sm">Xem tất cả</Link>
        </div>
        {(stats?.recent_bookings?.length ?? 0) === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <div className="empty-state-text">Chưa có lịch hẹn nào.</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Số điện thoại</th>
                  <th>Dịch vụ</th>
                  <th>Ngày & Giờ</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recent_bookings.map(b => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 500 }}>{b.name}</td>
                    <td>{b.phone}</td>
                    <td>{b.service_group}</td>
                    <td>{b.book_date} {b.book_time}</td>
                    <td>
                      <span className={`badge ${statusBadge[b.status] ?? 'badge-pending'}`}>
                        {statusLabel[b.status] ?? b.status}
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
      <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link to="/bookings"   className="btn-accent">📅 Quản lý lịch hẹn</Link>
        <Link to="/services"   className="btn-ghost">💄 Dịch vụ</Link>
        <Link to="/team"       className="btn-ghost">👥 Đội ngũ</Link>
        <Link to="/contacts"   className="btn-ghost">✉ Liên hệ</Link>
        <Link to="/settings"   className="btn-ghost">⚙ Cài đặt</Link>
      </div>
    </div>
  )
}
