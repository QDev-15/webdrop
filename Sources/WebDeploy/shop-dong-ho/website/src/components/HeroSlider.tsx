import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

// Hero carousel 4 slide (H2 Split 45/55) — nội dung mỗi slide (tag/tiêu đề/mô tả/2 CTA/price-card)
// khác nhau hoàn toàn, không khớp schema hero_slides đơn giản (title/subtitle/image/1 button) nên
// hardcode trực tiếp giống nguyên văn index.html gốc (theo đúng precedent portfolio-ux-designer/
// green-valley-residence — hero_slides table vẫn giữ để trang quản trị "Hero Slides" có dữ liệu mẫu).
// Chỉ slide đầu tiên dùng <h1> (đúng chuẩn SEO 1-h1/trang), slide 2-4 dùng <h2>.
interface Slide {
  tag: string
  titleLine1: string
  titleLine2: string
  sub: string
  primaryText: string
  primaryLink: string
  secondaryText: string
  secondaryLink: string
  image: string
  cardLabel: string
  cardValue: string
}

const SLIDES: Slide[] = [
  {
    tag: 'MERIDIAN — TRUSTED TIMEPIECES',
    titleLine1: 'Đồng hồ chính hãng', titleLine2: 'đa thương hiệu',
    sub: 'Hơn 40 mẫu đồng hồ nam nữ từ CASIO, SEIKO, CITIZEN, TISSOT, LONGINES... nguồn gốc rõ ràng, bảo hành đầy đủ toàn quốc.',
    primaryText: 'Khám phá ngay', primaryLink: '/san-pham',
    secondaryText: 'Xem bộ sưu tập', secondaryLink: '/bo-suu-tap',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1200&auto=format&fit=crop&q=80',
    cardLabel: 'Cam kết', cardValue: '100% chính hãng',
  },
  {
    tag: 'BST NAM 2026',
    titleLine1: 'Bộ sưu tập Nam', titleLine2: 'Bản lĩnh & Đẳng cấp',
    sub: 'Từ thể thao năng động đến sang trọng cổ điển — 24 mẫu đồng hồ nam đa phong cách, đa mức giá.',
    primaryText: 'Xem BST Nam', primaryLink: '/san-pham?category=nam',
    secondaryText: 'Tất cả sản phẩm', secondaryLink: '/san-pham',
    image: 'https://images.unsplash.com/photo-1590995505834-e5380bba1865?w=1200&auto=format&fit=crop&q=80',
    cardLabel: 'Giá chỉ từ', cardValue: '2.200.000₫',
  },
  {
    tag: 'BST NỮ 2026',
    titleLine1: 'Bộ sưu tập Nữ', titleLine2: 'Tinh tế mọi khoảnh khắc',
    sub: 'Thiết kế thanh lịch, dây da & kim loại mảnh, phù hợp mọi phong cách công sở lẫn dạo phố.',
    primaryText: 'Xem BST Nữ', primaryLink: '/san-pham?category=nu',
    secondaryText: 'Tất cả sản phẩm', secondaryLink: '/san-pham',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1200&auto=format&fit=crop&q=80',
    cardLabel: 'Giá chỉ từ', cardValue: '2.100.000₫',
  },
  {
    tag: 'LIMITED EDITION',
    titleLine1: 'Phiên bản giới hạn', titleLine2: 'Đẳng cấp hiếm có',
    sub: 'Số lượng có hạn từ LONGINES, SEIKO, TISSOT, ORIENT — bảo hành mở rộng 5 năm, kèm giấy chứng nhận riêng.',
    primaryText: 'Khám phá Limited', primaryLink: '/san-pham?limited=1',
    secondaryText: 'Cam kết chính hãng', secondaryLink: '/ve-chung-toi',
    image: 'https://images.unsplash.com/photo-1637160151663-a410315e4e75?w=1200&auto=format&fit=crop&q=80',
    cardLabel: 'Chỉ còn', cardValue: '6 sản phẩm',
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

  const go = (n: number) => {
    setIdx((n + SLIDES.length) % SLIDES.length)
    resetTimer()
  }

  return (
    <section className="dh-hero" id="dhHero">
      {SLIDES.map((s, i) => {
        const TitleTag = i === 0 ? 'h1' : 'h2'
        return (
          <div className={'dh-hero-slide' + (i === idx ? ' active' : '')} key={i}>
            <div className="dh-hero-text">
              <div className="dh-hero-tag"><span className="dot"></span>{s.tag}</div>
              <TitleTag className="dh-hero-title">{s.titleLine1}<br /><span>{s.titleLine2}</span></TitleTag>
              <p className="dh-hero-sub">{s.sub}</p>
              <div className="dh-hero-ctas">
                <Link to={s.primaryLink} className="dh-btn dh-btn-primary">{s.primaryText}</Link>
                <Link to={s.secondaryLink} className="dh-btn dh-btn-glass">{s.secondaryText}</Link>
              </div>
            </div>
            <div className="dh-hero-visual">
              <img src={s.image} alt={s.titleLine1 + ' ' + s.titleLine2} />
              <div className="dh-hero-price-card"><div className="lbl">{s.cardLabel}</div><div className="val">{s.cardValue}</div></div>
            </div>
          </div>
        )
      })}

      <button className="dh-hero-nav-btn dh-hero-prev" aria-label="Slide trước" onClick={() => go(idx - 1)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      <button className="dh-hero-nav-btn dh-hero-next" aria-label="Slide tiếp theo" onClick={() => go(idx + 1)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}><path d="M9 18l6-6-6-6" /></svg>
      </button>
      <div className="dh-hero-dots">
        {SLIDES.map((_, i) => (
          <button key={i} className={i === idx ? 'active' : ''} aria-label={`Slide ${i + 1}`} onClick={() => go(i)}></button>
        ))}
      </div>
    </section>
  )
}
