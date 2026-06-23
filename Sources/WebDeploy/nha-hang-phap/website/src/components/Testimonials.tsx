import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_title: string
  content: string
}

const FALLBACK: Testimonial[] = [
  { id: 1, author_name: 'Nguyễn Phương Linh', author_title: 'Food Critic · Hà Nội', content: '"Trải nghiệm ăn tối Pháp chân thực nhất mà tôi từng có ở Việt Nam. Không gian đẹp, đồ ăn tinh tế, và dịch vụ thực sự tuyệt vời — như đang ngồi ở một bistro tại Paris vậy."' },
  { id: 2, author_name: 'Thomas Beaumont', author_title: 'Chef Consultant · Paris & Hà Nội', content: '"Crème Brûlée ở đây là ngon nhất tôi từng ăn ngoài Paris. Chef thực sự hiểu ẩm thực Pháp — không phải phiên bản \'Việt hoá\' mà là bản gốc đích thực."' },
  { id: 3, author_name: 'Trần Đức Minh', author_title: 'Khách hàng thường xuyên', content: '"Tôi đặt bàn kỷ niệm 10 năm ngày cưới. Nhà hàng trang trí bàn đặc biệt theo yêu cầu, thực đơn được thiết kế riêng. Vợ tôi xúc động mãi đến tận hôm nay."' },
]

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([])

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials')
      .then(data => setItems(data.length > 0 ? data : FALLBACK))
      .catch(() => setItems(FALLBACK))
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      const els = document.querySelectorAll('.reveal:not(.visible)')
      const ro = new IntersectionObserver(entries =>
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      , { threshold: 0.08, rootMargin: '0px 0px -36px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(t)
  }, [items])

  return (
    <section className="sec-pad" style={{ background: 'var(--surface)' }}>
      <div className="wd-container">
        <div className="text-center reveal mb-5">
          <div className="eyebrow">Ce Qu'on Dit · Đánh giá</div>
          <h2 className="sec-title">Những gì thực khách<br /><em>cảm nhận</em></h2>
        </div>
        <div className="row g-3">
          {items.slice(0, 3).map((item, i) => (
            <div className="col-md-4" key={item.id}>
              <div className={`bq-review reveal reveal-d${i + 1}`}>
                <div className="bq-text">{item.content}</div>
                <div className="bq-name">{item.author_name}</div>
                <div className="bq-source">{item.author_title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
