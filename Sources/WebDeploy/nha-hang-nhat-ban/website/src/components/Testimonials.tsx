import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_title: string
  content: string
  rating: number
}

const fallback: Testimonial[] = [
  { id: 1, author_name: 'Nguyễn Thanh Hà', author_title: 'Giám đốc điều hành · TP.HCM', rating: 5, content: 'Tôi đã ăn omakase ở nhiều nơi trên thế giới, nhưng bữa ăn tại đây là một trong những trải nghiệm đáng nhớ nhất. Bếp trưởng giải thích tỉ mỉ từng nguyên liệu, cách kết hợp hương vị — cảm giác như đang học một lớp ẩm thực cao cấp. Otoro tan ngay khi vừa đặt vào miệng.' },
  { id: 2, author_name: 'David Chen', author_title: 'Doanh nhân · Singapore', rating: 5, content: 'Không gian tối giản nhưng rất tinh tế — ánh sáng, âm nhạc, từng chi tiết đều được tính toán để không làm phân tán khỏi món ăn. Uni don là món tôi sẽ quay lại chỉ vì nó. Dịch vụ hoàn hảo từ đầu đến cuối.' },
  { id: 3, author_name: 'Trần Minh Khải', author_title: 'Food blogger · Hà Nội', rating: 5, content: 'Hakata Ramen ở đây chuẩn Fukuoka hơn nhiều nhà hàng tôi từng thử tại Nhật. Nước dùng đặc, béo, thơm mà không ngán. Mì đúng độ dai. Nhân viên phục vụ có thể tư vấn sake phù hợp với từng món rất chuyên nghiệp.' },
]

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials')
      .then(data => setItems(data.length ? data : fallback))
      .catch(() => setItems(fallback))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('.reveal:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [items])

  if (loading) return null

  return (
    <section className="sec-pad reviews-sec">
      <div className="wd-container">
        <div className="row align-items-center mb-5">
          <div className="col-md-6 reveal">
            <div className="eyebrow">Đánh giá thực khách</div>
            <h2 className="sec-title">Họ nói gì về<br /><em>trải nghiệm</em></h2>
          </div>
          <div className="col-md-6 text-md-end reveal reveal-d1">
            <div style={{ fontSize: '48px', fontWeight: 300, color: 'var(--text)', letterSpacing: '-2px', lineHeight: 1 }}>4.9</div>
            <div style={{ color: '#f59e0b', fontSize: '15px', letterSpacing: '2px' }}>★★★★★</div>
            <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px' }}>Trên 320 đánh giá Google</div>
          </div>
        </div>
        {items.map((item, i) => (
          <div key={item.id} className={`minimal-review reveal${i > 0 ? ` reveal-d${Math.min(i, 2) as 1 | 2}` : ''}`}>
            <div className="mr-stars">{'★'.repeat(item.rating)}</div>
            <p className="mr-text">"{item.content}"</p>
            <div className="mr-author">
              <span>{item.author_name}</span> {item.author_title ? `· ${item.author_title}` : ''}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
