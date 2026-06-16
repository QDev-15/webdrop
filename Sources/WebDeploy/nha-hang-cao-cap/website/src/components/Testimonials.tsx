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
  {
    id: 1,
    author_name: 'Anh Minh Đức',
    author_title: 'CEO · Tập đoàn Nhất Phú',
    author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    content: 'La Maison là nơi tôi tin tưởng mỗi khi cần tiếp đón đối tác quốc tế. Thức ăn đỉnh cao, không gian sang trọng và dịch vụ hoàn hảo — mọi bữa ăn đều là trải nghiệm đáng nhớ.',
    rating: 5,
  },
  {
    id: 2,
    author_name: 'Chị Linh Phương',
    author_title: 'Food Critic · Tạp chí Ẩm Thực',
    author_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    content: 'Wagyu A5 tại La Maison là một trong những món bít tết tốt nhất tôi từng thưởng thức tại Hà Nội. Đầu bếp hiểu rõ kỹ thuật sous vide và không ngại đầu tư vào chất lượng nguyên liệu.',
    rating: 5,
  },
  {
    id: 3,
    author_name: 'Chị Nguyễn Thị Hương',
    author_title: 'Giám đốc Marketing · Luxury Brand',
    author_avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80',
    content: 'Tổ chức tiệc kỷ niệm 10 năm công ty tại La Maison — sự kiện diễn ra hoàn hảo từ đầu đến cuối. Team sự kiện rất chuyên nghiệp, thực đơn tasting 8 món xuất sắc từng chi tiết.',
    rating: 5,
  },
]

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials')
      .then(d => setItems(d || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('[data-reveal-rv]:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) }
        })
      }, { threshold: 0.05 })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [items])

  const displayItems = items.length > 0 ? items : FALLBACK

  if (loading) return null

  return (
    <section className="sec-pad">
      <div className="wd-container">
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 5vw, 56px)' }}>
          <div className="eyebrow">Đánh giá</div>
          <h2 className="sec-title" style={{ marginBottom: 0 }}>
            Khách hàng <em>nói gì</em>
          </h2>
        </div>

        <div className="row g-3">
          {displayItems.slice(0, 3).map((item, i) => (
            <div key={item.id} className={`col-md-4 reveal reveal-d${i + 1}`} data-reveal-rv>
              <div className="rv">
                <div className="rv-quote">"</div>
                <div style={{ color: '#f59e0b', fontSize: 13, marginBottom: 12 }}>
                  {'★'.repeat(item.rating ?? 5)}
                </div>
                <p className="rv-text">{item.content}</p>
                <div className="rv-foot">
                  {item.author_avatar ? (
                    <img src={item.author_avatar} alt={item.author_name} className="rv-av" />
                  ) : (
                    <div className="rv-av" style={{ background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👤</div>
                  )}
                  <div>
                    <div className="rv-name">{item.author_name}</div>
                    {item.author_title && <div className="rv-role">{item.author_title}</div>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Awards row */}
        <div style={{ marginTop: 'clamp(48px, 6vw, 72px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
            {[
              { icon: '🏆', name: 'Michelin Guide 2024', year: 'Recommended' },
              { icon: '⭐', name: 'Best Fine Dining', year: 'Hà Nội 2023' },
              { icon: '🍷', name: 'Wine Spectator Award', year: '2022–2024' },
              { icon: '🌿', name: 'Green Restaurant', year: 'Certified 2023' },
              { icon: '👨‍🍳', name: 'Best Chef Award', year: 'Vietnam 2022' },
            ].map(aw => (
              <div key={aw.name} className="award-badge">
                <div className="ab-icon">{aw.icon}</div>
                <div className="ab-name">{aw.name}</div>
                <div className="ab-year">{aw.year}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
