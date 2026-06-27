import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface Testimonial {
  id: number
  name: string
  role: string | null
  location: string | null
  rating: number
  content: string
  avatar: string | null
  is_published: number
  sort_order: number
}

function Stars({ count }: { count: number }) {
  return (
    <div className="sl-rv-stars" aria-label={`${count} sao`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="sl-rv-star" aria-hidden="true">
          {i < count ? '★' : '☆'}
        </span>
      ))}
    </div>
  )
}

function InitialAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map(w => w[0].toUpperCase())
    .join('')
  return <span>{initials}</span>
}

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([])

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials')
      .then(setItems)
      .catch(() => {})
  }, [])

  // Re-trigger reveal after data loads
  useEffect(() => {
    if (!items.length) return
    const t = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('visible')
              observer.unobserve(e.target)
            }
          })
        },
        { threshold: 0.08, rootMargin: '0px 0px -36px 0px' }
      )
      document.querySelectorAll('[data-reveal]:not(.visible)').forEach(el => observer.observe(el))
      return () => observer.disconnect()
    }, 80)
    return () => clearTimeout(t)
  }, [items])

  return (
    <section className="sl-rv-bg sl-section">
      <div className="sl-container">
        <div className="sl-sec-head" data-reveal>
          <p className="sl-eyebrow">Đánh giá khách hàng</p>
          <h2 className="sl-sec-title">Họ nói gì về <em>chúng tôi</em></h2>
          <p className="sl-sec-sub">
            Mỗi trải nghiệm là một câu chuyện — và đây là những chia sẻ chân thực từ khách hàng của chúng tôi.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="sl-rv-grid">
            {[1, 2, 3].map(i => (
              <div key={i} className="sl-rv" style={{ minHeight: 240 }}>
                <div className="sl-skeleton" style={{ height: 16, width: '40%', marginBottom: 12 }} />
                <div className="sl-skeleton" style={{ height: 80, marginBottom: 20 }} />
                <div className="sl-skeleton" style={{ height: 40 }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="sl-rv-grid">
            {items.map((item) => (
              <article key={item.id} className="sl-rv" data-reveal>
                <div className="sl-rv-quote" aria-hidden="true">"</div>
                <Stars count={item.rating} />
                <p className="sl-rv-text">"{item.content}"</p>
                <div className="sl-rv-author">
                  <div className="sl-rv-avatar">
                    {item.avatar ? (
                      <img
                        src={item.avatar}
                        alt={item.name}
                        onError={e => {
                          const el = e.currentTarget
                          el.style.display = 'none'
                        }}
                      />
                    ) : (
                      <InitialAvatar name={item.name} />
                    )}
                  </div>
                  <div>
                    <p className="sl-rv-name">{item.name}</p>
                    <p className="sl-rv-role">
                      {[item.role, item.location].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
