import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../contexts/AuthContext'

interface Stats {
  contacts: number
  new_contacts: number
  services: number
  team_members: number
  testimonials: number
  hero_slides: number
  recent_contacts: Array<{ id: number; name: string; phone: string; email: string; service: string; status: string; created_at: string }>
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Stats>('/stats').then(setStats).catch(console.error).finally(() => setLoading(false))
  }, [])

  const statusBadge = (status: string) => {
    const map: Record<string, string> = { new: 'badge-info', read: 'badge-muted', replied: 'badge-success' }
    const label: Record<string, string> = { new: 'Mới', read: 'Đã đọc', replied: 'Đã trả lời' }
    return <span className={`badge ${map[status] || 'badge-muted'}`}>{label[status] || status}</span>
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)', marginBottom: '4px' }}>Xin chào, {user?.name}!</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>Tổng quan hoạt động website tư vấn tài chính</p>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-3)' }}>Đang tải...</p>
      ) : stats ? (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-label">Liên hệ mới</div>
              <div className="stat-value accent">{stats.new_contacts}</div>
              <div className="stat-desc">Chờ xử lý</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Tổng liên hệ</div>
              <div className="stat-value">{stats.contacts}</div>
              <div className="stat-desc">Đặt lịch tư vấn</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Dịch vụ</div>
              <div className="stat-value">{stats.services}</div>
              <div className="stat-desc">Đang hiển thị</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Chuyên gia</div>
              <div className="stat-value">{stats.team_members}</div>
              <div className="stat-desc">Đang hiển thị</div>
            </div>
          </div>

          {/* Quick links */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {[
              { to: '/slides', label: 'Quản lý Slides', icon: '🖼' },
              { to: '/services', label: 'Dịch vụ', icon: '💼' },
              { to: '/team', label: 'Đội ngũ', icon: '👥' },
              { to: '/contacts', label: 'Liên hệ', icon: '✉' },
              { to: '/settings', label: 'Cài đặt', icon: '⚙' },
            ].map(link => (
              <Link key={link.to} to={link.to} className="card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', padding: '14px' }}>
                <span style={{ fontSize: '20px' }}>{link.icon}</span>
                <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text)' }}>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Recent contacts */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Liên hệ gần đây</span>
              <Link to="/contacts" className="btn btn-ghost btn-sm">Xem tất cả</Link>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Khách hàng</th>
                    <th>Điện thoại</th>
                    <th>Dịch vụ</th>
                    <th>Trạng thái</th>
                    <th>Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_contacts.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-3)', padding: '20px' }}>Chưa có liên hệ</td></tr>
                  ) : stats.recent_contacts.map(c => (
                    <tr key={c.id}>
                      <td>
                        <Link to={`/contacts/${c.id}`} style={{ color: 'var(--accent)', fontWeight: '500' }}>{c.name}</Link>
                        {c.email && <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{c.email}</div>}
                      </td>
                      <td>{c.phone || '—'}</td>
                      <td style={{ fontSize: '12px' }}>{c.service || '—'}</td>
                      <td>{statusBadge(c.status)}</td>
                      <td style={{ fontSize: '12px', color: 'var(--text-3)' }}>{new Date(c.created_at).toLocaleDateString('vi-VN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <p style={{ color: 'var(--text-3)' }}>Không thể tải dữ liệu.</p>
      )}
    </div>
  )
}
