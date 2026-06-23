import { useEffect, useRef, useState } from 'react'
import { api } from '../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_title: string
  author_avatar: string
  content: string
  rating: number
}

const STATIC_TESTIMONIALS: Testimonial[] = [
  { id: 1, author_name: 'Nguyễn Đức Thắng', author_title: 'Food Blogger · TP.HCM', author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&auto=format&fit=crop&crop=face', content: 'Bò ribeye nướng than hoa ngon khỏi phải bàn. Thịt tươi, ướp đậm đà, nhân viên hướng dẫn nướng tận tình. Sẽ còn quay lại nhiều lần!', rating: 5 },
  { id: 2, author_name: 'Lê Thị Bích Ngọc', author_title: 'Khách hàng thường xuyên', author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&auto=format&fit=crop&crop=face', content: 'Đặt tiệc sinh nhật cho nhóm 12 người. Phòng VIP rộng rãi, nhân viên chuyên nghiệp. Combo Hoàng Gia rất xứng đáng giá tiền, ai cũng khen.', rating: 5 },
  { id: 3, author_name: 'Trần Quang Huy', author_title: 'Khách đặt tiệc doanh nghiệp', author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80&auto=format&fit=crop&crop=face', content: 'Hệ thống hút khói tốt, không bị ám mùi áo. Bò Wagyu chảy tan trong miệng. Không gian rộng, âm nhạc vừa phải — hoàn hảo cho buổi tụ họp cuối tuần.', rating: 5 },
]

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([])
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials')
      .then(data => setItems(data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      const els = ref.current?.querySelectorAll<HTMLElement>('[data-reveal]:not(.visible)')
      if (!els?.length) return
      const ro = new IntersectionObserver(entries =>
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      , { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(t)
  }, [items])

  const display = items.length > 0 ? items : STATIC_TESTIMONIALS

  return (
    <section ref={ref} className="sec-pad" style={{ background: 'var(--surface)' }}>
      <div className="wd-container">
        <div className="text-center" data-reveal style={{ marginBottom: 40 }}>
          <div className="eyebrow">Đánh giá</div>
          <h2 className="sec-title">Khách hàng <em>nói gì</em> về chúng tôi</h2>
        </div>
        <div className="row g-3">
          {display.map((item) => (
            <div key={item.id} className="col-md-4" data-reveal>
              <div className="rv">
                <div className="rv-stars">{'★'.repeat(item.rating || 5)}</div>
                <div className="rv-text">"{item.content}"</div>
                <div className="rv-foot">
                  {item.author_avatar && <img className="rv-av" src={item.author_avatar} alt={item.author_name} loading="lazy" />}
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
