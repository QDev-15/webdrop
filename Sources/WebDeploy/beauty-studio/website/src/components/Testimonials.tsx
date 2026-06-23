import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_title: string
  author_avatar: string
  content: string
  rating: number
}

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([])

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials').then(setItems).catch(() => {})
  }, [])

  // Re-observe after async data renders (AppShell fires before data loads on SPA navigation)
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

  if (items.length === 0) return null

  return (
    <section className="sec-pad" style={{ background: 'var(--bg)' }}>
      <div className="wd-container">
        <div className="text-center mb-5" data-reveal>
          <div className="bst-eyebrow">Cảm nhận khách hàng</div>
          <h2 className="bst-title">Họ nói gì về <em>chúng tôi</em></h2>
        </div>
        <div className="row g-3">
          {items.map((t, i) => (
            <div key={t.id} className="col-md-4" data-reveal data-delay={String((i % 3) + 1)}>
              <div className="bst-rv-card">
                <div className="bst-rv-stars">{'★'.repeat(t.rating)}</div>
                <div className="bst-rv-text">"{t.content}"</div>
                <div className="bst-rv-foot">
                  {t.author_avatar
                    ? <img src={t.author_avatar} alt={t.author_name} className="bst-rv-av" />
                    : <div className="bst-rv-av" style={{ background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>👤</div>
                  }
                  <div>
                    <div className="bst-rv-name">{t.author_name}</div>
                    {t.author_title && <div className="bst-rv-date">{t.author_title}</div>}
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
