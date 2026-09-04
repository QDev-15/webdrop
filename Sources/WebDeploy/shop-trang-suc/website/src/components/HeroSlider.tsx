import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

// Hero carousel 4 slide (H5 Bold Typography Only) — mỗi slide có 2 nút CTA khác nhau, vượt quá
// schema hero_slides đơn giản (title/subtitle/image/1 button) nên hardcode trực tiếp giống nguyên
// văn index.html gốc (theo đúng precedent shop-ruou-vang/shop-dong-ho — hero_slides table vẫn giữ
// để trang quản trị "Hero Slides" có dữ liệu mẫu, không đọc từ đây).
// Chỉ slide đầu tiên dùng <h1> (đúng chuẩn SEO 1-h1/trang), slide 2-4 dùng <h2>.
interface Slide {
  label: string
  titleLine1: string
  titleEm: string
  sub: string
  primaryText: string
  primaryLink: string
  secondaryText: string
  secondaryLink: string
}

const SLIDES: Slide[] = [
  {
    label: 'Bộ sưu tập Thu Đông 2026',
    titleLine1: 'Ánh Sáng Của Sự', titleEm: 'Tinh Tế',
    sub: 'Trang sức bạc 925, vàng 18K/24K và đá quý tự nhiên — chế tác tỉ mỉ cho những khoảnh khắc đáng nhớ nhất của bạn.',
    primaryText: 'Khám phá bộ sưu tập', primaryLink: '/san-pham',
    secondaryText: 'Về VIOLETTE', secondaryLink: '/ve-chung-toi',
  },
  {
    label: 'Thủ công tỉ mỉ',
    titleLine1: 'Chế Tác Từ Trái Tim', titleEm: 'Người Thợ',
    sub: 'Mỗi sản phẩm đều trải qua hơn 12 công đoạn thủ công, được kiểm tra kỹ lưỡng trước khi đến tay khách hàng.',
    primaryText: 'Xem bộ sưu tập', primaryLink: '/bo-suu-tap',
    secondaryText: 'Nhẫn mới về', secondaryLink: '/san-pham?category=nhan',
  },
  {
    label: 'Quà tặng ý nghĩa',
    titleLine1: 'Món Quà Cho', titleEm: 'Khoảnh Khắc Đặc Biệt',
    sub: 'Từ sinh nhật, kỷ niệm đến lễ cưới — VIOLETTE giúp bạn chọn món trang sức phù hợp nhất để trao gửi yêu thương.',
    primaryText: 'Gợi ý quà tặng', primaryLink: '/san-pham?theme=qua-tang',
    secondaryText: 'Tư vấn miễn phí', secondaryLink: '/lien-he',
  },
  {
    label: 'Cam kết chất lượng',
    titleLine1: 'Đá Quý Tự Nhiên', titleEm: 'Kiểm Định Rõ Ràng',
    sub: '100% sản phẩm đi kèm giấy kiểm định, hóa đơn VAT và chính sách bảo hành trọn đời cho khung trang sức.',
    primaryText: 'Xem đá quý tự nhiên', primaryLink: '/san-pham?material=da-quy',
    secondaryText: 'Cam kết của chúng tôi', secondaryLink: '/ve-chung-toi',
  },
]

export default function HeroSlider() {
  const [idx, setIdx] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setIdx(i => (i + 1) % SLIDES.length), 5000)
  }

  useEffect(() => {
    resetTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const goTo = (i: number) => {
    setIdx((i + SLIDES.length) % SLIDES.length)
    resetTimer()
  }

  return (
    <header className="tr-hero" id="heroCarousel">
      <div className="tr-hero-noise"></div>
      <span className="tr-hero-ring r1"></span>
      <span className="tr-hero-ring r2"></span>
      <div className="tr-container">
        <div className="tr-hero-slides">
          {SLIDES.map((s, i) => {
            const TitleTag = i === 0 ? 'h1' : 'h2'
            return (
              <div key={i} className={'tr-hero-slide' + (i === idx ? ' active' : '')}>
                <div className="tr-hero-inner">
                  <div className="tr-hero-label">{s.label}</div>
                  <TitleTag className="tr-hero-title">{s.titleLine1}<br /><em>{s.titleEm}</em></TitleTag>
                  <p className="tr-hero-sub">{s.sub}</p>
                  <div className="tr-hero-cta">
                    <Link to={s.primaryLink} className="tr-btn tr-btn-fill">{s.primaryText}</Link>
                    <Link to={s.secondaryLink} className="tr-btn">{s.secondaryText}</Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="tr-hero-nav">
        <div className="tr-container tr-hero-nav-inner">
          <div className="tr-hero-dots" role="tablist" aria-label="Chọn slide">
            {SLIDES.map((_, i) => (
              <button key={i} className={'tr-hero-dot' + (i === idx ? ' active' : '')} aria-label={`Slide ${i + 1}`} onClick={() => goTo(i)}></button>
            ))}
          </div>
          <div className="tr-hero-arrows">
            <button className="tr-hero-arrow" aria-label="Slide trước" onClick={() => goTo(idx - 1)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button className="tr-hero-arrow" aria-label="Slide sau" onClick={() => goTo(idx + 1)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
