import { useEffect, useRef, useState } from 'react'
import { api } from '../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_role: string
  author_avatar: string
  content: string
  rating: number
}

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials').then(setItems).catch(() => {}).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el || loading) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } }),
      { threshold: 0.1 }
    )
    el.querySelectorAll('.at-reveal').forEach(el2 => obs.observe(el2))
    return () => obs.disconnect()
  }, [loading, items])

  if (loading || items.length === 0) return null

  return (
    <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 40 }}>
      {items.map((rv, i) => (
        <div key={rv.id} className={`at-rv at-reveal at-reveal-d${Math.min(i + 1, 3)}`}>
          <div className="at-rv-stars">{'★'.repeat(rv.rating)}</div>
          <blockquote className="at-rv-text">{rv.content}</blockquote>
          <div className="at-rv-foot">
            {rv.author_avatar ? (
              <img src={rv.author_avatar} alt={rv.author_name} className="at-rv-av" loading="lazy" />
            ) : (
              <div className="at-rv-av-fallback" aria-hidden="true">
                {rv.author_name.charAt(0)}
              </div>
            )}
            <div>
              <div className="at-rv-name">{rv.author_name}</div>
              {rv.author_role && <div className="at-rv-meta">{rv.author_role}</div>}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
