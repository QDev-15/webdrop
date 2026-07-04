import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Service {
  id: number
  number: string
  name: string
  description: string
  duration: string
  price: string
  badge: string
  is_featured: number
  sort_order: number
}

// Fallback icons by index
const ICONS = [
  <svg key="0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12h16M4 12a4 4 0 014-4h8a4 4 0 014 4M4 12a4 4 0 004 4h8a4 4 0 004-4"/></svg>,
  <svg key="1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/></svg>,
  <svg key="2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="7" width="18" height="10" rx="2"/><path d="M7 11v2M17 11v2"/></svg>,
  <svg key="3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l9 4.5v9L12 20l-9-4.5v-9L12 2z"/></svg>,
  <svg key="4" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7h-9M14 17H5M17 3v8M7 13v8"/></svg>,
  <svg key="5" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="1"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
]

interface Props {
  limit?: number
  featured?: boolean
}

export default function Services({ limit, featured = false }: Props) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Service[]>('/public/services')
      .then(data => {
        let list = data
        if (featured) list = list.filter(s => s.is_featured)
        if (limit) list = list.slice(0, limit)
        setServices(list)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [limit, featured])

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div>

  return (
    <div className="cn-svc-grid">
      {services.map((s, idx) => (
        <div key={s.id} className="cn-svc-card" data-reveal data-delay={String(idx % 3 + 1)}>
          <div className="cn-svc-num">{s.number || String(idx + 1).padStart(2, '0')}</div>
          <div className="cn-svc-icon">{ICONS[idx % ICONS.length]}</div>
          <h3 className="cn-svc-title">{s.name}</h3>
          {s.description && <p className="cn-svc-text">{s.description}</p>}
          {s.badge && <span className="cn-bento-badge">{s.badge}</span>}
          <Link to="/dich-vu" className="cn-svc-link">
            Tìm hiểu thêm{' '}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      ))}
    </div>
  )
}
