import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import HeroSlider from '../components/HeroSlider'
import StatCounter from '../components/StatCounter'
import { useCart } from '../contexts/CartContext'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

function fmt(n: number) {
  return n.toLocaleString('vi-VN') + 'đ'
}

function PromoTimer() {
  const [left, setLeft] = useState({ d: 2, h: 14, m: 37, s: 44 })
  useEffect(() => {
    const end = new Date()
    end.setDate(end.getDate() + 2)
    end.setHours(end.getHours() + 14)
    const t = setInterval(() => {
      const diff = end.getTime() - Date.now()
      if (diff <= 0) { clearInterval(t); return }
      setLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    <div className="mt-promo-timer" aria-label="Đếm ngược thời gian">
      <div className="mt-timer-unit"><div className="mt-timer-num">{pad(left.d)}</div><div className="mt-timer-label">Ngày</div></div>
      <div className="mt-timer-unit"><div className="mt-timer-num">{pad(left.h)}</div><div className="mt-timer-label">Giờ</div></div>
      <div className="mt-timer-unit"><div className="mt-timer-num">{pad(left.m)}</div><div className="mt-timer-label">Phút</div></div>
      <div className="mt-timer-unit"><div className="mt-timer-num">{pad(left.s)}</div><div className="mt-timer-label">Giây</div></div>
    </div>
  )
}

export default function HomePage() {
  useDocumentMeta({
    title: 'NovaTech — Laptop, PC Gaming & Linh Kiện Máy Tính Chính Hãng',
    description: 'Cửa hàng máy tính uy tín — laptop, PC gaming, linh kiện chính hãng, bảo hành tận tâm, trả góp 0% lãi suất.',
  })

  const { settings, products, categories } = useSite()
  const { addItem } = useCart()
  const val = (k: string, fallback = '') => settings[k] || fallback

  const featured = products.filter(p => p.is_featured).slice(0, 6)

  const values = [1, 2, 3, 4].map(i => ({
    icon: val(`value${i}_icon`, 'star-fill'),
    title: val(`value${i}_title`),
    desc: val(`value${i}_desc`),
  })).filter(v => v.title)

  const stats = [1, 2, 3, 4].map(i => ({
    num: Number(val(`stat${i}_num`)) || 0,
    suffix: val(`stat${i}_suffix`),
    label: val(`stat${i}_label`),
  })).filter(s => s.label)

  const reviews = [1, 2, 3, 4].map(i => ({
    name: val(`review${i}_name`),
    location: val(`review${i}_location`),
    content: val(`review${i}_content`),
    rating: Number(val(`review${i}_rating`)) || 5,
  })).filter(r => r.name)

  return (
    <>
      <HeroSlider />

      {/* CATEGORIES — BENTO-GRID */}
      <section className="mt-sec" aria-labelledby="cat-heading">
        <div className="mt-container">
          <div className="mt-section-header">
            <div>
              <div className="mt-eyebrow" data-reveal>Danh mục</div>
              <h2 className="mt-sec-title" id="cat-heading" data-reveal data-delay="1">
                Mua sắm theo <strong>nhu cầu</strong>
              </h2>
            </div>
            <Link to="/san-pham" className="mt-btn mt-btn-outline" data-reveal data-delay="2">
              Xem tất cả <i className="bi bi-arrow-right ms-1" />
            </Link>
          </div>
          <div className="mt-bento">
            {categories.slice(0, 5).map((c, i) => (
              <div key={c.id} className={`mt-bento-card mt-bento-${i + 1}`} data-reveal data-delay={String(i + 1)}>
                <img src={c.image} alt={c.name} loading="lazy" />
                {i === 0 && <div className="mt-bento-tag">Bán chạy</div>}
                <div className="mt-bento-info"><h3>{c.name}</h3><p>{c.product_count} sản phẩm</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS — GRID-CARDS */}
      <section className="mt-sec" style={{ paddingTop: 0 }} aria-labelledby="feat-heading">
        <div className="mt-container">
          <div className="mt-section-header">
            <div>
              <div className="mt-eyebrow" data-reveal>Nổi bật</div>
              <h2 className="mt-sec-title" id="feat-heading" data-reveal data-delay="1">Đang <strong>được săn đón</strong></h2>
              <p className="mt-sec-sub" data-reveal data-delay="2">Những sản phẩm được khách hàng lựa chọn nhiều nhất trong tháng</p>
            </div>
            <Link to="/san-pham" className="mt-btn mt-btn-outline" data-reveal data-delay="2">Xem thêm <i className="bi bi-arrow-right ms-1" /></Link>
          </div>

          <div className="mt-prod-grid" style={{ marginTop: 36 }}>
            {featured.map((p, i) => (
              <div className="mt-prod-card" data-reveal data-delay={String((i % 3) + 1)} key={p.id}>
                <div className="mt-prod-thumb">
                  <Link to={`/san-pham/${p.slug}`}><img src={p.image} alt={p.name} loading="lazy" /></Link>
                  {p.badge && <div className={'mt-prod-badge' + (p.price_sale ? ' sale' : p.is_new ? ' new' : '')}>{p.badge}</div>}
                  <div className="mt-prod-actions"><button className="mt-prod-action-btn" aria-label="Yêu thích"><i className="bi bi-heart" /></button></div>
                </div>
                <div className="mt-prod-info">
                  <div className="mt-prod-cat">{p.category_name}</div>
                  <h3 className="mt-prod-name"><Link to={`/san-pham/${p.slug}`}>{p.name}</Link></h3>
                  <div className="mt-prod-footer">
                    <div>
                      <span className="mt-prod-price-new">{fmt(p.price_sale || p.price)}</span>
                      {!!p.price_sale && <span className="mt-prod-price-old">{fmt(p.price)}</span>}
                    </div>
                    <button
                      className="mt-add-cart"
                      aria-label="Thêm vào giỏ"
                      onClick={() => addItem({ product_id: p.id, name: p.name, slug: p.slug, image: p.image, price: p.price_sale || p.price })}
                    >
                      <i className="bi bi-bag-plus" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMITMENTS — FEATURE-ICON-ROW */}
      {values.length > 0 && (
        <section className="mt-sec" style={{ background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }} aria-labelledby="commit-heading">
          <div className="mt-container">
            <div className="mt-eyebrow" data-reveal>Vì sao chọn chúng tôi</div>
            <h2 className="mt-sec-title" id="commit-heading" data-reveal data-delay="1">Cam kết <strong>với khách hàng</strong></h2>
            <div className="mt-feature-row">
              {values.map((v, i) => (
                <div className="mt-feature-item" data-reveal data-delay={String(i + 1)} key={v.title}>
                  <div className="mt-feature-icon"><i className={`bi bi-${v.icon}`} /></div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROMO — FULL-BLEED */}
      <section className="mt-sec-sm" aria-label="Khuyến mãi đặc biệt">
        <div className="mt-promo-bleed">
          <div className="mt-container">
            <div className="mt-promo-inner">
              <div data-reveal>
                <div className="mt-promo-label">{val('promo_label', 'Ưu đãi có giới hạn')}</div>
                <h2 className="mt-promo-title">{val('promo_title', 'Giảm đến')} <strong>{val('promo_percent', '20%')}</strong><br />dàn PC Gaming</h2>
                <p className="mt-promo-sub">{val('promo_desc')}</p>
                <PromoTimer />
                <Link to="/san-pham" className="mt-btn mt-btn-primary">Mua ngay <i className="bi bi-arrow-right ms-1" /></Link>
              </div>
              <div className="mt-promo-visual" data-reveal data-delay="2">
                <img src={val('promo_image', 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=700&auto=format&fit=crop&q=80')} alt="Khuyến mãi PC Gaming" loading="lazy" />
                <div className="mt-promo-tag">-{val('promo_percent', '20%')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS — STAT-BAR */}
      {stats.length > 0 && (
        <section className="mt-stats" aria-label="Số liệu thành tựu">
          <div className="mt-container">
            <div className="mt-stats-grid">
              {stats.map(s => <StatCounter key={s.label} target={s.num} suffix={s.suffix} label={s.label} />)}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS — HORIZONTAL-SCROLL */}
      {reviews.length > 0 && (
        <section className="mt-sec" aria-labelledby="review-heading">
          <div className="mt-container">
            <div className="mt-section-header">
              <div>
                <div className="mt-eyebrow" data-reveal>Đánh giá</div>
                <h2 className="mt-sec-title" id="review-heading" data-reveal data-delay="1">Khách hàng <strong>nói gì</strong></h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} data-reveal data-delay="2">
                <i className="bi bi-star-fill" style={{ color: 'var(--amber)' }} />
                <span style={{ fontWeight: 700 }}>{val('reviews_avg', '4.8')}/5</span>
                <span style={{ color: 'var(--text-3)', fontSize: 13 }}>({val('reviews_count', '0')}+ đánh giá)</span>
              </div>
            </div>
            <div className="mt-reviews-scroll" role="list">
              {reviews.map((r, i) => (
                <div className="mt-review-card" data-reveal data-delay={String(i + 1)} role="listitem" key={r.name}>
                  <div className="mt-review-stars">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <i key={idx} className={idx < r.rating ? 'bi bi-star-fill' : 'bi bi-star'} />
                    ))}
                  </div>
                  <p className="mt-review-text">{r.content}</p>
                  <div className="mt-review-author">
                    <div className="mt-review-avatar">{r.name.charAt(0)}</div>
                    <div><div className="mt-review-name">{r.name}</div><div className="mt-review-sub">{r.location}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NEWSLETTER */}
      <section className="mt-sec mt-newsletter" aria-labelledby="newsletter-heading">
        <div className="mt-container">
          <div className="mt-newsletter-inner">
            <div className="mt-eyebrow" style={{ justifyContent: 'center' }} data-reveal>Nhận ưu đãi</div>
            <h2 className="mt-sec-title" id="newsletter-heading" data-reveal data-delay="1">{val('newsletter_title', 'Đăng ký nhận tin công nghệ')}</h2>
            <p style={{ fontSize: 15, color: 'var(--text-2)', marginTop: 8 }} data-reveal data-delay="2">{val('newsletter_desc')}</p>
            <form className="mt-newsletter-form" data-reveal data-delay="3" onSubmit={e => e.preventDefault()} noValidate>
              <input type="email" placeholder="Email của bạn" aria-label="Nhập email đăng ký nhận tin" />
              <button type="submit">Đăng ký</button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
