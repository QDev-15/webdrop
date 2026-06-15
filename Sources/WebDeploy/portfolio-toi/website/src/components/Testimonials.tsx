import { useEffect } from 'react'
import { Testimonial } from '../App'

interface Props {
  testimonials: Testimonial[]
}

export default function Testimonials({ testimonials }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('.reveal:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) }
        })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [testimonials])

  if (!testimonials.length) return null

  return (
    <section className="sec-pad sec-mid" id="danh-gia">
      <div className="wd-container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="eyebrow reveal">Đánh giá</div>
          <h2 className="sec-title reveal" style={{ color: '#fff' }}>Khách hàng <em>nói gì</em></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className={`reveal${i > 0 ? ` reveal-d${i}` : ''}`}
              style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: '24px 26px' }}
            >
              <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
                {Array.from({ length: Math.min(5, Math.max(0, Number(t.rating) || 0)) }).map((_, si) => (
                  <span key={si} style={{ color: '#f59e0b', fontSize: 14 }}>★</span>
                ))}
              </div>
              <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,.55)', lineHeight: 1.75, marginBottom: 20 }}>
                &ldquo;{t.content}&rdquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {t.author_avatar ? (
                  <img
                    src={t.author_avatar}
                    alt={t.author_name}
                    style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                  />
                ) : (
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                    {t.author_name.charAt(0)}
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>{t.author_name}</div>
                  {t.author_title && <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', marginTop: 2 }}>{t.author_title}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
