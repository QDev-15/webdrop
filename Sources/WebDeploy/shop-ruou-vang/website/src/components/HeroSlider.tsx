import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

// Banner mỏng (Mode A — KHÔNG phải hero fullscreen 100vh), 3 slide — nội dung + 2 nút CTA/slide
// hardcode khớp nguyên văn index.html gốc (vượt quá schema hero_slides 1-nút/1-link, xem Database.php
// seedHeroSlides() comment). Chỉ slide đầu tiên dùng <h1>, các slide sau dùng <h2> (đúng chuẩn SEO).
const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1543418219-44e30b057fea?w=1600&auto=format&fit=crop&q=80',
    label: 'Nhập khẩu chính hãng',
    title: <>Rượu vang tuyển chọn<br />từ <em>7 vùng đất</em> danh tiếng</>,
    sub: 'Hơn 200 nhãn hiệu vang đỏ, trắng, sủi & rosé từ Pháp, Ý, Chile, Tây Ban Nha, Úc, Argentina & Mỹ — bảo quản kho lạnh chuẩn 16°C.',
    primary: { to: '#rv-catalog', label: 'Khám phá bộ sưu tập' },
    secondary: { to: '/khuyen-mai', label: 'Xem khuyến mãi' },
    stamp: true,
  },
  {
    image: 'https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?w=1600&auto=format&fit=crop&q=80',
    label: 'Set quà tặng',
    title: <>Quà tặng đối tác<br /><em>sang trọng &amp; tinh tế</em></>,
    sub: 'Hộp quà vang cao cấp đóng gói thủ công, kèm thiệp chúc mừng — phù hợp tặng đối tác, lễ Tết, khai trương.',
    primary: { to: '/?category=qua-tang-set', label: 'Xem set quà tặng' },
    secondary: { to: '/bo-suu-tap', label: 'Tất cả bộ sưu tập' },
    stamp: false,
  },
  {
    image: 'https://images.unsplash.com/photo-1596142332133-327e2a0ff006?w=1600&auto=format&fit=crop&q=80',
    label: 'Giao hàng 2 giờ',
    title: <>Đặt trước 5 giờ chiều<br /><em>nhận vang ngay hôm nay</em></>,
    sub: 'Áp dụng nội thành Hà Nội & TP.HCM. Đội ngũ sommelier tư vấn miễn phí trước khi giao.',
    primary: { to: '/lien-he', label: 'Liên hệ tư vấn' },
    secondary: { to: '#rv-catalog', label: 'Xem sản phẩm' },
    stamp: false,
  },
]

function CtaLink({ to, label, className }: { to: string; label: string; className: string }) {
  if (to.startsWith('#')) return <a href={to} className={className}>{label}</a>
  return <Link to={to} className={className}>{label}</Link>
}

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 5000)
  }

  useEffect(() => {
    resetTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const goTo = (i: number) => {
    setCurrent((i + SLIDES.length) % SLIDES.length)
    resetTimer()
  }

  return (
    <section className="rv-banner">
      <div className="rv-banner-track">
        {SLIDES.map((s, i) => {
          const Heading = i === 0 ? 'h1' : 'h2'
          return (
            <div key={i} className={'rv-banner-slide' + (i === current ? ' is-active' : '')} style={{ backgroundImage: `url('${s.image}')` }}>
              <div className="rv-banner-overlay"></div>
              <div className="wd-container rv-banner-content">
                <span className="rv-banner-label">{s.label}</span>
                <Heading className="rv-banner-title">{s.title}</Heading>
                <p className="rv-banner-sub">{s.sub}</p>
                <div className="rv-banner-cta">
                  <CtaLink to={s.primary.to} label={s.primary.label} className="rv-btn rv-btn-solid" />
                  <CtaLink to={s.secondary.to} label={s.secondary.label} className="rv-btn rv-btn-ghost" />
                </div>
              </div>
              {s.stamp && <div className="rv-banner-stamp" style={{ display: 'flex' }}>Hàng chính hãng<br />100%</div>}
            </div>
          )
        })}
      </div>
      <button className="rv-banner-nav prev" aria-label="Slide trước" onClick={() => goTo(current - 1)}>‹</button>
      <button className="rv-banner-nav next" aria-label="Slide sau" onClick={() => goTo(current + 1)}>›</button>
      <div className="rv-banner-dots">
        {SLIDES.map((_, i) => (
          <button key={i} className={i === current ? 'active' : ''} onClick={() => goTo(i)} aria-label={`Xem slide ${i + 1}`}></button>
        ))}
      </div>
    </section>
  )
}
