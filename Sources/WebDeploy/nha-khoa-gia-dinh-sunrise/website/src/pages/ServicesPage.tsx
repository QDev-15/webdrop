import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface ServiceCategory {
  id: number
  name: string
  description: string
}

interface Service {
  id: number
  category_id: number
  name: string
  description: string
  image: string
  tag: string
  price: string
  price_unit: string
}

export default function ServicesPage() {
  useDocumentMeta({
    title: 'Dịch vụ nha khoa — Sunrise Nha Khoa Gia Đình',
    description: 'Dịch vụ nha khoa toàn diện cho cả gia đình tại Sunrise — phòng ngừa, điều trị, nha khoa trẻ em, nha chu, phục hồi và thẩm mỹ răng.',
  })

  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [services, setServices]     = useState<Service[]>([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<ServiceCategory[]>('/public/service-categories'),
      api.get<Service[]>('/public/services'),
    ]).then(([cats, svcs]) => {
      setCategories(cats)
      setServices(svcs)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <>
      <div className="sr-page-header">
        <div className="wd-container">
          <div className="sr-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            <span>Dịch vụ</span>
          </div>
          <h1 className="sr-page-header-title">Dịch vụ nha khoa <em>toàn diện</em></h1>
          <p className="sr-page-header-sub">
            Sunrise cung cấp đầy đủ dịch vụ chăm sóc răng miệng cho cả gia đình —
            từ phòng ngừa, điều trị đến nha khoa thẩm mỹ.
          </p>
        </div>
      </div>

      <section className="sec-pad">
        <div className="wd-container">
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--text-3)', padding: '80px 0' }}>Đang tải dịch vụ...</div>
          ) : (
            categories.map((cat, ci) => {
              const catServices = services.filter(s => s.category_id === cat.id)
              if (catServices.length === 0) return null
              return (
                <div key={cat.id} className="sr-cat-group" data-reveal>
                  <div className="sr-cat-head">
                    <div className="sr-cat-num">{String(ci + 1).padStart(2, '0')}</div>
                    <div>
                      <div className="sr-cat-title">{cat.name}</div>
                      {cat.description && <div className="sr-cat-sub">{cat.description}</div>}
                    </div>
                  </div>
                  <div className="sr-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                    {catServices.map((s, si) => (
                      <div key={s.id} className="sr-card-img" data-reveal data-delay={String((si % 3) + 1)}>
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
                </div>
              )
            })
          )}

          <div style={{ textAlign: 'center', marginTop: '16px', padding: '48px', background: 'var(--accent-pale)', borderRadius: '24px' }} data-reveal>
            <h3 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>
              Chưa tìm thấy dịch vụ phù hợp?
            </h3>
            <p style={{ color: 'var(--text-2)', marginBottom: '24px' }}>
              Liên hệ trực tiếp với chúng tôi để được tư vấn miễn phí.
            </p>
            <Link to="/dat-lich" className="sr-btn sr-btn-primary">Đặt lịch tư vấn miễn phí</Link>
          </div>
        </div>
      </section>
    </>
  )
}
