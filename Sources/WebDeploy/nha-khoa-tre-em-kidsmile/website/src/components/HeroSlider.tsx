import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Settings {
  site_name?: string
  hero_eyebrow?: string
  hero_title?: string
  hero_subtitle?: string
}

export default function HeroSlider() {
  const [s, setS] = useState<Settings>({})

  useEffect(() => {
    api.get<Settings>('/public/settings').then(setS).catch(() => {})
  }, [])

  return (
    <section className="ks-hero" aria-label="Hero section">
      {/* Decorative blobs */}
      <div className="ks-hero-blob ks-hero-blob-1" aria-hidden="true" />
      <div className="ks-hero-blob ks-hero-blob-2" aria-hidden="true" />
      <div className="ks-hero-blob ks-hero-blob-3" aria-hidden="true" />

      <div className="wd-container ks-hero-inner">
        <div className="ks-hero-text" data-reveal>
          <span className="ks-hero-eyebrow">{s.hero_eyebrow || '😊 Phòng khám chuyên Nhi #1 khu vực'}</span>
          <h1 className="ks-hero-title">
            {s.hero_title
              ? s.hero_title
              : <>Khám răng cho bé <strong>không còn đáng sợ</strong>, chỉ có <em>niềm vui</em></>
            }
          </h1>
          <p className="ks-hero-sub">
            {s.hero_subtitle || 'KidSmile là nha khoa chuyên biệt cho trẻ em — không gian như công viên, bác sĩ nhẹ nhàng, kỹ thuật không đau. Bé sẽ mong chờ được đến khám lần sau!'}
          </p>
          <div className="ks-hero-actions">
            <Link to="/dat-lich" className="ks-btn ks-btn-primary ks-btn-lg">
              Đặt lịch khám ngay →
            </Link>
            <Link to="/dich-vu" className="ks-btn ks-btn-ghost ks-btn-lg">
              Xem dịch vụ
            </Link>
          </div>
          <div className="ks-hero-badges">
            <div className="ks-hero-badge">
              <span className="ks-hero-badge-dot" aria-hidden="true">🩺</span>
              Bác sĩ chuyên khoa Nhi
            </div>
            <div className="ks-hero-badge">
              <span className="ks-hero-badge-dot" aria-hidden="true">🎈</span>
              Phòng khám thân thiện
            </div>
            <div className="ks-hero-badge">
              <span className="ks-hero-badge-dot" aria-hidden="true">✨</span>
              Vô trùng an toàn
            </div>
          </div>
        </div>

        {/* Hero image — absolute offset right */}
        <div className="ks-hero-media" data-reveal data-delay="2" aria-hidden="true">
          <div className="ks-hero-media-shape">
            <img
              src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=700&q=75&auto=format&fit=crop"
              alt="Bé gái cười tươi tại phòng khám nha khoa trẻ em KidSmile"
              loading="eager"
            />
          </div>
          <div className="ks-hero-float-card ks-hero-float-card-1">
            <span className="ks-hero-float-emoji">⭐</span>
            4.9/5 từ 800+ phụ huynh
          </div>
          <div className="ks-hero-float-card ks-hero-float-card-2">
            <span className="ks-hero-float-emoji">🦷</span>
            0 đau — 100% nhẹ nhàng
          </div>
        </div>
      </div>
    </section>
  )
}
