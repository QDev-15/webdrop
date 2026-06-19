import { useNavigate } from 'react-router-dom'
import { useSite } from '../App'

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
  'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800&q=80',
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
]

export default function HeroSlider() {
  const { settings, slides } = useSite()
  const navigate = useNavigate()

  const imgs = slides.length > 0
    ? slides.slice(0, 5).map(s => s.image || FALLBACK_IMAGES[0])
    : FALLBACK_IMAGES

  const title = slides.length > 0
    ? slides[0].title
    : (settings.site_name ?? 'La Douceur')

  const subtitle = slides.length > 0
    ? slides[0].subtitle
    : 'Tiệm bánh thủ công cao cấp — Mỗi chiếc bánh là một tác phẩm'

  return (
    <section className="hero">
      <div className="wd-container">
        <div className="row align-items-center g-5">
          <div className="col-lg-5">
            <div className="hero-eyebrow">🍰 Patisserie Artisanale</div>
            <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: title }} />
            <p className="hero-sub">{subtitle}</p>
            <div className="d-flex gap-3 flex-wrap mb-4">
              <button className="btn-accent" onClick={() => navigate('/san-pham')}>
                Khám phá sản phẩm
              </button>
              <button className="btn-ghost" onClick={() => navigate('/dat-hang')}>
                Đặt bánh theo yêu cầu
              </button>
            </div>
            <div className="hero-stats">
              <div className="hs-item">
                <div className="hs-num">{settings.about_stat_products ?? '200+'}</div>
                <div className="hs-label">Loại bánh</div>
              </div>
              <div className="hs-item">
                <div className="hs-num">5★</div>
                <div className="hs-label">Đánh giá</div>
              </div>
              <div className="hs-item">
                <div className="hs-num">{settings.about_stat_orders ?? '3K+'}</div>
                <div className="hs-label">Đơn/tháng</div>
              </div>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="hero-grid">
              {imgs.slice(0, 5).map((src, i) => (
                <div key={i} className={`hg-item${i === 0 ? ' hg-main' : ''}`}>
                  <img
                    src={src}
                    alt={`Bánh ${i + 1}`}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMAGES[i % FALLBACK_IMAGES.length] }}
                  />
                  {i === 0 && <div className="hg-badge">✦ Bestseller</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
