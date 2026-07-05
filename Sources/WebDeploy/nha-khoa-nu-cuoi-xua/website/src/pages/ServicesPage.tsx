import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Category {
  id: number
  name: string
  description: string
  is_active: number
}

interface Service {
  id: number
  name: string
  tag: string
  description: string
  price: string
  price_unit: string
  image: string
  category_id: number | null
  category_name: string
  is_active: number
}

export default function ServicesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<number | null>(null)

  useEffect(() => {
    Promise.all([
      api.get<Category[]>('/public/service-categories').catch(() => []),
      api.get<Service[]>('/public/services').catch(() => []),
    ]).then(([cats, svcs]) => {
      const activeCats = (cats as Category[]).filter(c => c.is_active)
      setCategories(activeCats)
      setServices((svcs as Service[]).filter(s => s.is_active))
      if (activeCats.length > 0) setActiveTab(activeCats[0].id)
    }).finally(() => setLoading(false))
  }, [])

  const visibleServices = activeTab
    ? services.filter(s => s.category_id === activeTab)
    : services

  return (
    <>
      {/* Page hero */}
      <div className="nc-page-hero">
        <div className="wd-container nc-strip-inner">
          <div className="nc-ph-crumb">
            <Link to="/">Trang chủ</Link> / Dịch vụ
          </div>
          <h1 className="nc-ph-title">Dịch vụ <span>nha khoa</span></h1>
          <p className="nc-ph-sub">Từ răng thẩm mỹ đến phục hồi chức năng, chúng tôi cung cấp đầy đủ giải pháp nha khoa hiện đại.</p>
        </div>
      </div>

      <section className="sec-pad">
        <div className="wd-container">
          {/* Category tabs */}
          {categories.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }} data-reveal>
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setActiveTab(c.id)}
                  className={activeTab === c.id ? 'nc-btn' : 'nc-btn-outline'}
                  style={{ padding: '10px 20px', fontSize: '12px' }}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--text-3)', padding: '60px' }}>Đang tải...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {visibleServices.map((s, i) => (
                <div key={s.id} className="nc-card" data-reveal data-delay={String((i % 3) + 1)}>
                  {s.image ? (
                    <div className="nc-card-img">
                      <img src={s.image} alt={s.name} loading="lazy" />
                    </div>
                  ) : (
                    <div className="nc-card-img" style={{ background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '48px', opacity: .3 }}>🦷</span>
                    </div>
                  )}
                  <div className="nc-card-body">
                    {s.tag && <div className="nc-card-tag">{s.tag}</div>}
                    <h3 className="nc-card-name">{s.name}</h3>
                    {s.description && <p className="nc-card-desc">{s.description}</p>}
                    {s.price && (
                      <div className="nc-card-price">
                        <span className="nc-card-price-from">Từ </span>
                        {s.price} {s.price_unit && s.price_unit !== 'VND' ? `/ ${s.price_unit}` : ''}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {!loading && visibleServices.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-3)', padding: '60px' }}>
                  Không có dịch vụ nào trong nhóm này.
                </div>
              )}
            </div>
          )}

          {/* CTA */}
          <div style={{ textAlign: 'center', marginTop: '64px' }} data-reveal>
            <div className="nc-eyebrow" style={{ display: 'inline-flex', marginBottom: '16px' }}>Đặt lịch khám</div>
            <h2 className="nc-title" style={{ textAlign: 'center', marginBottom: '16px' }}>Cần tư vấn <span>dịch vụ phù hợp</span>?</h2>
            <p className="nc-sub" style={{ margin: '0 auto 28px', textAlign: 'center' }}>Bác sĩ Nụ Cười Xưa sẵn sàng tư vấn miễn phí và đề xuất phương án điều trị phù hợp nhất cho bạn.</p>
            <Link to="/dat-lich" className="nc-btn">Đặt lịch khám miễn phí</Link>
          </div>
        </div>
      </section>
    </>
  )
}
