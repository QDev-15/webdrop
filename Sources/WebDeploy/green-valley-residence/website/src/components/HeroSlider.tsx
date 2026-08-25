import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useUnitTypes } from '../hooks/useUnitTypes'
import { formatVND } from '../utils/format'

// Badge label cố định trên mọi slide — đồng bộ với slide 1 gốc template (mục "DỰ ÁN CĂN HỘ VEN SÔNG SÀI GÒN")
const HERO_LABEL = 'DỰ ÁN CĂN HỘ VEN SÔNG SÀI GÒN'

export default function HeroSlider() {
  const { heroSlides, settings } = useSite()
  const { units } = useUnitTypes()
  const [cur, setCur] = useState(0)

  useEffect(() => {
    if (heroSlides.length <= 1) return
    const t = setInterval(() => setCur(c => (c + 1) % heroSlides.length), 5000)
    return () => clearInterval(t)
  }, [heroSlides.length])

  if (heroSlides.length === 0) return null

  function goTo(i: number) { setCur((i + heroSlides.length) % heroSlides.length) }

  // 3 chỉ số nhanh — dùng chung cho mọi slide (dữ liệu tổng quan dự án, không lưu riêng theo từng slide
  // vì bảng hero_slides core không có cột cho quickfacts — xem báo cáo cuối cùng của web-deploy-builder)
  const minPrice = units.length > 0 ? Math.min(...units.map(u => u.price_from)) : 0
  const quickFacts = [
    { value: settings.total_units || '—', label: 'Căn hộ' },
    { value: minPrice ? formatVND(minPrice) : '—', label: 'Giá từ' },
    { value: settings.handover || '—', label: 'Bàn giao' },
  ]

  return (
    <section className="gvr-hero" id="heroCarousel">
      {heroSlides.map((slide, i) => (
        <div key={slide.id} className={'gvr-hero-slide' + (i === cur ? ' active' : '')}>
          <div className="gvr-hero-left">
            <span className="blob blob-a"></span><span className="blob blob-b"></span>
            <div className="gvr-hero-label"><span className="dot"></span> {HERO_LABEL}</div>
            <h1 className="gvr-hero-heading">{renderHighlightedTitle(slide.title)}</h1>
            <p className="gvr-hero-sub">{slide.subtitle}</p>
            <div className="gvr-hero-actions">
              {slide.button_text && (
                <Link to={slide.button_link || '/'} className="gvr-btn gvr-btn-accent">{slide.button_text} →</Link>
              )}
              <Link to="/lien-he" className="gvr-btn gvr-btn-glass">Đăng ký tư vấn</Link>
            </div>
            <div className="gvr-hero-quickfacts">
              {quickFacts.map(qf => (
                <div className="gvr-hero-qf" key={qf.label}><b>{qf.value}</b><span>{qf.label}</span></div>
              ))}
            </div>
          </div>
          <div className="gvr-hero-right">
            <img src={slide.image} alt={slide.title} />
          </div>
        </div>
      ))}

      <div className="gvr-hero-nav">
        <button className="gvr-hero-arrow" aria-label="Slide trước" onClick={() => goTo(cur - 1)}>‹</button>
        <div className="gvr-hero-dots">
          {heroSlides.map((s, i) => (
            <button key={s.id} className={'gvr-hero-dot' + (i === cur ? ' active' : '')} onClick={() => goTo(i)} aria-label={`Xem slide ${i + 1}`}></button>
          ))}
        </div>
        <button className="gvr-hero-arrow" aria-label="Slide sau" onClick={() => goTo(cur + 1)}>›</button>
      </div>
    </section>
  )
}

// Tô màu accent cho cụm từ cuối tiêu đề (giữ hiệu ứng <em> như template gốc) — dùng React
// elements thuần (KHÔNG dangerouslySetInnerHTML) để tránh mọi rủi ro XSS dù title chỉ do
// admin đã đăng nhập chỉnh sửa (defense in depth).
function renderHighlightedTitle(title: string) {
  const words = title.trim().split(' ')
  if (words.length <= 2) return <em>{title}</em>
  const last = words.slice(-2).join(' ')
  const rest = words.slice(0, -2).join(' ')
  return <>{rest} <em>{last}</em></>
}
