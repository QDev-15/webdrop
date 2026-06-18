import { useEffect, useRef } from 'react'
import { useSite } from '../contexts/SiteContext'

export default function About() {
  const { settings: s } = useSite()
  const ref = useRef<HTMLElement>(null)

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
  }, [s])

  const imgs = [
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&q=80&auto=format&fit=crop',
  ]

  return (
    <section className="sec-pad" style={{ background: 'var(--dark2)' }} ref={ref}>
      <div className="wd-container">
        <div className="row g-5 align-items-center">
          <div className="col-md-6 order-md-2" data-reveal style={{ opacity: 0, transform: 'translateY(28px)', transition: 'opacity .7s, transform .7s' }}>
            <div className="story-grid">
              {imgs.map((src, i) => (
                <div key={i} className="sg-item">
                  <img src={src} alt={`Không gian ${i + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-6 order-md-1 sec-dark" data-reveal style={{ opacity: 0, transform: 'translateY(28px)', transition: 'opacity .7s .1s, transform .7s .1s' }}>
            <div className="eyebrow">Câu chuyện của chúng tôi</div>
            <h2 className="sec-title">{s.about_title || 'Hơn <em>20 năm</em> gìn giữ hương vị'}</h2>
            {s.about_content ? (
              <p style={{ fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,.5)', lineHeight: 1.85, marginBottom: 32 }}>
                {s.about_content}
              </p>
            ) : (
              <>
                <p style={{ fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,.5)', lineHeight: 1.85, marginBottom: 16 }}>
                  Từ năm 2004, nhà hàng đã trở thành điểm hẹn ẩm thực của bao thế hệ gia đình. Chúng tôi không nấu để kiếm sống — chúng tôi nấu để giữ lại những hương vị mà người Việt không bao giờ muốn quên.
                </p>
                <p style={{ fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,.5)', lineHeight: 1.85, marginBottom: 32 }}>
                  Nguyên liệu được tuyển chọn từ 5 giờ sáng tại chợ đầu mối. Công thức gia truyền không bao giờ dùng bột ngọt, không chất bảo quản. Mỗi nồi nước dùng được ninh tối thiểu 12 giờ.
                </p>
              </>
            )}
            <div className="row g-3">
              <div className="col-4">
                <div className="story-stat-num">{s.about_stat_years || '20+'}</div>
                <div className="story-stat-label">Năm kinh nghiệm</div>
              </div>
              <div className="col-4">
                <div className="story-stat-num">{s.about_stat_dishes || '70+'}</div>
                <div className="story-stat-label">Món ăn đặc sắc</div>
              </div>
              <div className="col-4">
                <div className="story-stat-num">{s.about_stat_reviews || '450+'}</div>
                <div className="story-stat-label">Đánh giá 5 sao</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
