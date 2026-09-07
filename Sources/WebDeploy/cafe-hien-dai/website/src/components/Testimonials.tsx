import { useSite } from '../contexts/SiteContext'

export default function Testimonials() {
  const { testimonials } = useSite()
  if (testimonials.length === 0) return null

  return (
    <div className="chd-testi-track" style={{ marginTop: 44 }} data-reveal data-delay="1">
      {testimonials.map(t => (
        <div key={t.id} className="chd-testi-card">
          <div className="chd-testi-stars">{'★'.repeat(t.rating)}</div>
          <div className="chd-testi-text">&quot;{t.content}&quot;</div>
          <div className="chd-testi-author">
            <div className="chd-testi-avatar">
              {t.author_avatar && <img src={t.author_avatar} alt={t.author_name} loading="lazy" />}
            </div>
            <div>
              <div className="chd-testi-name">{t.author_name}</div>
              <div className="chd-testi-role">{t.author_title}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
