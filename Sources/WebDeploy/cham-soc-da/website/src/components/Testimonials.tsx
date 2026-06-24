import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_avatar: string
  condition: string
  content: string
  rating: number
  is_active: number
}

export default function Testimonials() {
  const [reviews, setReviews] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials')
      .then(data => setReviews(data.filter(r => r.is_active)))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Rule 26: Re-observe after async data renders
  useEffect(() => {
    if (reviews.length === 0) return
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
  }, [reviews])

  if (loading) return (
    <section className="csd-sec">
      <div className="wd-container text-center" style={{ color: 'var(--text-3)', fontWeight: 300 }}>Đang tải đánh giá...</div>
    </section>
  )

  if (reviews.length === 0) return null

  return (
    <section className="csd-sec" style={{ background: 'var(--surface)' }}>
      <div className="wd-container">
        <div className="text-center mb-5" data-reveal>
          <div className="csd-eyebrow">Đánh giá khách hàng</div>
          <h2 className="csd-title">Bệnh nhân nói gì về<br /><em>kết quả điều trị</em></h2>
        </div>

        <div className="row g-4">
          {reviews.map((r, i) => (
            <div key={r.id} className="col-12 col-md-4" data-reveal data-delay={String(i % 3)}>
              <div className="csd-review-card">
                <div className="csd-rv-stars">{'★'.repeat(Math.max(1, Math.min(5, r.rating ?? 5)))}</div>
                {r.condition && <div className="csd-rv-condition">{r.condition}</div>}
                <div className="csd-rv-text">"{r.content}"</div>
                <div className="csd-rv-foot">
                  {r.author_avatar ? (
                    <img src={r.author_avatar} alt={r.author_name} className="csd-rv-av" />
                  ) : (
                    <div className="csd-rv-av d-flex align-items-center justify-content-center" style={{ background: 'var(--accent-light)', fontSize: 14, color: 'var(--accent)' }}>
                      {r.author_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="csd-rv-name">{r.author_name}</div>
                    <div className="csd-rv-meta">Bệnh nhân</div>
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
