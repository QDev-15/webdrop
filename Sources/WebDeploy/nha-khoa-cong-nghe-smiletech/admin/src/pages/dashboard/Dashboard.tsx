import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  total_services: number
  total_bookings: number
  new_bookings: number
  total_contacts: number
  new_contacts: number
  total_team: number
  total_testimonials: number
  recent_bookings: Booking[]
  recent_contacts: Contact[]
}

interface Booking {
  id: number
  name: string
  phone: string
  service: string
  date: string
  time_slot: string
  status: string
  created_at: string
}

interface Contact {
  id: number
  name: string
  phone: string
  subject: string
  status: string
  created_at: string
}

const STATUS_LABEL: Record<string, string> = {
  new: 'Mới',
  confirmed: 'Đã xác nhận',
  completed: 'Hoàn thành',
  cancelled: 'Đã huỷ',
  read: 'Đã đọc',
  replied: 'Đã trả lời',
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
  if (!stats) return <div className="admin-error">Không tải được dữ liệu.</div>

  return (
    <div className="page-wrap">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-sub">Tổng quan hoạt động SmileTech</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🦷</div>
          <div className="stat-info">
            <div className="stat-num">{stats.total_services}</div>
            <div className="stat-label">Dịch vụ</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <div className="stat-num">{stats.total_bookings}</div>
            <div className="stat-label">Lịch hẹn</div>
          </div>
          {stats.new_bookings > 0 && (
            <div className="stat-badge">{stats.new_bookings} mới</div>
          )}
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨‍⚕️</div>
          <div className="stat-info">
            <div className="stat-num">{stats.total_team}</div>
            <div className="stat-label">Bác sĩ</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✉</div>
          <div className="stat-info">
            <div className="stat-num">{stats.total_contacts}</div>
            <div className="stat-label">Liên hệ</div>
          </div>
          {stats.new_contacts > 0 && (
            <div className="stat-badge">{stats.new_contacts} mới</div>
          )}
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Lịch hẹn gần đây</h2>
            <Link to="/bookings" className="btn btn-sm btn-ghost">Xem tất cả</Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Dịch vụ</th>
                <th>Ngày / Giờ</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent_bookings.length === 0 ? (
                <tr><td colSpan={4} className="empty-row">Chưa có lịch hẹn nào.</td></tr>
              ) : stats.recent_bookings.map(b => (
                <tr key={b.id}>
                  <td>
                    <div className="fw-600">{b.name}</div>
                    <div className="text-muted">{b.phone}</div>
                  </td>
                  <td>{b.service || '—'}</td>
                  <td>
                    {b.date ? <div>{b.date}</div> : '—'}
                    {b.time_slot && <div className="text-muted">{b.time_slot}</div>}
                  </td>
                  <td><span className={`status-dot status-${b.status}`}>{STATUS_LABEL[b.status] ?? b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Liên hệ gần đây</h2>
            <Link to="/contacts" className="btn btn-sm btn-ghost">Xem tất cả</Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Chủ đề</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent_contacts.length === 0 ? (
                <tr><td colSpan={3} className="empty-row">Chưa có liên hệ nào.</td></tr>
              ) : stats.recent_contacts.map(c => (
                <tr key={c.id}>
                  <td>
                    <div className="fw-600">{c.name}</div>
                    <div className="text-muted">{c.phone}</div>
                  </td>
                  <td>{c.subject || '—'}</td>
                  <td><span className={`status-dot status-${c.status}`}>{STATUS_LABEL[c.status] ?? c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
