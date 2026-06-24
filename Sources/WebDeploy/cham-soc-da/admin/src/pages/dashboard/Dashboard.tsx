import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  bookings: number
  new_bookings: number
  services: number
  team_members: number
  testimonials: number
  contacts: number
  new_contacts: number
  recent_bookings: Array<{
    id: number; name: string; phone: string; appt_date: string; appt_time: string; status: string; created_at: string
  }>
  recent_contacts: Array<{
    id: number; name: string; phone: string; subject: string; status: string; created_at: string
  }>
}

const STATUS_MAP: Record<string, string> = {
  new:       'Mới',
  confirmed: 'Đã xác nhận',
  done:      'Hoàn thành',
  cancelled: 'Đã hủy',
  read:      'Đã đọc',
  replied:   'Đã trả lời',
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Stats>('/stats')
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="page-loading">Đang tải...</div>
  if (!stats) return <div className="page-empty">Không thể tải dữ liệu.</div>

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-sub">Tổng quan hệ thống phòng khám</p>
      </div>

      {/* Stats cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon">📅</div>
          <div className="stat-card-body">
            <div className="stat-card-num">{stats.bookings}</div>
            <div className="stat-card-label">Tổng lịch hẹn</div>
            {stats.new_bookings > 0 && (
              <div className="stat-card-badge">{stats.new_bookings} mới</div>
            )}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">💉</div>
          <div className="stat-card-body">
            <div className="stat-card-num">{stats.services}</div>
            <div className="stat-card-label">Dịch vụ điều trị</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">👨‍⚕️</div>
          <div className="stat-card-body">
            <div className="stat-card-num">{stats.team_members}</div>
            <div className="stat-card-label">Bác sĩ</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">✉</div>
          <div className="stat-card-body">
            <div className="stat-card-num">{stats.contacts}</div>
            <div className="stat-card-label">Tin nhắn</div>
            {stats.new_contacts > 0 && (
              <div className="stat-card-badge">{stats.new_contacts} chưa đọc</div>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Recent bookings */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h3 className="dash-card-title">Lịch hẹn gần đây</h3>
            <Link to="/bookings" className="dash-card-link">Xem tất cả →</Link>
          </div>
          {stats.recent_bookings.length === 0 ? (
            <div className="dash-empty">Chưa có lịch hẹn nào.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Bệnh nhân</th>
                  <th>Điện thoại</th>
                  <th>Ngày hẹn</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_bookings.map(b => (
                  <tr key={b.id}>
                    <td>{b.name}</td>
                    <td>{b.phone}</td>
                    <td>{b.appt_date ? `${b.appt_date} ${b.appt_time ?? ''}`.trim() : '—'}</td>
                    <td>
                      <span className={`status-badge ${b.status}`}>
                        {STATUS_MAP[b.status] ?? b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent contacts */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h3 className="dash-card-title">Tin nhắn gần đây</h3>
            <Link to="/contacts" className="dash-card-link">Xem tất cả →</Link>
          </div>
          {stats.recent_contacts.length === 0 ? (
            <div className="dash-empty">Chưa có tin nhắn nào.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Điện thoại</th>
                  <th>Chủ đề</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_contacts.map(c => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.phone}</td>
                    <td>{c.subject ?? '—'}</td>
                    <td>
                      <span className={`status-badge ${c.status}`}>
                        {STATUS_MAP[c.status] ?? c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
