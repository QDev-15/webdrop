import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_meta: string
  author_avatar: string
  stars: number
  quote: string
}

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials')
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading || items.length === 0) return null

  return (
    <section className="sec-pad">
      <div className="wd-container">
        <div style={{ textAlign: 'center', marginBottom: '52px' }} data-reveal>
          <div className="sr-eyebrow">Cảm nhận khách hàng</div>
          <h2 className="sr-sec-title sr-center">Gia đình nói gì về <em>Sunrise</em></h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {items.map((t, i) => (
            <div key={t.id} className="sr-test-card" data-reveal data-delay={String(i + 1)}>
              <div className="sr-test-stars">{'★'.repeat(t.stars)}</div>
              <p className="sr-test-quote">{t.quote}</p>
              <div className="sr-test-author">
                {t.author_avatar ? (
                  <img src={t.author_avatar} alt={t.author_name} className="sr-test-avatar" loading="lazy" />
                ) : (
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 600, color: 'var(--accent)', flexShrink: 0 }}>
                    {t.author_name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="sr-test-name">{t.author_name}</div>
                  <div className="sr-test-meta">{t.author_meta}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
