import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_role: string
  content: string
  rating: number
  avatar_initial: string
  is_featured: number
}

interface Props {
  featured?: boolean
}

export default function Testimonials({ featured = false }: Props) {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials')
      .then(data => setItems(featured ? data.filter(t => t.is_featured) : data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [featured])

  if (loading) return null

  return (
    <div className="cn-rv-grid">
      {items.map((t, idx) => (
        <div key={t.id} className="cn-rv-card" data-reveal data-delay={String(idx % 3 + 1)}>
          <div className="cn-rv-stars">{'★'.repeat(Math.min(t.rating, 5))}</div>
          <p className="cn-rv-quote">"{t.content}"</p>
          <div className="cn-rv-author">
            <div className="cn-rv-avatar">{t.avatar_initial || t.author_name.charAt(0).toUpperCase()}</div>
            <div>
              <div className="cn-rv-name">{t.author_name}</div>
              <div className="cn-rv-role">{t.author_role}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
