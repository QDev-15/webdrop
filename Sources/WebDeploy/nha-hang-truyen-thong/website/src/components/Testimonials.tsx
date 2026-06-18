import { useState, useEffect, useRef } from 'react'
import { api } from '../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_title: string
  author_avatar: string
  content: string
  rating: number
}

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([])
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials').then(setItems).catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = ref.current?.querySelectorAll<Element>('[data-reveal]:not(.visible)') ?? []
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [items])

  const displayItems = items.length > 0 ? items : [
    { id: 1, author_name: 'Nguyễn Văn Hùng', author_title: 'Food Blogger · Hà Nội', author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&auto=format&fit=crop&crop=face', content: 'Phở bò ngon nhất tôi từng ăn ở Hà Nội. Nước dùng đậm đà, ngọt thanh tự nhiên. Thịt bò tươi mềm tan trong miệng. Không gian ấm cúng như bữa cơm nhà.', rating: 5 },
    { id: 2, author_name: 'Trần Minh Anh', author_title: 'Khách hàng thường xuyên', author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&auto=format&fit=crop&crop=face', content: 'Đặt bàn online dễ dàng, chỉ 5 phút. Bún bò Huế chuẩn vị hơn cả ngoài Huế. Chả lụa tự làm ngon lắm. Giá cả rất hợp lý cho chất lượng này.', rating: 5 },
    { id: 3, author_name: 'Phạm Quang Minh', author_title: 'Hướng dẫn viên du lịch', author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80&auto=format&fit=crop&crop=face', content: 'Đưa đoàn khách nước ngoài đến ăn, ai cũng trầm trồ. Không gian đậm chất Việt, món ăn chính gốc. Đây chắc chắn là địa chỉ tôi giới thiệu mỗi khi có khách từ xa đến.', rating: 5 },
  ]

  return (
    <section className="sec-pad" style={{ background: 'var(--surface)' }} ref={ref}>
      <div className="wd-container">
        <div className="text-center mb-5" data-reveal style={{ opacity: 0, transform: 'translateY(28px)', transition: 'opacity .7s, transform .7s' }}>
          <div className="eyebrow">Đánh giá</div>
          <h2 className="sec-title">Thực khách <em>nói gì về chúng tôi</em></h2>
        </div>
        <div className="row g-3">
          {displayItems.map((item, i) => (
            <div key={item.id} className="col-md-4">
              <div className={`rv reveal reveal-d${i + 1}`} data-reveal>
                <div className="rv-stars">{'★'.repeat(item.rating ?? 5)}</div>
                <div className="rv-text">"{item.content}"</div>
                <div className="rv-foot">
                  {item.author_avatar && (
                    <img className="rv-av" src={item.author_avatar} alt={item.author_name} loading="lazy" />
                  )}
                  <div>
                    <div className="rv-name">{item.author_name}</div>
                    <div className="rv-role">{item.author_title}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
