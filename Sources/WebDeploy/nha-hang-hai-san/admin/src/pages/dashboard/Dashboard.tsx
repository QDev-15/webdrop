import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  reservations: number
  pending_reservations: number
  today_reservations: number
  contacts: number
  new_contacts: number
  menu_items: number
  hero_slides: number
  gallery_items: number
  recent_reservations: Array<{
    id: number
    name: string
    phone: string
    date: string
    time: string
    guests: number
    status: string
    created_at: string
  }>
  recent_contacts: Array<{
    id: number
    name: string
    email: string
    subject: string
    status: string
    created_at: string
  }>
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  cancelled: 'Đã hủy',
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
    { label: 'Đặt bàn hôm nay', value: stats.today_reservations, icon: '📅', to: '/reservations', accent: true },
    { label: 'Chờ xác nhận', value: stats.pending_reservations, icon: '⏳', to: '/reservations' },
    { label: 'Liên hệ mới', value: stats.new_contacts, icon: '✉', to: '/contacts' },
    { label: 'Tổng đặt bàn', value: stats.reservations, icon: '🦞', to: '/reservations' },
    { label: 'Món ăn', value: stats.menu_items, icon: '🍽', to: '/menu-items' },
    { label: 'Hero Slides', value: stats.hero_slides, icon: '🖼', to: '/slides' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Tổng quan nhà hàng Vị Biển Hải Sản</div>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Recent reservations */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Đặt bàn gần đây</div>
            <Link to="/reservations" style={{ fontSize: 12, color: 'var(--accent)' }}>Xem tất cả →</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Ngày & Giờ</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_reservations.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-3)', padding: '20px 0' }}>Chưa có đặt bàn nào.</td></tr>
                ) : (
                  stats.recent_reservations.map(r => (
                    <tr key={r.id}>
                      <td>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{r.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{r.phone} · {r.guests} người</div>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--text-2)' }}>
                        {r.date}<br />{r.time}
                      </td>
                      <td>
                        <span className={`badge badge-${r.status}`}>
                          {STATUS_LABEL[r.status] ?? r.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent contacts */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Liên hệ gần đây</div>
            <Link to="/contacts" style={{ fontSize: 12, color: 'var(--accent)' }}>Xem tất cả →</Link>
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
                {stats.recent_contacts.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-3)', padding: '20px 0' }}>Chưa có liên hệ nào.</td></tr>
                ) : (
                  stats.recent_contacts.map(c => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{c.email || '—'}</div>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--text-2)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.subject || '—'}
                      </td>
                      <td>
                        <span className={`badge badge-${c.status}`}>
                          {c.status === 'new' ? 'Mới' : c.status === 'read' ? 'Đã đọc' : 'Đã trả lời'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
