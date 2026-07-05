import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Service {
  id: number
  name: string
  tag: string
  description: string
  price: string
  price_unit: string
  image: string
  is_active: number
}

const FALLBACK: Service[] = [
  { id: 1, name: 'Tẩy Trắng Răng', tag: 'Thẩm mỹ', description: 'Công nghệ tẩy trắng hiện đại, an toàn và hiệu quả, đem lại hàng răng trắng sáng tự nhiên.', price: 'Từ 500.000', price_unit: 'VND', image: '', is_active: 1 },
  { id: 2, name: 'Niềng Răng Trong Suốt', tag: 'Chỉnh nha', description: 'Hệ thống niềng răng trong suốt Invisalign — chỉnh nha hiệu quả mà không ảnh hưởng thẩm mỹ.', price: 'Từ 25.000.000', price_unit: 'VND', image: '', is_active: 1 },
  { id: 3, name: 'Trồng Răng Implant', tag: 'Phục hồi', description: 'Giải pháp trồng răng Implant cao cấp, bền đẹp như răng thật, bảo hành trọn đời.', price: 'Từ 15.000.000', price_unit: 'răng', image: '', is_active: 1 },
]

export default function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Service[]>('/public/services')
      .then(data => setServices(data.filter(s => s.is_active).slice(0, 6)))
      .catch(() => setServices(FALLBACK))
      .finally(() => setLoading(false))
  }, [])

  const items = services.length > 0 ? services : (loading ? [] : FALLBACK)

  return (
    <section className="sec-pad" style={{ background: 'var(--bg-2)' }}>
      <div className="wd-container">
        <div style={{ marginBottom: '52px' }} data-reveal>
          <div className="nc-eyebrow">Dịch vụ của chúng tôi</div>
          <h2 className="nc-title">Chuyên sâu <span>răng thẩm mỹ</span></h2>
          <p className="nc-sub">Phòng khám Nụ Cười Xưa cung cấp đầy đủ dịch vụ nha khoa từ cơ bản đến chuyên sâu, được thực hiện bởi đội ngũ bác sĩ giàu kinh nghiệm.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {items.map((s, i) => (
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
                <p className="nc-card-desc">{s.description}</p>
                {s.price && (
                  <div className="nc-card-price">
                    <span className="nc-card-price-from">Từ </span>
                    {s.price}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }} data-reveal>
          <Link to="/dich-vu" className="nc-btn-outline">Xem tất cả dịch vụ</Link>
        </div>
      </div>
    </section>
  )
}
