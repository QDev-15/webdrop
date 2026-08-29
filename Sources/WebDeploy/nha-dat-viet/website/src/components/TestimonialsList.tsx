import type { Testimonial } from '../types'

export default function TestimonialsList({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null
  return (
    <div className="ndv-testi-list" style={{ maxWidth: 760, margin: '0 auto' }}>
      {items.map((t, i) => (
        <div key={t.id} className="ndv-testi-item" data-reveal="" data-delay={i > 0 ? Math.min(i, 3) : undefined}>
          <div className="ndv-testi-avatar"><img src={t.avatar} alt={t.name} loading="lazy" /></div>
          <div>
            <div className="ndv-testi-stars">★★★★★</div>
            <p className="ndv-testi-quote">&ldquo;{t.content}&rdquo;</p>
            <div className="ndv-testi-name">{t.name}</div>
            <div className="ndv-testi-role">{t.role}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
