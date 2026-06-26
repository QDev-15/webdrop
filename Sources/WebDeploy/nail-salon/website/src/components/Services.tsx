import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Service { id: number; name: string; tag: string; description: string; price: string; image: string; featured: number }

export default function Services() {
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    api.get<Service[]>('/public/services').then(data => {
      setServices(data.filter(s => s.featured).slice(0, 4))
    }).catch(() => {})
  }, [])

  if (!services.length) return null

  return (
    <section className="sec-pad">
      <div className="wd-container">
        <div className="text-center mb-4" data-reveal>
          <div className="ns-eyebrow">Dịch vụ của chúng tôi</div>
          <h2 className="ns-title">Chăm sóc <strong>Toàn Diện</strong></h2>
          <p className="ns-sub centered">Từ móng tay đến móng chân, chúng tôi mang đến dịch vụ nail chuyên nghiệp với các sản phẩm cao cấp.</p>
        </div>

        <div className="row g-4 mt-2">
          {services.map((svc, i) => (
            <div key={svc.id} className="col-sm-6 col-lg-3" data-reveal data-reveal-d={`d${i % 4}`}>
              <div className="ns-svc-card">
                <div className="ns-svc-thumb">
                  {svc.image
                    ? <img className="ns-svc-img" src={svc.image} alt={svc.name} loading="lazy" />
                    : <div style={{ width: '100%', height: '100%', background: 'var(--blush-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>💅</div>}
                </div>
                <div className="ns-svc-body">
                  {svc.tag && <span className="ns-svc-tag">{svc.tag}</span>}
                  <div className="ns-svc-name">{svc.name}</div>
                  <p className="ns-svc-desc">{svc.description}</p>
                  <div className="ns-svc-foot">
                    <span className="ns-svc-price">{svc.price}</span>
                    <Link to="/dich-vu" className="ns-svc-link">Xem thêm →</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-5" data-reveal>
          <Link to="/dich-vu" className="ns-btn-outline">Xem tất cả dịch vụ & bảng giá</Link>
        </div>
      </div>
    </section>
  )
}
