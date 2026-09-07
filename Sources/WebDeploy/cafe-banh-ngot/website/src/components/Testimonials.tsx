import { useSite } from '../contexts/SiteContext'

export default function Testimonials() {
  const { testimonials } = useSite()

  if (testimonials.length === 0) return null

  return (
    <div className="row g-4">
      {testimonials.map((t, i) => (
        <div className="col-md-4" key={t.id}>
          <div className={`cbn-rv cbn-reveal cbn-reveal-d${(i % 3) + 1}`}>
            <div className="cbn-rv-stars">{'★'.repeat(t.rating || 5)}</div>
            <div className="cbn-rv-text">{t.content}</div>
            <div className="cbn-rv-foot">
              {t.author_avatar
                ? <img className="cbn-rv-av" src={t.author_avatar} alt={t.author_name} loading="lazy" />
                : <div className="cbn-rv-av" style={{ background: 'var(--accent-light)' }} />
              }
              <div>
                <div className="cbn-rv-name">{t.author_name}</div>
                {t.author_title && <div className="cbn-rv-role">{t.author_title}</div>}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
