import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_role: string
  content: string
  rating: number
  avatar_url: string
  is_featured: number
}

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([])

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials').then(setItems).catch(() => {})
  }, [])

  return (
    <div className="dd-list" style={{ marginTop: '56px' }}>
      {items.map((t, i) => (
        <div key={t.id} className="dd-list-item" data-reveal={i === 1 ? 'd1' : i === 2 ? 'd2' : undefined}>
          <p className="dd-list-quote">"{t.content}"</p>
          <div className="dd-list-meta">
            {t.avatar_url ? (
              <img src={t.avatar_url} alt={t.author_name} loading="lazy" />
            ) : (
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-bright)', fontFamily: 'var(--font-heading)', fontSize: '22px', fontStyle: 'italic' }}>
                {t.author_name.charAt(0)}
              </div>
            )}
            <div>
              <div className="dd-list-name">{t.author_name}</div>
              <div className="dd-list-role">{t.author_role}</div>
            </div>
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-3)' }}>Chưa có đánh giá nào.</div>
      )}
    </div>
  )
}
