import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface Testimonial { id: number; author_name: string; author_location: string; author_avatar: string; content: string; rating: number }

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([])

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials').then(setItems).catch(() => {})
  }, [])

  if (!items.length) return null

  return (
    <section className="sec-pad" style={{ background: 'var(--warm)' }}>
      <div className="wd-container">
        <div className="text-center mb-4" data-reveal>
          <div className="ns-eyebrow">Khách hàng nói gì</div>
          <h2 className="ns-title">Đánh giá <strong>Thực Tế</strong></h2>
        </div>
        <div className="row g-4 mt-1">
          {items.map((t, i) => (
            <div key={t.id} className="col-md-4" data-reveal data-reveal-d={`d${i % 3}`}>
              <div className="ns-review-card">
                <div className="ns-rv-stars">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
                <p className="ns-rv-text">"{t.content}"</p>
                <div className="ns-rv-foot">
                  {t.author_avatar
                    ? <img className="ns-rv-av" src={t.author_avatar} alt={t.author_name} />
                    : <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--blush-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>👩</div>}
                  <div>
                    <div className="ns-rv-name">{t.author_name}</div>
                    {t.author_location && <div className="ns-rv-loc">{t.author_location}</div>}
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
