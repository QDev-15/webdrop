import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function HeroSlider() {
  const { settings, slides } = useSite()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const id = setInterval(() => {
      setCurrent(c => (c + 1) % slides.length)
    }, 5000)
    return () => clearInterval(id)
  }, [slides.length])

  // Fallback slide from settings
  const fallbackSlide = {
    id: 0,
    title: 'Ăn chay, sống tươi xanh, tâm thêm tịnh.',
    subtitle: settings.site_description || 'Mỗi món ăn là một lựa chọn yêu thương — yêu bản thân, yêu thiên nhiên và yêu những người xung quanh bạn.',
    button_text: 'Xem thực đơn',
    button_link: '/thuc-don',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&q=80&auto=format&fit=crop',
    sort_order: 1,
  }

  const displaySlides = slides.length > 0 ? slides : [fallbackSlide]
  const slide = displaySlides[current] || displaySlides[0]

  return (
    <section className="hero">
      <div className="wd-container hero-inner">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6">
            <div style={{ display: 'inline-block', fontSize: '11px', fontWeight: 500, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.4px', marginBottom: '18px', borderBottom: '2px solid var(--accent-light)', paddingBottom: '4px' }}>
              Ẩm thực lành mạnh từ thiên nhiên
            </div>
            <h1
              className="hero-title"
              dangerouslySetInnerHTML={{ __html: slide.title.replace(',', ',<br>').replace('xanh,', 'xanh,<br>') }}
            />
            <p className="hero-sub">{slide.subtitle}</p>
            <div className="hero-pills">
              <span className="hero-pill">🌱 100% Thuần Chay</span>
              <span className="hero-pill">🌿 Nguyên Liệu Organic</span>
              <span className="hero-pill">✨ Không Chất Bảo Quản</span>
            </div>
            <div className="d-flex gap-3 flex-wrap">
              <Link to={slide.button_link || '/thuc-don'} className="btn-accent">
                {slide.button_text || 'Xem thực đơn'} →
              </Link>
              <Link to="/ve-chung-toi" className="btn-ghost">Câu chuyện của chúng tôi</Link>
            </div>
          </div>
          <div className="col-lg-6 reveal">
            <div className="hero-image-card">
              <img
                className="hero-food-img"
                src={slide.image || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&q=80&auto=format&fit=crop'}
                alt={slide.title}
                loading="lazy"
              />
              <div className="hero-card-caption">
                <div className="hcc-name">Salad Rau Mầm &amp; Quinoa</div>
                <div className="hcc-badge">Thực đơn hôm nay</div>
              </div>
            </div>
            <div className="row g-3 mt-3">
              <div className="col-4">
                <div style={{ textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 8px' }}>
                  <div style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text)' }}>50+</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-2)', marginTop: '2px' }}>Món chay</div>
                </div>
              </div>
              <div className="col-4">
                <div style={{ textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 8px' }}>
                  <div style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text)' }}>100%</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-2)', marginTop: '2px' }}>Organic</div>
                </div>
              </div>
              <div className="col-4">
                <div style={{ textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 8px' }}>
                  <div style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text)' }}>4.9★</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-2)', marginTop: '2px' }}>Đánh giá</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
