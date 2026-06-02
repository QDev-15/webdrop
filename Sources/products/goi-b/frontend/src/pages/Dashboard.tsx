import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Stats {
  posts: number; pages: number; contacts: number
  new_contacts: number; media: number; banners: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    api.get<Stats>('/stats').then(setStats).catch(() => {})
  }, [])

  const s = stats

  return (
    <div>
      <div className="row g-3 mb-4">
        {[
          { label: 'Bài viết', val: s?.posts, icon: '✏', to: '/posts' },
          { label: 'Trang', val: s?.pages, icon: '📄', to: '/pages' },
          { label: 'Liên hệ mới', val: s?.new_contacts, icon: '✉', to: '/contacts' },
          { label: 'Media', val: s?.media, icon: '📸', to: '/media' },
        ].map(card => (
          <div className="col-6 col-md-3" key={card.label}>
            <Link to={card.to} style={{ textDecoration: 'none' }}>
              <div className="stat-card d-flex align-items-center gap-3">
                <span className="stat-icon">{card.icon}</span>
                <div>
                  <div className="stat-val">{card.val ?? '—'}</div>
                  <div className="stat-label">{card.label}</div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <div className="admin-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 style={{ margin: 0, fontWeight: 600 }}>Thao tác nhanh</h6>
            </div>
            <div className="d-flex flex-column gap-2">
              <Link to="/posts/new" className="btn-accent" style={{ textDecoration: 'none', textAlign: 'center', padding: '9px', borderRadius: 8 }}>
                + Viết bài mới
              </Link>
              <Link to="/pages/new" className="btn-ghost" style={{ textDecoration: 'none', textAlign: 'center' }}>
                + Tạo trang mới
              </Link>
              <Link to="/media" className="btn-ghost" style={{ textDecoration: 'none', textAlign: 'center' }}>
                + Upload ảnh
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="admin-card">
            <h6 style={{ margin: 0, fontWeight: 600, marginBottom: 12 }}>Thông tin hệ thống</h6>
            <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 2 }}>
              <div>📦 Gói B — Website chuẩn</div>
              <div>🗄 SQLite Database</div>
              <div>🌐 PHP API</div>
              <div>⚛ React SPA</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
