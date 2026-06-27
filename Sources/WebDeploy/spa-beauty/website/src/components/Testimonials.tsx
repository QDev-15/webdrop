import { useEffect } from 'react'
import { useSite } from '../contexts/SiteContext'

export default function Testimonials() {
  const { testimonials } = useSite()

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } })
    }, { threshold: 0.08 })
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [testimonials])

  if (testimonials.length === 0) return null

  return (
    <div className="row g-3">
      {testimonials.map((t, i) => (
        <div key={t.id} className="col-md-4">
          <div className="sb-rv-card" data-reveal style={{ transitionDelay: `${i * 0.08}s` }}>
            <div className="sb-rv-stars">{'★'.repeat(t.rating)}</div>
            <p className="sb-rv-text">"{t.content}"</p>
            <div className="sb-rv-foot">
              {t.author_avatar && <img className="sb-rv-av" src={t.author_avatar} alt={t.author_name} loading="lazy" />}
              <div>
                <div className="sb-rv-name">{t.author_name}</div>
                {t.author_location && <div className="sb-rv-loc">{t.author_location}</div>}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
