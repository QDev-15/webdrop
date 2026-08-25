import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface RecentContact {
  id: number
  name: string
  phone: string
  subject: string
  status: string
  created_at: string
}

interface Stats {
  unit_types: number
  unit_available: number
  amenities: number
  faqs: number
  testimonials: number
  contacts_total: number
  contacts_new: number
  hero_slides: number
  recent_contacts: RecentContact[]
}

const STATUS_LABELS: Record<string, string> = { new: 'Mới', read: 'Đã đọc', replied: 'Đã trả lời' }

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Stats>('/stats').then(setStats).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="admin-loading">Đang tải...</div>
  if (!stats) return null

  const cards = [
    { icon: '🏢', label: 'Loại căn hộ', value: stats.unit_types, sub: `${stats.unit_available} còn hàng`, color: '#e8f4ef', to: '/unit-types' },
    { icon: '🏊', label: 'Tiện ích nội khu', value: stats.amenities, to: '/amenities' },
    { icon: '❓', label: 'Câu hỏi thường gặp', value: stats.faqs, to: '/faqs' },
    { icon: '💬', label: 'Đánh giá khách hàng', value: stats.testimonials, to: '/testimonials' },
    { icon: '🖼', label: 'Hero Slides', value: stats.hero_slides, to: '/slides' },
    { icon: '✉', label: 'Liên hệ', value: stats.contacts_total, sub: `${stats.contacts_new} mới`, color: stats.contacts_new ? '#fff0f0' : undefined, to: '/contacts' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Tổng quan dự án Green Valley Residence</div>
        </div>
      </div>

      <div className="stats-grid">
        {cards.map(c => (
          <Link key={c.label} to={c.to} className="stat-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="stat-card-icon" style={{ background: c.color || 'var(--accent-light)' }}>{c.icon}</div>
            <div className="stat-card-value">{c.value}</div>
            <div className="stat-card-label">{c.label}{c.sub ? ` · ${c.sub}` : ''}</div>
          </Link>
        ))}
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>Liên hệ gần đây</div>
          <Link to="/contacts" className="btn-ghost btn-sm">Xem tất cả</Link>
        </div>
        {stats.recent_contacts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✉</div>
            <div className="empty-state-text">Chưa có liên hệ nào.</div>
          </div>
        ) : (
          <div className="table-wrap" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr><th>Họ tên</th><th>SĐT</th><th>Chủ đề</th><th>Trạng thái</th><th>Ngày gửi</th></tr>
              </thead>
              <tbody>
                {stats.recent_contacts.map(c => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.phone || '—'}</td>
                    <td>{c.subject || '—'}</td>
                    <td><span className={`badge badge-${c.status}`}>{STATUS_LABELS[c.status] ?? c.status}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{new Date(c.created_at).toLocaleDateString('vi-VN')}</td>
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
