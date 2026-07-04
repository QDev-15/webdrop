import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Service {
  id: number
  name: string
  description: string
  price: string
  image: string
  category_name?: string
}

interface Props {
  limit?: number
  showViewAll?: boolean
}

const serviceImages: Record<string, string> = {
  'Cấy ghép Implant': 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=640&q=75&auto=format&fit=crop',
  'Niềng răng Invisalign': 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=640&q=75&auto=format&fit=crop',
  'Dán sứ Veneer': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=640&q=75&auto=format&fit=crop',
  'Trồng răng sứ': 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=640&q=75&auto=format&fit=crop',
  'Nha khoa tổng quát': 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=640&q=75&auto=format&fit=crop',
  'Tẩy trắng răng Laser': 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=640&q=75&auto=format&fit=crop',
}

const fallbackImg = 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=640&q=75&auto=format&fit=crop'

export default function Services({ limit, showViewAll }: Props) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Service[]>('/public/services')
      .then(data => setServices(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const displayed = limit ? services.slice(0, limit) : services

  if (loading) {
    return (
      <div className="wd-container">
        <div className="st-grid-cards">
          {[1, 2, 3].map(i => (
            <div key={i} className="st-service-card">
              <div className="st-service-thumb st-skeleton" style={{ aspectRatio: '16/11', opacity: 0.5 }} />
              <div className="st-service-body">
                <div className="st-skeleton" style={{ height: 12, width: '40%', marginBottom: 10 }} />
                <div className="st-skeleton" style={{ height: 18, width: '80%', marginBottom: 10 }} />
                <div className="st-skeleton" style={{ height: 12, width: '100%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (displayed.length === 0) return null

  return (
    <div className="wd-container">
      {showViewAll && (
        <div className="st-sec-header" data-reveal style={{ marginBottom: 40, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
          <div>
            <div className="st-eyebrow">Dịch vụ nổi bật</div>
            <h2 className="st-sec-title" style={{ marginBottom: 0 }}>Điều trị <span className="st-grad-text">ứng dụng công nghệ cao</span></h2>
          </div>
          <Link to="/dich-vu" className="st-btn st-btn-glass st-btn-sm" style={{ flexShrink: 0 }}>
            Xem tất cả dịch vụ
          </Link>
        </div>
      )}
      <div className="st-grid-cards">
        {displayed.map((s, i) => {
          const img = s.image || serviceImages[s.name] || fallbackImg
          return (
            <div key={s.id} className="st-service-card" data-reveal data-reveal-delay={i > 0 && i < 4 ? String(i) : undefined}>
              <div className="st-service-thumb">
                <img src={img} alt={s.name} loading="lazy" />
                {s.price && <span className="st-service-price">{s.price}</span>}
              </div>
              <div className="st-service-body">
                {s.category_name && <span className="tag">{s.category_name}</span>}
                <h3>{s.name}</h3>
                <p>{s.description}</p>
                <Link to="/dat-lich" className="st-service-link">
                  Đặt lịch tư vấn
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
