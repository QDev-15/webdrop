import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

interface HeroSlide {
  id: number
  title: string
  subtitle: string
  image: string
  button_text: string
  button_link: string
}

export default function HeroSlider() {
  const { settings } = useSite()
  const [slide, setSlide] = useState<HeroSlide | null>(null)

  useEffect(() => {
    api.get<HeroSlide[]>('/public/hero-slides')
      .then(slides => { if (slides.length > 0) setSlide(slides[0]) })
      .catch(() => {})
  }, [])

  const badge    = settings.hero_badge        || 'Nha khoa gia đình thân thiện'
  const title    = settings.hero_title        || slide?.title || 'Nụ cười khỏe mạnh cho cả gia đình bạn'
  const subtitle = settings.hero_subtitle     || slide?.subtitle || ''
  const image    = settings.hero_image        || slide?.image || ''
  const floatYears = settings.hero_float_years || '10 năm'
  const floatLabel = settings.hero_float_label || 'Đồng hành cùng gia đình'
  const metaFamilies = settings.hero_meta_families || '1.200+ gia đình tin tưởng'
  const metaRating   = settings.hero_meta_rating   || '4.9/5 từ khách hàng'

  return (
    <section className="sr-hero">
      <div className="sr-hero-blob" aria-hidden="true" />
      <div className="wd-container">
        <div className="sr-hero-inner">
          <div className="sr-hero-badge" data-reveal>
            <span className="sr-hero-badge-dot" aria-hidden="true" />
            {badge}
          </div>

          <h1
            className="sr-hero-title"
            data-reveal
            data-delay="1"
            dangerouslySetInnerHTML={{ __html: title }}
          />

          {subtitle && (
            <p className="sr-hero-sub" data-reveal data-delay="2">{subtitle}</p>
          )}

          <div className="sr-hero-actions" data-reveal data-delay="3">
            <Link to="/dat-lich" className="sr-btn sr-btn-primary">
              Đặt lịch khám ngay
            </Link>
            <Link to="/dich-vu" className="sr-btn sr-btn-ghost">
              Khám phá dịch vụ
            </Link>
          </div>

          <div className="sr-hero-meta" data-reveal data-delay="4">
            <div className="sr-hero-meta-item">
              <span className="sr-hero-meta-stars">★★★★★</span>
              <span>{metaRating}</span>
            </div>
            <div className="sr-hero-meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span>{metaFamilies}</span>
            </div>
          </div>

          {image && (
            <div className="sr-hero-image-wrap" data-reveal data-delay="2">
              <div className="sr-hero-image">
                <img src={image} alt="Sunrise Nha Khoa Gia Đình" loading="eager" />
              </div>
              <div className="sr-hero-float-card">
                <div className="sr-hero-float-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div>
                  <div className="sr-hero-float-num">{floatYears}</div>
                  <div className="sr-hero-float-label">{floatLabel}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
