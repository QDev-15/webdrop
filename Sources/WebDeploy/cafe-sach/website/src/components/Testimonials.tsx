import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_title: string
  content: string
  rating: number
}

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([])

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials')
      .then(setItems)
      .catch(() => {/* dùng danh sách rỗng */})
  }, [])

  if (items.length === 0) return null

  return (
    <section className="sec-pad sec-surface">
      <div className="csa-container">
        <div className="csa-sec-head" data-reveal>
          <div className="csa-eyebrow">Khách đọc nói gì</div>
          <h2 className="csa-sec-title">Những buổi chiều <em>được kể lại</em></h2>
        </div>
        <div className="csa-testi-grid">
          {items.map((t, i) => {
            const delayAttr = i === 0 ? { 'data-reveal-d1': '' } : i === 1 ? { 'data-reveal-d2': '' } : { 'data-reveal-d3': '' }
            return (
              <div className="csa-testi-card" data-reveal key={t.id} {...delayAttr}>
                <blockquote>"{t.content}"</blockquote>
                <cite><b>{t.author_name}</b>{t.author_title ? ` — ${t.author_title}` : ''}</cite>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
