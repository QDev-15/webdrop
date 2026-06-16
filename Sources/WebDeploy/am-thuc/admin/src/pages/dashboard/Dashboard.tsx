import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  total_reservations: number
  pending_reservations: number
  total_contacts: number
  new_contacts: number
  total_menu_items: number
  total_gallery: number
  total_testimonials: number
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
    phone: string
    subject: string
    status: string
    created_at: string
  }>
}

const statusLabel: Record<string, { text: string; color: string }> = {
  pending:   { text: 'Chờ xác nhận', color: '#d97706' },
  confirmed: { text: 'Đã xác nhận', color: '#1a6b52' },
  cancelled: { text: 'Đã hủy',      color: '#e24b4a' },
  new:       { text: 'Mới',         color: '#1d4ed8' },
  read:      { text: 'Đã đọc',      color: '#6b6760' },
  replied:   { text: 'Đã trả lời',  color: '#1a6b52' },
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

  if (loading) {
    return <div style={{ padding: 32, color: 'var(--text-3)' }}>Đang tải...</div>
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Tổng quan hoạt động nhà hàng</p>
      </div>

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Đặt bàn chờ', value: stats?.pending_reservations ?? 0, total: stats?.total_reservations ?? 0, icon: '📅', link: '/reservations', accent: true },
          { label: 'Liên hệ mới', value: stats?.new_contacts ?? 0, total: stats?.total_contacts ?? 0, icon: '✉', link: '/contacts', accent: (stats?.new_contacts ?? 0) > 0 },
          { label: 'Món ăn', value: stats?.total_menu_items ?? 0, icon: '🍽', link: '/menu-items' },
          { label: 'Ảnh gallery', value: stats?.total_gallery ?? 0, icon: '🖼', link: '/gallery' },
        ].map((card) => (
          <Link key={card.label} to={card.link} style={{ textDecoration: 'none' }}>
            <div style={{
              background: card.accent ? 'var(--accent)' : 'var(--surface)',
              border: `1px solid ${card.accent ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 12,
              padding: '20px 22px',
              transition: 'all .2s',
            }}>
              <div style={{ fontSize: 22, marginBottom: 10 }}>{card.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: card.accent ? '#fff' : 'var(--text)', letterSpacing: -1 }}>{card.value}</div>
              <div style={{ fontSize: 12, color: card.accent ? 'rgba(255,255,255,.7)' : 'var(--text-3)', marginTop: 2 }}>
                {card.label}{card.total != null ? ` / ${card.total} tổng` : ''}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Recent reservations */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Đặt bàn gần đây</div>
            <Link to="/reservations" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>Xem tất cả</Link>
          </div>
          {(stats?.recent_reservations ?? []).length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--text-3)', textAlign: 'center', padding: '20px 0' }}>Chưa có đặt bàn nào</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stats?.recent_reservations.map((r) => {
                const s = statusLabel[r.status] ?? { text: r.status, color: '#6b6760' }
                return (
                  <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg)', borderRadius: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{r.date} {r.time} · {r.guests} người</div>
                    </div>
                    <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: s.color + '18', color: s.color, fontWeight: 500 }}>{s.text}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent contacts */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Liên hệ gần đây</div>
            <Link to="/contacts" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>Xem tất cả</Link>
          </div>
          {(stats?.recent_contacts ?? []).length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--text-3)', textAlign: 'center', padding: '20px 0' }}>Chưa có liên hệ nào</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stats?.recent_contacts.map((c) => {
                const s = statusLabel[c.status] ?? { text: c.status, color: '#6b6760' }
                return (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg)', borderRadius: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{c.subject || c.phone}</div>
                    </div>
                    <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: s.color + '18', color: s.color, fontWeight: 500 }}>{s.text}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
