import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

interface Slide {
  id: number
  title: string
  subtitle: string
  button_text: string
  button_link: string
  image: string
  sort_order: number
}

export default function HeroSlider() {
  const { settings } = useSite()
  const [slides, setSlides] = useState<Slide[]>([])

  useEffect(() => {
    api.get<Slide[]>('/public/hero-slides').then(setSlides).catch(() => {})
  }, [])

  const slide = slides[0]
  const title = slide?.title || settings.hero_title_1 || 'PHONG CÁCH'
  const em = settings.hero_title_em || '& Đẳng cấp'
  const subtitle = slide?.subtitle || settings.hero_subtitle ||
    'Nơi mỗi nhát kéo là một nghệ thuật. Chúng tôi mang đến trải nghiệm cắt tóc cao cấp theo phong cách barber Mỹ — chỉnh chu từng chi tiết, tôn vinh cá tính của bạn.'
  const image = slide?.image || settings.hero_image ||
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=900&q=80&auto=format&fit=crop'
  const badge = settings.hero_badge || 'Premium Barber Shop'

  return (
    <section className="tb-hero">
      <div className="tb-hero-img">
        <img src={image} alt="Barber đang cắt tóc chuyên nghiệp" />
      </div>
      <div className="tb-hero-noise"></div>
      <div className="wd-container w-100">
        <div className="tb-hero-content" data-reveal>
          <div className="tb-hero-pre">
            <span className="tb-hero-pulse"></span>
            {badge}
          </div>
          <h1 className="tb-hero-h1">
            {title.split(' ').length > 0 ? title : 'PHONG CÁCH'}
            <em>{em}</em>
          </h1>
          <div className="tb-hero-rule"></div>
          <p className="tb-hero-p">{subtitle}</p>
          <div className="d-flex gap-3 flex-wrap">
            <Link to={slide?.button_link || '/dat-lich'} className="tb-btn-gold">{slide?.button_text || 'Đặt lịch ngay'}</Link>
            <Link to="/dich-vu" className="tb-btn-outline">Xem dịch vụ</Link>
          </div>
          <div className="tb-hero-trust">
            <div className="tb-ht-item"><span className="tb-ht-dot"></span>{settings.stat_customers || '3000'}+ khách hàng</div>
            <div className="tb-ht-item"><span className="tb-ht-dot"></span>{settings.stat_years || '8'} năm kinh nghiệm</div>
            <div className="tb-ht-item"><span className="tb-ht-dot"></span>{settings.stat_stylists || '5'} stylist chuyên nghiệp</div>
          </div>
        </div>
      </div>
    </section>
  )
}
