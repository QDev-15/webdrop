import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_title: string
  service_name: string
  rating: number
  content: string
  avatar: string
}

export default function Testimonials() {
  const [items, setItems]     = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials').then(setItems).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const stars = (n: number) => '★'.repeat(Math.max(1, Math.min(5, n)))

  return (
    <section id="danh-gia" className="sec-pad" style={{ background: 'var(--clinical-white)' }}>
      <div className="wd-container">
        <div className="text-center mb-5" data-reveal>
          <div className="tmv-label">Đánh giá</div>
          <h2 className="tmv-h2">Khách hàng <em>nói gì</em></h2>
          <p className="tmv-lead center">Hơn 15,000 khách hàng đã tin tưởng chọn chúng tôi — và đây là những gì họ chia sẻ.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-3)' }}>Đang tải...</div>
        ) : items.length === 0 ? null : (
          <div className="row g-4">
            {items.map((t, i) => (
              <div key={t.id} className="col-12 col-md-6 col-lg-4">
                <div className="tmv-rv" data-reveal data-delay={String(Math.min(i % 3 + 1, 4)) as '1'|'2'|'3'|'4'}>
                  <div className="tmv-rv-stars">{stars(t.rating)}</div>
                  <p className="tmv-rv-text">"{t.content}"</p>
                  <div className="tmv-rv-foot">
                    {t.avatar ? (
                      <img src={t.avatar} alt={t.author_name} className="tmv-rv-av" />
                    ) : (
                      <div className="tmv-rv-av" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                        {t.author_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="tmv-rv-name">{t.author_name}</div>
                      <div className="tmv-rv-role">
                        {t.author_title || t.service_name || 'Khách hàng'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
