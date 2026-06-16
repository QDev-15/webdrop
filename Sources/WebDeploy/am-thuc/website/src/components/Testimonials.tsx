import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_title: string
  author_avatar: string
  content: string
  rating: number
}

const FALLBACK: Testimonial[] = [
  { id: 1, author_name: 'Nguyễn Văn Hùng', author_title: 'Food Blogger · Hà Nội', author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&auto=format&fit=crop&crop=face', content: 'Phở bò ngon nhất Hà Nội tôi từng ăn. Nước dùng đậm đà, thịt tươi mềm. Không gian ấm cúng, phục vụ chu đáo.', rating: 5 },
  { id: 2, author_name: 'Trần Minh Anh', author_title: 'Khách hàng thường xuyên', author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&auto=format&fit=crop&crop=face', content: 'Đặt bàn dễ dàng, không phải chờ. Bún bò Huế chuẩn vị, ngon hơn cả ngoài Huế. Sẽ quay lại ngay tuần tới!', rating: 5 },
  { id: 3, author_name: 'Phạm Quang Minh', author_title: 'Du khách quốc tế', author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80&auto=format&fit=crop&crop=face', content: 'Không gian đẹp, sạch sẽ. Nhân viên thân thiện. Đưa khách nước ngoài đến ăn, ai cũng khen nức nở.', rating: 5 },
]

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([])

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials')
      .then(data => setItems(data.length > 0 ? data : FALLBACK))
      .catch(() => setItems(FALLBACK))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('[data-reveal]:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) }
        })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [items])

  const display = items.slice(0, 3)

  return (
    <section className="sec-pad" style={{ background: 'var(--surface)' }}>
      <div className="wd-container">
        <div className="text-center reveal mb-5" data-reveal>
          <div className="eyebrow">Đánh giá</div>
          <h2 className="sec-title">Thực khách <em>nói gì</em></h2>
        </div>
        <div className="row g-3">
          {display.map((item, i) => (
            <div key={item.id} className="col-md-4">
              <div className={`rv reveal reveal-d${i + 1}`} data-reveal>
                <div className="rv-stars">{'★'.repeat(item.rating)}</div>
                <div className="rv-text">"{item.content}"</div>
                <div className="rv-foot">
                  {item.author_avatar && (
                    <img className="rv-av" src={item.author_avatar} alt={item.author_name} />
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
