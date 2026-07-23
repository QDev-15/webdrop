import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

// Intro Banner (H5 Bold Typography) — KHÔNG phải slider ảnh (template gốc không có ảnh hero),
// chỉ chữ lớn + ticker marquee chạy liên tục. Toàn bộ nội dung quản lý qua Cài đặt > Trang chủ.
export default function HeroSlider() {
  const { settings } = useSite()

  const tickerItems = [1, 2, 3, 4, 5, 6]
    .map(i => settings[`ticker_${i}`])
    .filter((t): t is string => Boolean(t && t.trim()))

  // Lặp lại danh sách ticker 1 lần để animation cuộn liên tục không bị đứt quãng (khớp template gốc)
  const tickerLoop = tickerItems.length ? [...tickerItems, ...tickerItems] : []

  return (
    <section className="mb-intro">
      <div className="mb-container mb-intro-inner">
        {settings.hero_stamp && <div className="mb-intro-stamp">{settings.hero_stamp}</div>}
        <h1 className="mb-intro-heading">
          {settings.hero_title_line1 || 'ĐIỆN THOẠI'}<br />
          <em>{settings.hero_title_line2 || 'CHẤT.'}</em><br />
          {settings.hero_title_line3 || 'GIÁ THẬT.'}
        </h1>
        {settings.hero_desc && <p className="mb-intro-sub">{settings.hero_desc}</p>}
        <div className="mb-intro-actions">
          <Link to="/san-pham" className="mb-btn mb-btn-mustard">{settings.hero_cta_text || 'Mua ngay'}</Link>
          <Link to="/san-pham?theme=giam-gia" className="mb-btn mb-btn-white">{settings.hero_cta2_text || 'Xem khuyến mãi'}</Link>
        </div>
        {tickerLoop.length > 0 && (
          <div className="mb-intro-ticker">
            <span className="mb-ticker-label">HOT</span>
            <div className="mb-ticker-track" aria-hidden="true">
              {tickerLoop.map((t, i) => (
                <span key={i}>{t} <span className="mb-ticker-dot">✦</span></span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
