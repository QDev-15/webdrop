import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface Testimonial {
  id: number
  customer_name: string
  avatar: string
  meta: string
  rating: number
  content: string
}

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([])

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials').then(setItems).catch(() => {})
  }, [])

  return (
    <section className="sec-pad" style={{ background: 'var(--bg)' }}>
      <div className="wd-container">
        <div className="text-center mb-5" data-reveal>
          <div className="tb-eyebrow">Đánh giá</div>
          <h2 className="tb-title">Khách hàng <em>nói gì</em></h2>
        </div>
        <div className="row g-4">
          {items.map((t, i) => (
            <div className="col-md-4" data-reveal data-delay={String(Math.min(i + 1, 3))} key={t.id}>
              <div className="tb-review-card">
                <div className="tb-stars">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
                <p className="tb-review-text">&quot;{t.content}&quot;</p>
                <div className="tb-review-author">
                  <div className="tb-review-avatar">
                    <img src={t.avatar} alt="Avatar" />
                  </div>
                  <div>
                    <div className="tb-review-name">{t.customer_name}</div>
                    <div className="tb-review-meta">{t.meta}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
