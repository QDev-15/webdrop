import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Stats {
  total_services: number
  total_projects: number
  total_testimonials: number
  total_contacts: number
  new_contacts: number
  recent_contacts: Array<{
    id: number
    name: string
    phone: string
    construction_type: string
    status: string
    created_at: string
  }>
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Stats>('/stats').then(setStats).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Đang tải...</p>
      </div>
    </div>
  )

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Tổng quan hệ thống quản trị Công Ty Xây Dựng</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-card-label">Dịch vụ</div>
          <div className="stat-card-value">{stats?.total_services ?? 0}</div>
          <div className="stat-card-sub"><Link to="/services" style={{ color: 'var(--accent)', fontSize: 12 }}>Quản lý →</Link></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Dự án / Công trình</div>
          <div className="stat-card-value">{stats?.total_projects ?? 0}</div>
          <div className="stat-card-sub"><Link to="/projects" style={{ color: 'var(--accent)', fontSize: 12 }}>Quản lý →</Link></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Đánh giá khách hàng</div>
          <div className="stat-card-value">{stats?.total_testimonials ?? 0}</div>
          <div className="stat-card-sub"><Link to="/testimonials" style={{ color: 'var(--accent)', fontSize: 12 }}>Quản lý →</Link></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Yêu cầu báo giá mới</div>
          <div className="stat-card-value stat-card-accent">{stats?.new_contacts ?? 0}</div>
          <div className="stat-card-sub"><Link to="/contacts" style={{ color: 'var(--accent)', fontSize: 12 }}>Xem tất cả →</Link></div>
        </div>
      </div>

      {/* Recent contacts */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Yêu cầu báo giá gần đây</h2>
          <Link to="/contacts" className="btn btn-ghost btn-sm">Xem tất cả</Link>
        </div>
        {stats?.recent_contacts && stats.recent_contacts.length > 0 ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Điện thoại</th>
                  <th>Loại công trình</th>
                  <th>Trạng thái</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_contacts.map(c => (
                  <tr key={c.id}>
                    <td><Link to={`/contacts/${c.id}`} style={{ color: 'var(--accent)', fontWeight: 500 }}>{c.name}</Link></td>
                    <td>{c.phone}</td>
                    <td>{c.construction_type || '—'}</td>
                    <td>
                      <span className={`badge badge-${c.status}`}>{
                        c.status === 'new' ? 'Mới' :
                        c.status === 'read' ? 'Đã xem' : 'Đã trả lời'
                      }</span>
                    </td>
                    <td style={{ color: 'var(--text-3)' }}>{fmtDate(c.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-text">Chưa có yêu cầu báo giá nào.</div>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-3 mt-16">
        <Link to="/services/new" className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'border-color .15s' }}>
          <span style={{ fontSize: 24 }}>🔨</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Thêm dịch vụ mới</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Thi công, thiết kế, tư vấn...</div>
          </div>
        </Link>
        <Link to="/projects/new" className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'border-color .15s' }}>
          <span style={{ fontSize: 24 }}>🏗</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Thêm dự án mới</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Portfolio công trình</div>
          </div>
        </Link>
        <Link to="/settings" className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'border-color .15s' }}>
          <span style={{ fontSize: 24 }}>⚙</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Cài đặt website</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Thông tin, SEO, mạng xã hội</div>
          </div>
        </Link>
      </div>
    </div>
  )
}
