import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Service {
  id: number
  name: string
  tag: string
  description: string
  image: string
  price_from: number
  duration: string
  featured: number
  active: number
}

function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + 'k'
}

interface ServicesProps {
  limit?: number
  showViewAll?: boolean
}

export default function Services({ limit = 6, showViewAll = true }: ServicesProps) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Service[]>('/public/services')
      .then(data => setServices(data.filter(s => s.active)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Re-observe reveal after async data renders (Rule 26)
  useEffect(() => {
    if (services.length === 0) return
    const t = setTimeout(() => {
      const els = document.querySelectorAll('[data-reveal]:not(.visible)')
      const ro = new IntersectionObserver(
        entries => entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) }
        }),
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      )
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(t)
  }, [services])

  const displayServices = services.slice(0, limit)

  return (
    <section className="sec-pad" style={{ background: 'var(--bg)' }}>
      <div className="wd-container">
        <div className="text-center mb-5" data-reveal>
          <div className="mrt-label">
            <span className="mrt-label-line" />
            Dịch vụ
            <span className="mrt-label-line" />
          </div>
          <h2 className="mrt-heading">Các liệu trình <em>massage</em> chuyên sâu</h2>
          <p className="mrt-subtext mx-auto">
            Từ massage Thái cổ truyền đến liệu trình đá nóng hiện đại — mỗi dịch vụ được thiết kế để mang lại sự thư giãn và phục hồi tối ưu.
          </p>
        </div>

        {loading ? (
          <div className="text-center" style={{ color: 'var(--text-3)', padding: '40px 0' }}>Đang tải dịch vụ...</div>
        ) : (
          <div className="row g-4">
            {displayServices.map((svc, i) => (
              <div key={svc.id} className="col-md-6 col-lg-4" data-reveal>
                <div className="mrt-svc-card">
                  <div className="mrt-svc-thumb-wrap">
                    <img
                      className="mrt-svc-thumb"
                      src={svc.image || 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=75&auto=format&fit=crop'}
                      alt={svc.name}
                      loading={i < 3 ? 'eager' : 'lazy'}
                    />
                  </div>
                  <div className="mrt-svc-body">
                    {svc.tag && <span className="mrt-svc-tag">{svc.tag}</span>}
                    <div className="mrt-svc-name">{svc.name}</div>
                    <p className="mrt-svc-desc">{svc.description}</p>
                    <div className="mrt-svc-footer">
                      <span className="mrt-svc-price">Từ {formatPrice(svc.price_from)}</span>
                      <span className="mrt-svc-duration">{svc.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showViewAll && !loading && services.length > limit && (
          <div className="text-center mt-5" data-reveal>
            <Link to="/dich-vu" className="mrt-btn-outline">Xem tất cả dịch vụ &amp; bảng giá &rarr;</Link>
          </div>
        )}
      </div>
    </section>
  )
}
