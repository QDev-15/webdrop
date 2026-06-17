import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../App'

export default function HeroSlider() {
  const { settings, slides } = useSite()
  const revealRef = useRef(false)

  useEffect(() => {
    if (revealRef.current) return
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('.reveal:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      revealRef.current = true
    }, 0)
    return () => clearTimeout(timer)
  }, [slides])

  const slide = slides[0] || {
    title: 'Nghệ thuật omakase đích thực.',
    subtitle: 'Mỗi bữa ăn là một hành trình — nơi bếp trưởng kinh nghiệm 15 năm tại Tokyo sáng tạo thực đơn theo nguyên liệu tươi nhất trong ngày.',
    button_text: 'Đặt bàn Omakase',
    button_link: '/dat-ban',
    image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=900&q=80&auto=format&fit=crop',
  }

  const siteName = settings.site_name || 'Nhà Hàng Nhật Bản'

  return (
    <section className="hero">
      <div className="hero-jp-deco">お食事寿司</div>
      <div className="wd-container w-100">
        <div className="row align-items-center g-0">
          <div className="col-lg-5 reveal">
            <div className="hero-line" />
            <div className="hero-eyebrow">
              <span style={{ fontSize: '14px' }}>🇯🇵</span> Authentic Japanese Cuisine
            </div>
            <h1 className="hero-title">
              {slide.title.includes('omakase') ? (
                <>Nghệ thuật<br /><em>omakase</em><br />đích thực.</>
              ) : (
                slide.title
              )}
            </h1>
            <p className="hero-sub">{slide.subtitle}</p>
            <div className="hero-ctas">
              <Link to="/dat-ban" className="btn-accent">{slide.button_text || 'Đặt bàn Omakase'}</Link>
              <Link to="/thuc-don" className="btn-ghost">Xem thực đơn</Link>
            </div>
            <div className="hero-stats">
              <div className="hs-item">
                <div className="hs-num">15+</div>
                <div className="hs-label">Năm kinh nghiệm</div>
              </div>
              <div className="hs-item">
                <div className="hs-num">38</div>
                <div className="hs-label">Món đặc sắc</div>
              </div>
              <div className="hs-item">
                <div className="hs-num">4.9★</div>
                <div className="hs-label">Đánh giá</div>
              </div>
            </div>
          </div>
          <div className="col-lg-7 d-none d-lg-block reveal reveal-d1">
            <div className="hero-image-wrap ms-4">
              {slide.image && (
                <img src={slide.image} alt={`${siteName} - Sushi omakase cao cấp`} className="hero-main-img" />
              )}
              <div className="hero-img-tag">
                <div className="hit-label">Omakase hôm nay</div>
                <div className="hit-name">Chef's Special — Liên hệ để biết giá</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
