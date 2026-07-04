import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface Testimonial {
  id: number
  customer_name: string
  service_name: string
  rating: number
  content: string
  avatar: string
}

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&auto=format&fit=crop'

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([])

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials').then(setItems).catch(() => {})
  }, [])

  const stars = (n: number) => '★'.repeat(Math.max(1, Math.min(5, n)))

  return (
    <section className="cn-testimonials sec-pad">
      <div className="wd-container">
        <div style={{ textAlign: 'center', marginBottom: 52 }} data-reveal>
          <div className="cn-eyebrow">Đánh giá khách hàng</div>
          <h2 className="cn-title">Kết quả thực tế từ <em>khách hàng</em></h2>
          <p className="cn-sub" style={{ margin: '0 auto' }}>
            Trải nghiệm thực tế của khách hàng sau khi niềng răng tại Chỉnh Nha Sài Gòn.
          </p>
        </div>

        <div className="cn-testi-grid">
          {items.map((t, i) => (
            <div className="cn-testi-card" key={t.id} data-reveal data-delay={String(i % 3)}>
              <div className="cn-testi-stars" aria-label={`${t.rating}/5 sao`}>{stars(t.rating)}</div>
              <p className="cn-testi-text">"{t.content}"</p>
              <div className="cn-testi-bottom">
                <img
                  src={t.avatar || DEFAULT_AVATAR}
                  alt={t.customer_name}
                  className="cn-testi-avatar"
                  loading="lazy"
                  onError={e => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR }}
                />
                <div>
                  <div className="cn-testi-name">{t.customer_name}</div>
                  {t.service_name && <div className="cn-testi-service">{t.service_name}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
