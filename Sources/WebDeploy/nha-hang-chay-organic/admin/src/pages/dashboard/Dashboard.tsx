import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  menu_items: number
  menu_categories: number
  reservations: number
  pending_reservations: number
  contacts: number
  new_contacts: number
  testimonials: number
  gallery: number
  slides: number
  recent_reservations: RecentReservation[]
  recent_contacts: RecentContact[]
}

interface RecentReservation {
  id: number
  name: string
  phone: string
  date: string
  time: string
  guests: number
  status: string
  created_at: string
}

interface RecentContact {
  id: number
  name: string
  email: string
  phone: string
  subject: string
  status: string
  created_at: string
}

const statusLabel: Record<string, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  cancelled: 'Đã hủy',
  new: 'Mới',
  read: 'Đã đọc',
  replied: 'Đã trả lời',
}

const statusClass: Record<string, string> = {
  pending: 'badge badge-pending',
  confirmed: 'badge badge-confirmed',
  cancelled: 'badge badge-cancelled',
  new: 'badge badge-new',
  read: 'badge badge-read',
  replied: 'badge badge-replied',
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

  if (loading) return <div style={{ color: 'var(--text-3)', padding: '40px' }}>Đang tải...</div>
  if (!stats) return null

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Tổng quan hoạt động nhà hàng</div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div className="stat-card">
          <div className="stat-card-icon">🍽</div>
          <div className="stat-card-value">{stats.menu_items}</div>
          <div className="stat-card-label">Món ăn</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">📂</div>
          <div className="stat-card-value">{stats.menu_categories}</div>
          <div className="stat-card-label">Danh mục</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">📅</div>
          <div className="stat-card-value">{stats.pending_reservations}</div>
          <div className="stat-card-label">Đặt bàn chờ xác nhận</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">✉</div>
          <div className="stat-card-value">{stats.new_contacts}</div>
          <div className="stat-card-label">Liên hệ mới</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">⭐</div>
          <div className="stat-card-value">{stats.testimonials}</div>
          <div className="stat-card-label">Đánh giá</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">🖼</div>
          <div className="stat-card-value">{stats.gallery}</div>
          <div className="stat-card-label">Ảnh thư viện</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Recent reservations */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>Đặt bàn gần đây</div>
            <Link to="/reservations" style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}>Xem tất cả →</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Khách</th>
                  <th>Ngày / Giờ</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_reservations.length === 0 && (
                  <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-3)' }}>Chưa có đặt bàn</td></tr>
                )}
                {stats.recent_reservations.map(r => (
                  <tr key={r.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{r.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{r.phone}</div>
                    </td>
                    <td>
                      <div>{r.date}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{r.time} · {r.guests} người</div>
                    </td>
                    <td>
                      <span className={statusClass[r.status] || 'badge'}>{statusLabel[r.status] || r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent contacts */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>Liên hệ gần đây</div>
            <Link to="/contacts" style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}>Xem tất cả →</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Người gửi</th>
                  <th>Chủ đề</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_contacts.length === 0 && (
                  <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-3)' }}>Chưa có liên hệ</td></tr>
                )}
                {stats.recent_contacts.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{c.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{c.phone || c.email}</div>
                    </td>
                    <td style={{ fontSize: '13px', color: 'var(--text-2)' }}>{c.subject || '—'}</td>
                    <td>
                      <span className={statusClass[c.status] || 'badge'}>{statusLabel[c.status] || c.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
