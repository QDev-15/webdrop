import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Settings {
  site_name?: string
  site_tagline?: string
  site_phone?: string
}

const MARQUEE_ITEMS = [
  'Nha khoa tổng quát',
  'Không gian yên tĩnh',
  'Bác sĩ tận tâm',
  'Giá cả minh bạch',
  'Công nghệ hiện đại',
  'An toàn & nhẹ nhàng',
]

export default function HeroSlider() {
  const [settings, setSettings] = useState<Settings>({})

  useEffect(() => {
    api.get<Settings>('/public/settings').then(setSettings).catch(() => {})
  }, [])

  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]

  return (
    <section className="at-hero" aria-label="Trang chủ">
      <div className="wd-container">
        <div className="at-hero-inner">
          {/* Eyebrow */}
          <div className="at-hero-eyebrow">
            <span className="at-eyebrow-line" aria-hidden="true" />
            {settings.site_tagline || 'Nha khoa tổng quát — Không gian yên tĩnh'}
          </div>

          {/* Main title */}
          <h1 className="at-hero-title">
            Nơi mọi
            <em>lo âu</em>
            được lắng nghe
          </h1>

          {/* Subtitle */}
          <p className="at-hero-sub">
            Phòng khám nha khoa với không gian tối giản, yên tĩnh — chúng tôi dành thời gian lắng nghe và giải thích kỹ lưỡng trước khi bắt đầu bất kỳ điều trị nào.
          </p>

          {/* Actions */}
          <div className="at-hero-actions">
            <Link to="/dat-lich" className="at-btn at-btn-accent at-btn-lg">
              Đặt lịch khám
              <span aria-hidden="true">→</span>
            </Link>
            <Link to="/dich-vu" className="at-btn at-btn-lg">
              Xem dịch vụ
            </Link>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="at-marquee" aria-hidden="true">
        <div className="at-marquee-track">
          {doubled.map((item, i) => (
            <span key={i} className="at-marquee-item">
              {item}
              {i < doubled.length - 1 && <span className="at-mq-dot" />}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="at-scroll-hint" aria-hidden="true">
        <div className="at-scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  )
}
