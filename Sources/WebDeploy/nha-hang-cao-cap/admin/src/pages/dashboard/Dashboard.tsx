import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  reservations_total: number
  reservations_pending: number
  reservations_today: number
  contacts_new: number
  contacts_total: number
  menu_items: number
  menu_categories: number
  gallery_items: number
  testimonials: number
  hero_slides: number
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

  if (loading) return <div className="admin-loading">Dang tai...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Tong quan</div>
          <div className="page-sub">Chao mung ban tro lai voi Fine Dining Admin</div>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div className="stat-card">
          <div className="stat-card-icon">📅</div>
          <div className="stat-card-value">{stats?.reservations_pending ?? 0}</div>
          <div className="stat-card-label">Dat ban cho xu ly</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">📆</div>
          <div className="stat-card-value">{stats?.reservations_today ?? 0}</div>
          <div className="stat-card-label">Dat ban hom nay</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">✉</div>
          <div className="stat-card-value">{stats?.contacts_new ?? 0}</div>
          <div className="stat-card-label">Lien he moi</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">🍽</div>
          <div className="stat-card-value">{stats?.menu_items ?? 0}</div>
          <div className="stat-card-label">Mon an</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">🖼</div>
          <div className="stat-card-value">{stats?.gallery_items ?? 0}</div>
          <div className="stat-card-label">Anh thu vien</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">⭐</div>
          <div className="stat-card-value">{stats?.testimonials ?? 0}</div>
          <div className="stat-card-label">Danh gia</div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>Thao tac nhanh</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/reservations" className="btn-accent">📅 Xem dat ban</Link>
          <Link to="/menu-items/new" className="btn-ghost">➕ Them mon an</Link>
          <Link to="/gallery" className="btn-ghost">📸 Quan ly anh</Link>
          <Link to="/contacts" className="btn-ghost">✉ Xem lien he</Link>
          <Link to="/settings" className="btn-ghost">⚙ Cai dat</Link>
        </div>
      </div>

      {/* Info cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>Thuc don</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Danh muc</span>
            <span style={{ fontSize: 15, fontWeight: 600 }}>{stats?.menu_categories ?? 0}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
            <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Mon an</span>
            <span style={{ fontSize: 15, fontWeight: 600 }}>{stats?.menu_items ?? 0}</span>
          </div>
          <Link to="/menu-items" className="btn-ghost btn-sm" style={{ marginTop: 8 }}>Quan ly thuc don</Link>
        </div>

        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>Dat ban</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Cho xu ly</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--accent)' }}>{stats?.reservations_pending ?? 0}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
            <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Tong dat ban</span>
            <span style={{ fontSize: 15, fontWeight: 600 }}>{stats?.reservations_total ?? 0}</span>
          </div>
          <Link to="/reservations" className="btn-ghost btn-sm" style={{ marginTop: 8 }}>Xem tat ca</Link>
        </div>

        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>Noi dung</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Hero Slides</span>
            <span style={{ fontSize: 15, fontWeight: 600 }}>{stats?.hero_slides ?? 0}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
            <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Danh gia</span>
            <span style={{ fontSize: 15, fontWeight: 600 }}>{stats?.testimonials ?? 0}</span>
          </div>
          <Link to="/slides" className="btn-ghost btn-sm" style={{ marginTop: 8 }}>Quan ly noi dung</Link>
        </div>
      </div>
    </div>
  )
}
