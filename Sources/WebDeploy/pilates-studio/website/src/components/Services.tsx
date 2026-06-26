import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Service {
  id: number
  name: string
  slug: string
  description: string
  image_url: string
  tag: string
  level: string
  duration_min: number | null
  max_students: number | null
  price_per_session: number | null
  is_featured: number
  category_name: string | null
}

const LEVEL_LABEL: Record<string, string> = {
  all: 'Mọi trình độ', beginner: 'Người mới', intermediate: 'Trung cấp', advanced: 'Nâng cao',
}

function priceStr(price: number | null) {
  if (!price) return ''
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}

export default function Services({ featured }: { featured?: boolean }) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    api.get<Service[]>('/public/services')
      .then(data => setServices(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const displayed = featured ? services.filter(s => s.is_featured).slice(0, 4) : services

  return (
    <section className="ps-services sec-pad">
      <div className="wd-container">
        <div className="text-center reveal">
          <div className="ps-eyebrow">{featured ? 'Dịch vụ nổi bật' : 'Tất cả lớp học'}</div>
          <h2 className="ps-sec-title">Lớp học & dịch vụ<br /><em>của chúng tôi.</em></h2>
          <p className="ps-sec-sub">Pilates Mat, Reformer, Clinical và Prenatal — mỗi lớp được thiết kế theo mục tiêu và trình độ cụ thể.</p>
        </div>

        <div className="row g-4 mt-2">
          {loading && [1,2,3,4].map(i => (
            <div key={i} className="col-md-6 col-lg-3">
              <div className="ps-svc-card" style={{ minHeight: 340, background: 'var(--warm)', borderRadius: 14, animation: 'shimmer 1.5s infinite' }} />
            </div>
          ))}
          {!loading && displayed.map((svc, i) => (
            <div key={svc.id} className={`col-md-6 col-lg-3 reveal reveal-d${Math.min(i % 4, 3) as 0|1|2|3}`}>
              <div className="ps-svc-card">
                <div className="ps-svc-img-wrap">
                  <img src={svc.image_url || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=70&auto=format&fit=crop'} alt={svc.name} className="ps-svc-img" />
                  {svc.tag && <div className="ps-svc-tag">{svc.tag}</div>}
                </div>
                <div className="ps-svc-body">
                  {svc.category_name && <div className="ps-svc-cat">{svc.category_name}</div>}
                  <h3 className="ps-svc-name">{svc.name}</h3>
                  {svc.description && <p className="ps-svc-desc">{svc.description.slice(0, 90)}{svc.description.length > 90 ? '…' : ''}</p>}
                  <div className="ps-svc-meta">
                    {svc.level && <span className="ps-svc-meta-item">{LEVEL_LABEL[svc.level] || svc.level}</span>}
                    {svc.duration_min && <span className="ps-svc-meta-item">{svc.duration_min} phút</span>}
                    {svc.max_students && <span className="ps-svc-meta-item">≤ {svc.max_students} người</span>}
                  </div>
                  <div className="ps-svc-footer">
                    {svc.price_per_session ? (
                      <div className="ps-svc-price">{priceStr(svc.price_per_session)}<span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 400 }}>/buổi</span></div>
                    ) : <div className="ps-svc-price-empty"></div>}
                    <Link to="/dat-lich" className="ps-btn-solid" style={{ padding: '8px 16px', fontSize: 13 }}>Đăng ký</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {featured && services.length > 4 && (
          <div className="text-center mt-5 reveal">
            <Link to="/dich-vu" className="ps-btn-ghost">Xem tất cả lớp học</Link>
          </div>
        )}
      </div>
    </section>
  )
}
