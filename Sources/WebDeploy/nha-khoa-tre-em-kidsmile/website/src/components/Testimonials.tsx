import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_meta: string
  author_avatar: string
  content: string
  rating: number
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials').then(setTestimonials).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="ks-loading">Đang tải đánh giá...</div>

  const getStars = (rating: number) => '★'.repeat(Math.min(5, Math.max(1, rating)))

  return (
    <div className="ks-rv-grid">
      {testimonials.map((t, i) => (
        <article className="ks-rv-card" key={t.id} data-reveal data-delay={i > 0 ? String(i) : undefined}>
          <div className="ks-rv-stars" aria-label={`${t.rating} sao`}>
            {getStars(t.rating)}
          </div>
          <p className="ks-rv-text">"{t.content}"</p>
          <div className="ks-rv-foot">
            {t.author_avatar ? (
              <img src={t.author_avatar} alt={t.author_name} className="ks-rv-av" loading="lazy" />
            ) : (
              <div className="ks-rv-av-init" aria-hidden="true">
                {t.author_name.charAt(0)}
              </div>
            )}
            <div>
              <div className="ks-rv-name">{t.author_name}</div>
              {t.author_meta && <div className="ks-rv-meta">{t.author_meta}</div>}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
