import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Category { id: number; name: string; description: string }
interface Service  { id: number; category_id: number | null; category_name: string; name: string; description: string; tag: string; price: string; price_unit: string }

export default function ServicesPage() {
  const [cats, setCats]     = useState<Category[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    api.get<Category[]>('/public/service-categories').then(setCats).catch(() => {})
    api.get<Service[]>('/public/services').then(setServices).catch(() => {})
  }, [])

  const filtered = active === 0 ? services : services.filter(s => s.category_id === active)

  return (
    <>
      {/* Page hero */}
      <section className="vd-page-hero">
        <div className="wd-container">
          <div className="vd-ph-inner">
            <div className="vd-ph-crumb">
              <Link to="/">Trang chủ</Link>
              <span>›</span>
              <span>Dịch vụ</span>
            </div>
            <h1 className="vd-ph-title">Dịch Vụ <em>Nha Khoa</em></h1>
            <p className="vd-ph-sub">Giải pháp điều trị toàn diện — từ khám cơ bản đến phẫu thuật chuyên sâu.</p>
          </div>
        </div>
      </section>

      {/* Services list */}
      <section className="vd-sec-pad">
        <div className="wd-container">
          {/* Filter pills */}
          <div className="vd-filter-bar mb-5" data-reveal="true">
            <button className={`vd-filter-pill${active === 0 ? ' active' : ''}`} onClick={() => setActive(0)}>
              Tất cả
            </button>
            {cats.map(c => (
              <button
                key={c.id}
                className={`vd-filter-pill${active === c.id ? ' active' : ''}`}
                onClick={() => setActive(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Service categories */}
          {(active === 0 ? cats : cats.filter(c => c.id === active)).map(cat => {
            const catServices = filtered.filter(s => s.category_id === cat.id)
            if (!catServices.length && active !== 0) return null
            return (
              <div key={cat.id} style={{ marginBottom: 56 }} data-reveal="true">
                <div className="vd-cat-title">
                  <div className="vd-cat-icon">
                    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/></svg>
                  </div>
                  {cat.name}
                </div>
                {cat.description && <p className="vd-cat-sub">{cat.description}</p>}
                <div>
                  {(active === 0 ? services.filter(s => s.category_id === cat.id) : catServices).map(s => (
                    <div key={s.id} className="vd-svc-list-item">
                      <div>
                        <div className="vd-svc-list-name">{s.tag && <span style={{ fontSize: 10, fontWeight: 600, background: 'var(--accent-light)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 4, marginRight: 8 }}>{s.tag}</span>}{s.name}</div>
                        <div className="vd-svc-list-desc">{s.description}</div>
                      </div>
                      {s.price && (
                        <div className="vd-svc-list-price">
                          {s.price}
                          <span>{s.price_unit}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          {/* CTA */}
          <div style={{ textAlign: 'center', paddingTop: 32 }} data-reveal="true">
            <Link to="/dat-lich" className="vd-btn vd-btn-primary vd-btn-lg">Đặt Lịch Khám Ngay</Link>
          </div>
        </div>
      </section>
    </>
  )
}
