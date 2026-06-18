import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function HeroSlider() {
  const { slides, settings } = useSite()
  const [current, setCurrent] = useState(0)

  const items = slides.length > 0 ? slides : [
    {
      id: 0,
      title: 'Hương vị gia truyền đích thực',
      subtitle: 'Mỗi món ăn là một hành trình về ký ức — được nấu từ công thức gia truyền, nguyên liệu tươi sạch tuyển chọn mỗi sáng và trái tim người đầu bếp.',
      button_text: 'Xem thực đơn',
      button_link: '/thuc-don',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=60&auto=format&fit=crop',
      sort_order: 1,
    },
  ]

  const slide = items[current]
  const tagline = settings.about_tagline || 'Nhà hàng ẩm thực truyền thống từ 2004'

  useEffect(() => {
    if (items.length <= 1) return
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % items.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [items.length])

  return (
    <section className="hero">
      <div
        className="hero-bg"
        style={{ backgroundImage: `url('${slide.image}')` }}
      />
      <div className="hero-overlay" />
      <div className="wd-container w-100 position-relative" style={{ zIndex: 2 }}>
        <div className="row">
          <div className="col-lg-6">
            <div className="hero-badge">✦ {tagline}</div>
            <h1 className="hero-title">
              Hương vị<br /><em>gia truyền</em><br />đích thực.
            </h1>
            <p className="hero-sub">{slide.subtitle}</p>
            <div className="d-flex gap-3 flex-wrap">
              <Link to="/thuc-don" className="btn-white">Xem thực đơn →</Link>
              <Link to="/dat-ban" className="btn-accent">Đặt bàn ngay</Link>
            </div>
            <div className="hero-meta">
              <div className="hm-item"><span className="hm-dot" />{settings.working_hours || 'Mở cửa 10:00 – 22:00'}</div>
              <div className="hm-item"><span className="hm-dot" />Hơn 120 chỗ ngồi</div>
              <div className="hm-item"><span className="hm-dot" />4.8 ★ 450+ đánh giá</div>
              <div className="hm-item"><span className="hm-dot" />Bãi đỗ xe miễn phí</div>
            </div>
          </div>
        </div>
      </div>

      {items.length > 1 && (
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 3 }}>
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? 24 : 8, height: 8, borderRadius: 4,
                border: 'none', cursor: 'pointer', padding: 0,
                background: i === current ? '#fbbf24' : 'rgba(255,255,255,.3)',
                transition: 'all .3s',
              }}
            />
          ))}
        </div>
      )}
    </section>
  )
}
