import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface Service {
  id: number
  name: string
  description: string
  duration: number
  level: string
  image: string
  max_capacity: number
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Service[]>('/public/services').then(data => {
      setServices(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <section className="sec-pad yw-strip">
      <div className="wd-container">
        <div className="yw-sec-header text-center mb-5" data-reveal>
          <div className="yw-eyebrow">Các Lớp Học</div>
          <h2 className="yw-title">Chương trình yoga <em>đa dạng</em></h2>
          <p className="yw-sub centered">Từ cơ bản đến nâng cao, mỗi lớp được thiết kế để nuôi dưỡng thân và tâm</p>
        </div>

        {loading ? (
          <div className="text-center py-5">Đang tải...</div>
        ) : services.length === 0 ? (
          <div className="text-center py-5 text-muted">Chưa có lớp học nào</div>
        ) : (
          <div className="row g-4">
            {services.map((service, idx) => (
              <div key={service.id} className={`col-lg-6 rd${(idx % 3) + 1}`} data-reveal>
                <div className="yw-class-card">
                  <img src={service.image} alt={service.name} className="yw-card-img" onError={e => { e.currentTarget.src = 'https://via.placeholder.com/600x400?text=' + encodeURIComponent(service.name) }} />
                  <div className="yw-card-body">
                    {service.level && <div className="yw-card-badge">{service.level}</div>}
                    <h3 className="yw-card-title">{service.name}</h3>
                    <p className="yw-card-desc">{service.description}</p>
                    <div className="yw-card-meta">
                      {service.duration && <span>⏱️ {service.duration} phút</span>}
                      {service.max_capacity && <span>👥 Tối đa {service.max_capacity} người</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
