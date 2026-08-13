import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_role: string
  author_avatar: string
  rating: number
  content: string
  featured: number
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials').then(data => {
      setTestimonials(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const renderStars = (rating: number) => {
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating))
  }

  return (
    <section className="sec-pad yw-strip">
      <div className="wd-container">
        <div className="yw-sec-header text-center mb-5" data-reveal>
          <div className="yw-eyebrow">Đánh Giá</div>
          <h2 className="yw-title">Khách hàng <em>hài lòng</em></h2>
          <p className="yw-sub centered">Những lời nhận xét từ những người tập yoga tại trung tâm</p>
        </div>

        {loading ? (
          <div className="text-center py-5">Đang tải...</div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-5 text-muted">Chưa có đánh giá nào</div>
        ) : (
          <div className="row g-4">
            {testimonials.map((t, idx) => (
              <div key={t.id} className={`col-md-6 col-lg-4 rd${(idx % 3) + 1}`} data-reveal>
                <div className="yw-review">
                  <div className="yw-rv-stars">{renderStars(t.rating)}</div>
                  <p className="yw-rv-text">"{t.content}"</p>
                  <div className="yw-rv-foot">
                    {t.author_avatar && <img src={t.author_avatar} alt={t.author_name} className="yw-rv-av" onError={e => { e.currentTarget.style.display = 'none' }} />}
                    <div>
                      <div className="yw-rv-name">{t.author_name}</div>
                      {t.author_role && <div className="yw-rv-role">{t.author_role}</div>}
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
