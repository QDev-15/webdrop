import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_meta: string
  author_avatar: string
  stars: number
  quote: string
  is_active: number
}

const FALLBACK: Testimonial[] = [
  { id: 1, author_name: 'Chị Lan Anh', author_meta: 'Khách hàng (Niềng răng Invisalign)', author_avatar: '', stars: 5, quote: 'Phòng khám có không khí rất riêng biệt và thú vị. Bác sĩ rất tận tâm, giải thích rõ từng bước điều trị. Răng tôi sau 18 tháng như thế nào rồi đó, đẹp lắm!', is_active: 1 },
  { id: 2, author_name: 'Anh Minh Đức', author_meta: 'Khách hàng (Trồng răng Implant)', author_avatar: '', stars: 5, quote: 'Trước đây tôi rất sợ đến nha sĩ nhưng từ khi biết Nụ Cười Xưa thì khác hoàn toàn. Giá cả hợp lý, bác sĩ kỹ năng, dịch vụ chuyên nghiệp. Strongly recommend!', is_active: 1 },
  { id: 3, author_name: 'Chị Thu Hà', author_meta: 'Khách hàng (Tẩy trắng răng)', author_avatar: '', stars: 5, quote: 'Tẩy trắng răng tại đây cho kết quả vượt ngoài mong đợi. Răng trắng sáng hơn nhiều mà không bị ê buốt gì cả. Rất hài lòng với dịch vụ!', is_active: 1 },
]

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials')
      .then(data => setItems(data.filter(t => t.is_active)))
      .catch(() => setItems(FALLBACK))
      .finally(() => setLoading(false))
  }, [])

  const reviews = items.length > 0 ? items : (loading ? [] : FALLBACK)

  return (
    <section className="sec-pad" style={{ background: 'var(--bg)' }}>
      <div className="wd-container">
        <div style={{ marginBottom: '52px' }} data-reveal>
          <div className="nc-eyebrow">Cảm nhận khách hàng</div>
          <h2 className="nc-title">Họ nói gì về <span>chúng tôi</span></h2>
          <p className="nc-sub">Những cảm nhận thật của khách hàng đã trải nghiệm dịch vụ tại Nụ Cười Xưa Nha Khoa.</p>
        </div>

        <ul className="nc-list" data-reveal>
          {reviews.map(t => (
            <li key={t.id} className="nc-list-item">
              <div className="nc-list-left">
                <div className="nc-list-stars">
                  {'★'.repeat(Math.min(5, t.stars || 5))}{'☆'.repeat(Math.max(0, 5 - (t.stars || 5)))}
                </div>
                <p className="nc-list-quote">"{t.quote}"</p>
                <div className="nc-list-meta">
                  <span>{t.author_name}</span>
                  {t.author_meta && <> — {t.author_meta}</>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
