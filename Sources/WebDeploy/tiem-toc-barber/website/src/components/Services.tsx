import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Service {
  id: number
  name: string
  note: string
  description: string
  price_text: string
  image: string
  category_name: string
  category_tag: string
}

export default function Services() {
  const [items, setItems] = useState<Service[]>([])

  useEffect(() => {
    api.get<Service[]>('/public/services?featured=1').then(setItems).catch(() => {})
  }, [])

  return (
    <section className="sec-pad" style={{ background: 'var(--bg)' }}>
      <div className="wd-container">
        <div className="text-center mb-5" data-reveal>
          <div className="tb-eyebrow">Dịch vụ</div>
          <h2 className="tb-title">Chúng tôi <em>làm gì</em></h2>
          <p className="tb-sub mx-auto">Từ cắt tóc kinh điển đến các kỹ thuật tạo kiểu hiện đại — mỗi dịch vụ được thực hiện với sự tỉ mỉ của nghề thủ công.</p>
        </div>
        <div className="row g-4">
          {items.map((s, i) => (
            <div className="col-md-6 col-lg-3" data-reveal data-delay={String(Math.min(i + 1, 3))} key={s.id}>
              <div className="tb-svc-card">
                <div className="tb-svc-img">
                  <img src={s.image} alt={s.name} />
                </div>
                <div className="tb-svc-body">
                  <span className="tb-svc-tag">{s.category_tag || s.category_name}</span>
                  <h3 className="tb-svc-name">{s.name}</h3>
                  <p className="tb-svc-desc">{s.description || s.note}</p>
                  <div className="tb-svc-price"><span className="tb-svc-price-from">từ</span>{s.price_text}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-5" data-reveal>
          <Link to="/dich-vu" className="tb-btn-outline">Xem đầy đủ dịch vụ &amp; bảng giá</Link>
        </div>
      </div>
    </section>
  )
}
