import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_title: string
  content: string
  rating: number
  emoji: string
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    author_name: 'Minh Châu',
    author_title: 'Khách hàng thân thiết',
    content: 'Chiếc bánh kem sinh nhật tôi đặt cho con gái thực sự tuyệt vời! Không chỉ đẹp mà còn ngon không kém. Kem bơ Pháp mịn màng, bánh bông lan nhẹ xốp. Sẽ tiếp tục đặt cho các dịp đặc biệt khác!',
    rating: 5,
    emoji: '💖',
  },
  {
    id: 2,
    author_name: 'Thanh Hương',
    author_title: 'Food blogger',
    content: 'Là người mê bánh ngọt, tôi đã thử rất nhiều tiệm bánh ở Sài Gòn nhưng macaron của La Douceur thực sự ở một đẳng cấp khác. Vỏ giòn, nhân mềm mịn, hương vị tinh tế. Xứng đáng 5 sao!',
    rating: 5,
    emoji: '🎂',
  },
  {
    id: 3,
    author_name: 'Gia đình Tuấn Anh',
    author_title: 'Khách hàng thân thiết',
    content: 'Chúng tôi đặt bánh cưới tại La Douceur và không thể hài lòng hơn. Bánh vừa đẹp vừa ngon, dịch vụ chu đáo. Thợ bánh còn tư vấn rất nhiệt tình để thiết kế phù hợp với chủ đề đám cưới của chúng tôi.',
    rating: 5,
    emoji: '🌸',
  },
]

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([])

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials')
      .then(setItems)
      .catch(() => {})
  }, [])

  const displayItems = items.length > 0 ? items : DEFAULT_TESTIMONIALS

  return (
    <>
      <section className="sec-pad" style={{ background: 'var(--warm)' }}>
        <div className="wd-container">
          <div className="text-center mb-5" data-reveal>
            <div className="eyebrow">Đánh giá khách hàng</div>
            <h2 className="sec-title">Khách hàng <em>nói gì về chúng tôi</em></h2>
            <p className="sec-sub">Hơn 3,000 đơn hàng mỗi tháng — niềm tin của bạn là động lực lớn nhất</p>
          </div>
          <div className="row g-4">
            {displayItems.slice(0, 3).map((t, i) => (
              <div key={t.id} className={`col-md-4 reveal reveal-d${i + 1}`} data-reveal>
                <div className="cute-review">
                  <div className="cr-emoji">{t.emoji}</div>
                  <div className="cr-stars">{'★'.repeat(Math.min(t.rating, 5))}</div>
                  <p className="cr-text">"{t.content}"</p>
                  <div className="cr-foot">
                    <div>
                      <div className="cr-name">{t.author_name}</div>
                      {t.author_title && <div className="cr-info">{t.author_title}</div>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="cta-sec">
        <div className="wd-container">
          <div className="cta-title">Sẵn sàng đặt chiếc bánh <em style={{ fontStyle: 'italic', fontWeight: 300 }}>hoàn hảo</em> của bạn?</div>
          <p className="cta-sub">Liên hệ chúng tôi hôm nay — đặt trước tối thiểu 3–5 ngày để có bánh đẹp nhất!</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap" style={{ position: 'relative' }}>
            <a href="/dat-hang" className="btn-white">Đặt bánh ngay</a>
            <a href="/san-pham" className="btn-outline-light">Xem sản phẩm</a>
          </div>
        </div>
      </section>
    </>
  )
}
