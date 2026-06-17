import { useState, useEffect } from 'react'
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
  { id: 1, author_name: 'Phạm Minh Tuấn', author_title: 'Kỹ sư · TP.HCM', author_avatar: 'https://images.unsplash.com/photo-1565689157206-0fddef7589a2?w=80&q=80', content: 'Cua rang me ở đây là tuyệt nhất tôi từng ăn. Cua tươi rõ ràng, thịt chắc và ngọt, sốt me vừa miệng không ngán. Gia đình 6 người ăn no nê, tốn chưa đến 1 triệu — giá rất hợp lý!', rating: 5 },
  { id: 2, author_name: 'Nguyễn Thanh Hoa', author_title: 'Giáo viên · Đà Nẵng', author_avatar: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=80&q=80', content: 'Tôm sú hấp sả ở đây cỡ to kinh, mỗi con gần 200g. Nhân viên tư vấn nhiệt tình, cho tự chọn con trong bể — cảm giác đó rất đặc biệt. Nhà hàng rộng rãi, đỗ xe dễ.', rating: 5 },
  { id: 3, author_name: 'Lê Văn Đức', author_title: 'Doanh nhân · Hà Nội', author_avatar: 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=80&q=80', content: 'Đã ăn hải sản nhiều nơi nhưng ở đây độ tươi khác hẳn. Mực nướng sa tế thơm, dai giòn đúng điệu. Đặt bàn online dễ, có xác nhận nhanh. Sẽ giới thiệu cho bạn bè!', rating: 5 },
]

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([])

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials')
      .then(data => setItems(data && data.length > 0 ? data : FALLBACK))
      .catch(() => setItems(FALLBACK))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('[data-reveal-rv]:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [items])

  return (
    <section className="sec-pad" style={{ background: 'var(--warm)' }}>
      <div className="wd-container">
        <div className="text-center reveal mb-5" data-reveal-rv>
          <div className="eyebrow">Đánh giá từ thực khách</div>
          <h2 className="sec-title">Khách nói gì về <em>Vị Biển</em></h2>
        </div>
        <div className="row g-4">
          {items.slice(0, 3).map((rv, i) => (
            <div key={rv.id} className="col-md-4">
              <div className={`rv reveal reveal-d${i + 1}`} data-reveal-rv>
                <div className="rv-stars">{'★'.repeat(Math.min(rv.rating, 5))}</div>
                <div className="rv-text">"{rv.content}"</div>
                <div className="rv-foot">
                  {rv.author_avatar && (
                    <img className="rv-av" src={rv.author_avatar} alt={rv.author_name} loading="lazy"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  )}
                  <div>
                    <div className="rv-name">{rv.author_name}</div>
                    <div className="rv-role">{rv.author_title}</div>
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
