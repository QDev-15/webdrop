import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const FALLBACK_IMAGES = [
  { label: 'Nữ', image: 'https://picsum.photos/seed/novaHeroNu/500/800' },
  { label: 'Nam', image: 'https://picsum.photos/seed/novaHeroNam/500/520' },
  { label: 'Phụ kiện', image: 'https://picsum.photos/seed/novaHeroPk/500/520' },
]

export default function HeroSlider() {
  const { settings, heroSlides } = useSite()

  const gridItems = (heroSlides.length > 0 ? heroSlides.slice(0, 3) : []).map(s => ({ label: s.title, image: s.image }))
  while (gridItems.length < 3) gridItems.push(FALLBACK_IMAGES[gridItems.length])

  return (
    <section className="st-hero" aria-label="Hero">
      <div className="st-container">
        <div className="st-hero-inner">
          <div className="st-hero-text">
            <div className="st-hero-eyebrow" data-reveal>
              {settings.hero_eyebrow || 'Bộ Sưu Tập Mới'}
            </div>
            <h1 className="st-hero-heading" data-reveal data-delay="1">
              {settings.hero_title_1 || 'PHONG'}<br />
              {settings.hero_title_2 || 'CÁCH'}<br />
              <em>{settings.hero_title_3 || 'MỚI'}</em>
            </h1>
            <p className="st-hero-desc" data-reveal data-delay="2">
              {settings.hero_desc}
            </p>
            <div className="st-hero-cta" data-reveal data-delay="3">
              <Link to={settings.hero_cta1_link || '/san-pham'} className="st-btn st-btn-primary st-btn-lg">
                {settings.hero_cta1_text || 'Khám Phá Ngay'} <i className="bi bi-arrow-right" />
              </Link>
              <Link to={settings.hero_cta2_link || '/san-pham'} className="st-btn st-btn-outline-white">
                {settings.hero_cta2_text || 'Xem Lookbook'}
              </Link>
            </div>
            <div className="st-hero-scroll" data-reveal data-delay="4">
              <span className="st-hero-scroll-line" />
              Cuộn để khám phá
            </div>
          </div>

          <div className="st-hero-grid" data-reveal data-delay="2">
            {gridItems.map((item, i) => (
              <div className="st-hero-grid-item" key={i}>
                <img src={item.image} alt={item.label} loading="eager" />
                <div className="st-hero-grid-label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
