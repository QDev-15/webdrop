import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface ServiceCategory {
  id: number
  name: string
  slug: string
  description: string
}

interface Service {
  id: number
  category_id: number
  category_name: string
  name: string
  description: string
  price_from: number
  price_unit: string
  duration: string
  recovery: string
  image: string
  is_featured: number
}

export default function Services() {
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [services, setServices]     = useState<Service[]>([])
  const [activeTab, setActiveTab]   = useState<number | null>(null)
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<ServiceCategory[]>('/public/service-categories'),
      api.get<Service[]>('/public/services'),
    ]).then(([cats, svcs]) => {
      setCategories(cats)
      setServices(svcs)
      if (cats.length > 0) setActiveTab(cats[0].id)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const displayed = activeTab ? services.filter(s => s.category_id === activeTab) : services.filter(s => s.is_featured)

  return (
    <section id="dich-vu" className="sec-pad" style={{ background: 'var(--clinical-white)' }}>
      <div className="wd-container">
        <div className="text-center mb-4" data-reveal>
          <div className="tmv-label">Dịch vụ</div>
          <h2 className="tmv-h2">Giải pháp thẩm mỹ <em>toàn diện</em></h2>
          <p className="tmv-lead center">Từ phẫu thuật tạo hình đến chăm sóc da chuyên sâu — chúng tôi mang đến giải pháp phù hợp cho từng khách hàng.</p>
        </div>

        {/* Category tabs */}
        {categories.length > 1 && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }} data-reveal>
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveTab(c.id)}
                className={`tmv-btn ${activeTab === c.id ? 'tmv-btn-dark' : 'tmv-btn-outline'}`}
                style={{ padding: '9px 20px', fontSize: 13 }}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-3)' }}>Đang tải...</div>
        ) : (
          <div className="row g-4">
            {displayed.map((s, i) => (
              <div key={s.id} className="col-12 col-sm-6 col-lg-4">
                <div className="tmv-svc-card" data-reveal data-delay={String(Math.min(i % 3 + 1, 4)) as '1'|'2'|'3'|'4'}>
                  {s.image ? (
                    <div className="tmv-svc-thumb-wrap">
                      <img src={s.image} alt={s.name} className="tmv-svc-thumb" loading="lazy" />
                    </div>
                  ) : (
                    <div className="tmv-svc-thumb-wrap" style={{ background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 36, opacity: .3 }}>✦</span>
                    </div>
                  )}
                  <div className="tmv-svc-body">
                    <div className="tmv-svc-tag">{s.category_name}</div>
                    <div className="tmv-svc-name">{s.name}</div>
                    {s.description && <p className="tmv-svc-desc">{s.description}</p>}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                      {s.price_from ? (
                        <div className="tmv-svc-price">
                          {Number(s.price_from).toLocaleString('vi-VN')}đ
                          {s.price_unit && <span>/{s.price_unit}</span>}
                        </div>
                      ) : (
                        <div className="tmv-svc-price">Liên hệ</div>
                      )}
                      {s.duration && (
                        <span style={{ fontSize: 11, color: 'var(--text-3)', background: 'var(--bg)', padding: '3px 10px', borderRadius: 20 }}>⏱ {s.duration}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-5" data-reveal>
          <Link to="/tu-van" className="tmv-btn tmv-btn-gold">
            Tư vấn dịch vụ phù hợp →
          </Link>
          <Link to="/dich-vu" className="tmv-btn tmv-btn-outline" style={{ marginLeft: 12 }}>
            Xem tất cả dịch vụ →
          </Link>
        </div>
      </div>
    </section>
  )
}
