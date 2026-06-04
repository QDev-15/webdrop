import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Stats {
  contacts_total: number
  contacts_new: number
  services_total: number
  projects_total: number
  team_total: number
  testimonials_total: number
  recent_contacts: Array<{
    id: number
    name: string
    email: string
    service: string
    budget: string
    status: string
    created_at: string
  }>
}

const STATUS_CLASS: Record<string, string> = {
  new: 'badge-new',
  read: 'badge-read',
  replied: 'badge-replied',
}

const STATUS_LABEL: Record<string, string> = {
  new: 'Mới',
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

  if (loading) return <div style={{ color: 'var(--text-3)', fontSize: '14px' }}>Đang tải...</div>
  if (!stats) return null

  return (
    <>
      <div className="page-hd">
        <div>
          <h1 className="page-hd-title">Dashboard</h1>
          <div className="page-hd-sub">Tổng quan nội dung Agency Sáng Tạo</div>
        </div>
        <a href="/" target="_blank" className="btn btn-ghost btn-sm">Xem trang web →</a>
      </div>

      <div className="stats-grid">
        <div className="card">
          <div className="card-title">Brief / Liên hệ</div>
          <div className="stat-big">{stats.contacts_total}</div>
          {stats.contacts_new > 0 && (
            <div className="stat-sub" style={{ color: '#1d4ed8' }}>{stats.contacts_new} mới chưa đọc</div>
          )}
        </div>
        <div className="card">
          <div className="card-title">Dịch vụ</div>
          <div className="stat-big">{stats.services_total}</div>
          <div className="stat-sub">Đang kích hoạt</div>
        </div>
        <div className="card">
          <div className="card-title">Dự án / Portfolio</div>
          <div className="stat-big">{stats.projects_total}</div>
          <div className="stat-sub">Trong portfolio</div>
        </div>
        <div className="card">
          <div className="card-title">Đội ngũ</div>
          <div className="stat-big">{stats.team_total}</div>
          <div className="stat-sub">Thành viên hiển thị</div>
        </div>
      </div>

      {/* Quick links */}
      <div className="card mb-4" style={{ marginBottom: '20px' }}>
        <div className="card-title" style={{ marginBottom: '12px' }}>Quản lý nhanh</div>
        <div className="d-flex flex-wrap gap-2">
          <Link to="/services/new" className="btn btn-ghost btn-sm">+ Thêm dịch vụ</Link>
          <Link to="/projects/new" className="btn btn-ghost btn-sm">+ Thêm dự án</Link>
          <Link to="/team/new" className="btn btn-ghost btn-sm">+ Thêm thành viên</Link>
          <Link to="/testimonials/new" className="btn btn-ghost btn-sm">+ Thêm nhận xét</Link>
          <Link to="/settings" className="btn btn-ghost btn-sm">⚙ Cài đặt</Link>
        </div>
      </div>

      {/* Recent briefs */}
      <div className="card">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="card-title" style={{ margin: 0 }}>Brief mới nhất</div>
          <Link to="/contacts" className="btn btn-ghost btn-sm">Xem tất cả</Link>
        </div>

        {stats.recent_contacts.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-3)', margin: 0 }}>Chưa có brief nào.</p>
        ) : (
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Dịch vụ</th>
                  <th>Ngân sách</th>
                  <th>Trạng thái</th>
                  <th>Ngày</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_contacts.map((c) => (
                  <tr key={c.id}>
                    <td className="td-name">{c.name}</td>
                    <td>{c.email || '—'}</td>
                    <td>{c.service || '—'}</td>
                    <td>{c.budget || '—'}</td>
                    <td><span className={`badge ${STATUS_CLASS[c.status] || 'badge-read'}`}>{STATUS_LABEL[c.status] || c.status}</span></td>
                    <td>{new Date(c.created_at).toLocaleDateString('vi-VN')}</td>
                    <td><Link to={`/contacts/${c.id}`} className="btn btn-ghost btn-sm">Xem</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
