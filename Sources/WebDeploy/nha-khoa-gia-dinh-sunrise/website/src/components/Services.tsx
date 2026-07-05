import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Service {
  id: number
  name: string
  description: string
  image: string
  tag: string
  price: string
  price_unit: string
  category_name: string
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    api.get<Service[]>('/public/services')
      .then(setServices)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const featured = services.slice(0, 6)

  return (
    <section className="sec-pad">
      <div className="wd-container">
        <div style={{ textAlign: 'center', marginBottom: '52px' }} data-reveal>
          <div className="sr-eyebrow">Dịch vụ nha khoa</div>
          <h2 className="sr-sec-title sr-center">Chăm sóc răng miệng <em>toàn diện</em></h2>
          <p className="sr-sec-sub sr-center">
            Sunrise cung cấp đầy đủ dịch vụ nha khoa cho cả gia đình — từ khám phòng ngừa đến điều trị chuyên sâu và thẩm mỹ răng.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-3)', padding: '48px 0' }}>Đang tải dịch vụ...</div>
        ) : (
          <div className="sr-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {featured.map((s, i) => (
              <div key={s.id} className="sr-card-img" data-reveal data-delay={String((i % 3) + 1)}>
                {s.image && (
                  <div className="sr-card-img-media">
                    <img src={s.image} alt={s.name} loading="lazy" />
                  </div>
                )}
                <div className="sr-card-img-body">
                  {s.tag && <span className="sr-card-tag">{s.tag}</span>}
                  <div className="sr-card-title">{s.name}</div>
                  {s.description && <p className="sr-card-text">{s.description}</p>}
                  {s.price && (
                    <div className="sr-card-foot">
                      <div className="sr-card-price">
                        {s.price} <span>{s.price_unit}</span>
                      </div>
                      <Link to="/dat-lich" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Đặt lịch
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '40px' }} data-reveal>
          <Link to="/dich-vu" className="sr-btn sr-btn-ghost">
            Xem tất cả dịch vụ
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
