import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_info: string
  author_avatar: string
  content: string
  rating: number
  active: number
}

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials')
      .then(data => setItems(data.filter(t => t.active)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Re-observe after async data renders (Rule 26)
  useEffect(() => {
    if (items.length === 0) return
    const t = setTimeout(() => {
      const els = document.querySelectorAll('[data-reveal]:not(.visible)')
      const ro = new IntersectionObserver(
        entries => entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) }
        }),
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      )
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(t)
  }, [items])

  if (loading || items.length === 0) return null

  return (
    <section className="sec-pad" style={{ background: 'var(--warm)' }}>
      <div className="wd-container">
        <div className="text-center mb-5" data-reveal>
          <div className="mrt-label">
            <span className="mrt-label-line" />
            Cảm nhận
            <span className="mrt-label-line" />
          </div>
          <h2 className="mrt-heading">Khách hàng <em>nói gì</em> về chúng tôi</h2>
        </div>
        <div className="row g-4">
          {items.map(t => (
            <div key={t.id} className="col-md-6 col-lg-4" data-reveal>
              <div className="mrt-review-card">
                <div className="mrt-review-stars">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
                <p className="mrt-review-text">"{t.content}"</p>
                <div className="mrt-review-foot">
                  {t.author_avatar ? (
                    <img src={t.author_avatar} alt={t.author_name} className="mrt-review-av" />
                  ) : (
                    <div
                      className="mrt-review-av"
                      style={{ background: 'var(--cream2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'var(--accent)', fontWeight: 600 }}
                    >
                      {t.author_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="mrt-review-name">{t.author_name}</div>
                    <div className="mrt-review-info">{t.author_info}</div>
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
