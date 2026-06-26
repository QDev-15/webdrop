import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import BookingCTA from '../components/Booking'

interface Service {
  id: number; name: string; tag: string; description: string; price: string
  image: string; featured: number; category_id: number; category_name: string; sort_order: number
}
interface ServiceCategory { id: number; name: string; icon: string }

const FEATURE_STRIPS = [
  {
    title: 'Nail Gel',
    subtitle: 'Dịch vụ 01',
    desc: 'Gel cao cấp nhập khẩu — bền màu, độ bóng cao, không bong tróc đến 4 tuần.',
    features: ['Gel OPI, Shellac, Orly — nhập khẩu chính hãng', 'Hơn 200 màu gel để lựa chọn', 'Thời gian giữ màu 3–4 tuần', 'Tháo gel an toàn, không hại móng'],
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=700&q=70&auto=format&fit=crop',
    imageLeft: true,
  },
  {
    title: 'Nail Art',
    subtitle: 'Dịch vụ 02',
    desc: 'Từ vẽ tay đến đính đá, hoa khô, sticker — mỗi bộ nail là một tác phẩm nghệ thuật độc đáo.',
    features: ['Nail Art vẽ tay thuần thục', 'Đính đá Swarovski, hoa khô, foil', 'Thiết kế theo yêu cầu riêng', 'Bảo hành mẫu nail 7 ngày'],
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=700&q=70&auto=format&fit=crop',
    imageLeft: false,
  },
  {
    title: 'Pedicure & Dưỡng',
    subtitle: 'Dịch vụ 03',
    desc: 'Liệu trình chăm sóc móng chân toàn diện — ngâm, tẩy da chết, massage bàn chân thư giãn.',
    features: ['Tẩy da chết chuyên sâu', 'Massage bàn chân 15 phút', 'Dưỡng ẩm móng chân cao cấp', 'Gel pedicure bền đẹp đến 3 tuần'],
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=700&q=70&auto=format&fit=crop',
    imageLeft: true,
  },
]

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<ServiceCategory[]>([])

  useEffect(() => {
    Promise.all([
      api.get<Service[]>('/public/services'),
      api.get<ServiceCategory[]>('/public/service-categories'),
    ]).then(([svcs, cats]) => {
      setServices(svcs)
      setCategories(cats)
    }).catch(() => {})
  }, [])

  const grouped = categories.map(cat => ({
    ...cat,
    services: services.filter(s => s.category_id === cat.id),
  })).filter(g => g.services.length > 0)

  return (
    <>
      {/* Page hero */}
      <section className="ns-page-hero">
        <div className="wd-container">
          <div data-reveal>
            <div className="ns-ph-tag">Dịch vụ & Bảng giá</div>
            <h1 className="ns-ph-title">Dịch vụ <strong>nail chuyên nghiệp</strong></h1>
            <p className="ns-ph-sub">Đa dạng lựa chọn phù hợp mọi phong cách và ngân sách.</p>
          </div>
        </div>
      </section>

      {/* Feature strips */}
      {FEATURE_STRIPS.map((strip, i) => (
        <section key={i} className="ns-feature-strip" style={i % 2 === 1 ? { background: 'var(--warm)' } : {}}>
          <div className="wd-container">
            <div className="row align-items-center g-5">
              <div className={`col-lg-6${!strip.imageLeft ? ' order-lg-2' : ''}`} data-reveal>
                <div className="ns-feature-img">
                  <img src={strip.image} alt={strip.title} loading="lazy" />
                </div>
              </div>
              <div className={`col-lg-6${!strip.imageLeft ? ' order-lg-1' : ''}`} data-reveal data-reveal-d="d1">
                <div className="ns-eyebrow">{strip.subtitle}</div>
                <h2 className="ns-title"><strong>{strip.title}</strong></h2>
                <p className="ns-sub" style={{ marginBottom: 20 }}>{strip.desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {strip.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--blush)', fontSize: 16, flexShrink: 0, marginTop: 1 }}>✓</span>
                      <span style={{ fontSize: 13.5, fontWeight: 300, color: 'var(--text-2)' }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/dat-lich" className="ns-btn-primary">Đặt lịch ngay</Link>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Price tables */}
      {grouped.length > 0 && (
        <section className="sec-pad">
          <div className="wd-container">
            <div className="text-center mb-4" data-reveal>
              <div className="ns-eyebrow">Bảng giá</div>
              <h2 className="ns-title">Giá dịch vụ <strong>minh bạch</strong></h2>
              <p className="ns-sub centered">Giá đã bao gồm toàn bộ dịch vụ. Không phụ thu ẩn.</p>
            </div>
            <div className="row g-4 mt-2">
              {grouped.map((group, i) => (
                <div key={group.id} className="col-lg-6" data-reveal data-reveal-d={`d${i % 2}`}>
                  <div className="ns-price-section">
                    <div className="ns-price-header">
                      <div className="ns-price-icon">{group.icon}</div>
                      <div>
                        <div className="ns-price-cat">{group.name}</div>
                        <div className="ns-price-cat-sub">{group.services.length} dịch vụ</div>
                      </div>
                    </div>
                    <div className="ns-price-list">
                      {group.services.map(svc => (
                        <div key={svc.id} className={`ns-price-row${svc.featured ? ' featured' : ''}`}>
                          <div>
                            <div className="ns-price-name">
                              {svc.name}
                              {svc.featured ? <span className="ns-price-badge">HOT</span> : null}
                            </div>
                            {svc.description && <div className="ns-price-desc">{svc.description}</div>}
                          </div>
                          <div className="ns-price-val">{svc.price}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-4" data-reveal>
              <Link to="/dat-lich" className="ns-btn-primary">Đặt lịch tư vấn miễn phí</Link>
            </div>
          </div>
        </section>
      )}

      <BookingCTA />
    </>
  )
}
