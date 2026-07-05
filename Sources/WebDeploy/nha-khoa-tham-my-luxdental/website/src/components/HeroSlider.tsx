import { NavLink } from 'react-router-dom'
import { useSite } from '../App'

// H5 — Bold Typography Only (no hero image)
// Diagonal pattern bg + "Smile" watermark
export default function HeroSlider() {
  const { settings } = useSite()

  const line1 = settings.hero_title_line1 || 'Nụ cười'
  const line2 = settings.hero_title_line2 || 'Đẳng cấp'
  const subtitle = settings.hero_subtitle || 'Chuyên gia thẩm mỹ nha khoa — Veneer sứ · Bọc răng sứ · Tẩy trắng · Niềng răng.'

  return (
    <section className="lx-hero">
      <div className="lx-hero-pattern" />
      <div className="lx-hero-watermark" aria-hidden="true">Smile</div>

      <div className="wd-container lx-hero-inner">
        <div data-reveal>
          <div className="lx-hero-badge">
            <span className="lx-hero-badge-dot" />
            Nha khoa thẩm mỹ cao cấp
          </div>
        </div>

        <h1 className="lx-hero-title" data-reveal data-delay="1">
          {line1}<br />
          <em>{line2}</em>
        </h1>

        <p className="lx-hero-sub" data-reveal data-delay="2">{subtitle}</p>

        <div className="lx-hero-ctas" data-reveal data-delay="3">
          <NavLink to="/dat-lich" className="lx-btn lx-btn-accent">
            Đặt lịch tư vấn
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </NavLink>
          <NavLink to="/dich-vu" className="lx-btn lx-btn-outline">
            Xem dịch vụ
          </NavLink>
        </div>

        <div className="lx-hero-trust" data-reveal data-delay="4">
          <div className="lx-ht">
            <span className="lx-ht-num">{settings.stat_cases || '8.500+'}</span>
            <span className="lx-ht-label">Ca thực hiện</span>
          </div>
          <div className="lx-ht">
            <span className="lx-ht-num">{settings.stat_doctors || '12'}</span>
            <span className="lx-ht-label">Bác sĩ chuyên khoa</span>
          </div>
          <div className="lx-ht">
            <span className="lx-ht-num">{settings.stat_years || '10'}</span>
            <span className="lx-ht-label">Năm kinh nghiệm</span>
          </div>
          <div className="lx-ht">
            <span className="lx-ht-num">{settings.stat_satisfaction || '99%'}</span>
            <span className="lx-ht-label">Hài lòng</span>
          </div>
        </div>
      </div>

      {/* Marquee strip */}
      <div className="lx-marquee">
        <div className="lx-marquee-track" aria-hidden="true">
          {[1, 2].map(i => (
            <div key={i} style={{ display: 'flex' }}>
              {[
                'Veneer Sứ Cao Cấp',
                'Bọc Răng Sứ',
                'Tẩy Trắng Răng',
                'Thiết Kế Nụ Cười',
                'Niềng Răng Thẩm Mỹ',
                'Cấy Ghép Implant',
                'Tổng Hợp Nha Khoa',
                'Chỉnh Nha Trong Suốt',
              ].map(item => (
                <div key={item} className="lx-marquee-item">
                  {item}
                  <span>✦</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
