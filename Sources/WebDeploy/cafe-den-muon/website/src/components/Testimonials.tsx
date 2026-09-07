import { useSite } from '../contexts/SiteContext'

export default function Testimonials() {
  const { testimonials } = useSite()
  const items = testimonials
  if (items.length === 0) return null

  return (
    <div className="row g-4">
      {items.map((t, i) => (
        <div className="col-md-4" key={t.id}>
          <div className={`rv reveal reveal-d${Math.min(i + 1, 3)}`}>
            <div className="rv-stars">{'★'.repeat(t.rating || 5)}</div>
            <div className="rv-text">"{t.content}"</div>
            <div className="rv-foot">
              {t.author_avatar && <img className="rv-av" src={t.author_avatar} alt={`Khách hàng ${t.author_name}`} loading="lazy" />}
              <div>
                <div className="rv-name">{t.author_name}</div>
                <div className="rv-role">{t.author_title}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
