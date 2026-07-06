import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import HeroSlider from '../components/HeroSlider'
import Testimonials from '../components/Testimonials'

function ProductCard({ name, slug, category_name, image, price, price_sale, badge, is_new }: {
  name: string; slug: string; category_name: string; image: string
  price: number; price_sale: number; badge: string; is_new: number
}) {
  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'
  return (
    <Link to={`/san-pham/${slug}`} className="sb-prod-card">
      <div className="sb-prod-img">
        {image ? (
          <img src={image} alt={name} loading="lazy" />
        ) : (
          <div style={{ aspectRatio: '1', background: 'var(--cream-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🛍</div>
        )}
        {badge && <div className={`sb-prod-badge ${is_new ? 'new' : ''}`}>{badge}</div>}
        <div className="sb-prod-actions">
          <button className="sb-prod-action-btn" aria-label="Yêu thích" onClick={e => e.preventDefault()}>♡</button>
        </div>
      </div>
      <div className="sb-prod-info">
        <div className="sb-prod-cat">{category_name}</div>
        <div className="sb-prod-name">{name}</div>
        <div className="sb-prod-footer">
          <div className="sb-prod-price">
            <span className="sb-prod-price-new">{fmt(price_sale || price)}</span>
            {price_sale > 0 && price_sale < price && <span className="sb-prod-price-old">{fmt(price)}</span>}
          </div>
          <button className="sb-add-cart" aria-label="Thêm vào giỏ" onClick={e => e.preventDefault()}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  )
}

export default function HomePage() {
  const { settings, products, categories } = useSite()
  const featured = products.filter(p => p.is_featured && p.status === 'published').slice(0, 5)
  const statProducts = settings['stat_products'] || '500+'
  const statCustomers = settings['stat_customers'] || '10.000+'
  const statYears = settings['stat_years'] || '5+'
  const statReviews = settings['stat_reviews'] || '99%'
  const promoTitle = settings['promo_title'] || 'Flash Sale Cuối Tuần'
  const promoSub = settings['promo_subtitle'] || 'Giảm đến 30% toàn bộ sản phẩm hữu cơ'

  return (
    <>
      <HeroSlider />

      {/* Categories */}
      <section className="sb-cat-section sb-sec">
        <div className="sb-container">
          <div style={{ textAlign: 'center', marginBottom: 0 }}>
            <div className="sb-eyebrow">Danh mục</div>
            <h2 className="sb-sec-title">Khám phá <em>bộ sưu tập</em></h2>
          </div>
          <div className="sb-cat-grid">
            {categories.slice(0, 4).map(cat => (
              <Link key={cat.id} to={`/san-pham`} className="sb-cat-card">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} loading="lazy" />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'var(--cream-deep)' }} />
                )}
                <div className="sb-cat-overlay" />
                <div className="sb-cat-info">
                  <h3>{cat.name}</h3>
                  <p>{cat.product_count} sản phẩm</p>
                </div>
                <div className="sb-cat-arrow">→</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="sb-featured-section sb-sec">
          <div className="sb-container">
            <div className="sb-section-header">
              <div>
                <div className="sb-eyebrow">Nổi bật</div>
                <h2 className="sb-sec-title">Sản phẩm <em>yêu thích</em></h2>
                <p className="sb-sec-sub">Được khách hàng chọn mua nhiều nhất tháng này.</p>
              </div>
              <Link to="/san-pham" className="sb-btn sb-btn-outline">Xem tất cả →</Link>
            </div>
            <div className="sb-bento" data-reveal>
              {featured.map(p => <ProductCard key={p.id} {...p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Brand Story */}
      <section className="sb-story-section sb-sec">
        <div className="sb-container">
          <div className="sb-story-row">
            <div className="sb-story-img">
              <div style={{ width: '100%', height: '100%', background: '#e8dfd4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>🌿</div>
            </div>
            <div className="sb-story-text-col">
              <span className="sb-story-badge">Câu chuyện của chúng tôi</span>
              <h2 className="sb-story-title">Từ thiên nhiên, <em>đến tay bạn</em></h2>
              <p className="sb-story-text">
                Chúng tôi tin rằng mỗi sản phẩm đều mang theo một câu chuyện — câu chuyện về người thợ thủ công tài hoa, về nguyên liệu hữu cơ được chăm chút từ đất đến bàn tay, về tình yêu thiên nhiên và sự bền vững.
              </p>
              <div className="sb-story-features">
                {['100% Nguyên liệu tự nhiên', 'Thủ công truyền thống', 'Thân thiện môi trường'].map(f => (
                  <div key={f} className="sb-story-feat">
                    <div className="sb-story-feat-icon">✓</div>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <Link to="/lien-he" className="sb-btn sb-btn-sage">Tìm hiểu thêm</Link>
            </div>
          </div>

          <div className="sb-story-row reverse">
            <div className="sb-story-text-col">
              <span className="sb-story-badge">Cam kết chất lượng</span>
              <h2 className="sb-story-title"><em>Chất lượng</em> là ưu tiên hàng đầu</h2>
              <p className="sb-story-text">
                Mỗi sản phẩm đều trải qua quy trình kiểm định nghiêm ngặt trước khi đến tay khách hàng. Chúng tôi cam kết hoàn tiền 100% nếu bạn không hài lòng.
              </p>
              <div className="sb-story-features">
                {['Kiểm định chất lượng 3 bước', 'Đóng gói tái chế 100%', 'Đổi trả trong 30 ngày'].map(f => (
                  <div key={f} className="sb-story-feat">
                    <div className="sb-story-feat-icon">✓</div>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <Link to="/san-pham" className="sb-btn sb-btn-primary">Mua ngay</Link>
            </div>
            <div className="sb-story-img">
              <div style={{ width: '100%', height: '100%', background: '#f0e8df', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>🍃</div>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="sb-promo">
        <div className="sb-container">
          <div className="sb-promo-inner">
            <div>
              <div className="sb-promo-label">Flash Sale</div>
              <h2 className="sb-promo-title">{promoTitle}</h2>
              <p className="sb-promo-sub">{promoSub}</p>
              <Link to="/san-pham" className="sb-btn sb-btn-primary">Mua ngay với giá ưu đãi</Link>
            </div>
            <div className="sb-promo-products">
              {products.filter(p => p.price_sale > 0 && p.status === 'published').slice(0, 4).map(p => (
                <Link key={p.id} to={`/san-pham/${p.slug}`} className="sb-promo-prod">
                  {p.image ? (
                    <img src={p.image} alt={p.name} loading="lazy" />
                  ) : (
                    <div style={{ width: '100%', aspectRatio: '1', background: 'rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, opacity: .5 }}>🛍</div>
                  )}
                  <div className="sb-promo-prod-info">
                    <strong>{p.name}</strong>
                    <span style={{ color: 'var(--accent-mid)' }}>{p.price_sale.toLocaleString('vi-VN')}đ</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* Stats */}
      <section className="sb-stats">
        <div className="sb-container">
          <div className="sb-stats-grid">
            <div className="sb-stat"><div className="sb-stat-num"><span>{statProducts}</span></div><div className="sb-stat-label">Sản phẩm</div></div>
            <div className="sb-stat"><div className="sb-stat-num"><span>{statCustomers}</span></div><div className="sb-stat-label">Khách hàng</div></div>
            <div className="sb-stat"><div className="sb-stat-num"><span>{statYears}</span></div><div className="sb-stat-label">Năm kinh nghiệm</div></div>
            <div className="sb-stat"><div className="sb-stat-num"><span>{statReviews}</span></div><div className="sb-stat-label">Đánh giá 5 sao</div></div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="sb-newsletter">
        <div className="sb-container">
          <div className="sb-newsletter-inner">
            <div className="sb-eyebrow">Đăng ký</div>
            <h2 className="sb-sec-title" style={{ fontSize: 'clamp(24px,3vw,36px)' }}>Nhận ưu đãi <em>độc quyền</em></h2>
            <p style={{ color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.7 }}>Đăng ký nhận bản tin để không bỏ lỡ sản phẩm mới và khuyến mãi hấp dẫn.</p>
            <form className="sb-newsletter-form" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Email của bạn..." required />
              <button type="submit">Đăng ký</button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
