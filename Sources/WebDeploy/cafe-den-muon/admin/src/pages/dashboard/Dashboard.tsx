import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  contacts: number
  new_contacts: number
  menu_items: number
  hero_slides: number
  gallery_items: number
  testimonials: number
  faqs: number
  recent_contacts: Array<{
    id: number
    name: string
    phone: string
    subject: string
    status: string
    created_at: string
  }>
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
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="admin-loading">Đang tải...</div>
  if (!stats) return <div className="admin-loading">Không tải được dữ liệu.</div>

  const cards = [
    { label: 'Liên hệ mới', value: stats.new_contacts, icon: '✉', to: '/contacts', accent: true },
    { label: 'Tổng liên hệ', value: stats.contacts, icon: '📨', to: '/contacts' },
    { label: 'Món & thức uống', value: stats.menu_items, icon: '☕', to: '/menu-items' },
    { label: 'Ảnh không gian', value: stats.gallery_items, icon: '📸', to: '/gallery' },
    { label: 'Đánh giá', value: stats.testimonials, icon: '⭐', to: '/testimonials' },
    { label: 'Hero Slides', value: stats.hero_slides, icon: '🖼', to: '/slides' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Tổng quan NOX Coffee — Cà phê đêm muộn</div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {cards.map(card => (
          <Link
            key={card.label}
            to={card.to}
            style={{ textDecoration: 'none' }}
          >
            <div
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                transition: 'box-shadow .2s',
                borderLeft: card.accent ? '3px solid var(--accent)' : undefined,
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: card.accent ? 'var(--accent-light)' : 'var(--warm)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>
                {card.icon}
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: card.accent ? 'var(--accent)' : 'var(--text)', lineHeight: 1 }}>
                  {card.value}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 3 }}>{card.label}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent contacts */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Liên hệ / Đặt bàn gần đây</div>
          <Link to="/contacts" style={{ fontSize: 12, color: 'var(--accent)' }}>Xem tất cả →</Link>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Người gửi</th>
                <th>Chủ đề</th>
                <th>Trạng thái</th>
                <th>Ngày gửi</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent_contacts.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-3)', padding: '20px 0' }}>Chưa có liên hệ nào.</td></tr>
              ) : (
                stats.recent_contacts.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{c.phone || '—'}</div>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-2)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.subject || '—'}
                    </td>
                    <td>
                      <span className={`badge badge-${c.status}`}>
                        {STATUS_LABEL[c.status] ?? c.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{new Date(c.created_at).toLocaleDateString('vi-VN')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
