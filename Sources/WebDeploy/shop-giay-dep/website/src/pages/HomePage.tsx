import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import HeroSlider from '../components/HeroSlider'
import { useSite } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      let cur = 0
      const step = Math.max(1, Math.ceil(target / 60))
      const t = setInterval(() => {
        cur = Math.min(cur + step, target)
        setValue(cur)
        if (cur >= target) clearInterval(t)
      }, 25)
      io.disconnect()
    }, { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [target])

  return <span ref={ref}>{value}{suffix}</span>
}

function PromoTimer() {
  const [remaining, setRemaining] = useState({ days: 2, hours: 14, mins: 37, secs: 44 })

  useEffect(() => {
    const end = new Date()
    end.setDate(end.getDate() + 2)
    end.setHours(end.getHours() + 14)
    const tick = () => {
      const diff = end.getTime() - Date.now()
      if (diff <= 0) { setRemaining({ days: 0, hours: 0, mins: 0, secs: 0 }); return }
      setRemaining({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="gd-promo-timer" aria-label="Đếm ngược thời gian">
      <div className="gd-timer-unit"><div className="gd-timer-num">{pad(remaining.days)}</div><div className="gd-timer-label">Ngày</div></div>
      <div className="gd-timer-unit"><div className="gd-timer-num">{pad(remaining.hours)}</div><div className="gd-timer-label">Giờ</div></div>
      <div className="gd-timer-unit"><div className="gd-timer-num">{pad(remaining.mins)}</div><div className="gd-timer-label">Phút</div></div>
      <div className="gd-timer-unit"><div className="gd-timer-num">{pad(remaining.secs)}</div><div className="gd-timer-label">Giây</div></div>
    </div>
  )
}

export default function HomePage() {
  const { settings, categories, products } = useSite()
  const { addItem } = useCart()

  const featured = products.filter(p => p.is_featured).slice(0, 4)
  const featuredList = featured.length > 0 ? featured : products.slice(0, 4)

  const values = [1, 2, 3, 4].map(i => ({
    icon: settings[`value${i}_icon`] || 'patch-check-fill',
    title: settings[`value${i}_title`] || '',
    desc: settings[`value${i}_desc`] || '',
  })).filter(v => v.title)

  const reviews = [1, 2, 3, 4].map(i => ({
    name: settings[`review${i}_name`] || '',
    location: settings[`review${i}_location`] || '',
    content: settings[`review${i}_content`] || '',
    rating: Number(settings[`review${i}_rating`] || 5),
  })).filter(r => r.name)

  const stats = [1, 2, 3, 4].map(i => ({
    num: Number(settings[`stat${i}_num`] || 0),
    suffix: settings[`stat${i}_suffix`] || '',
    label: settings[`stat${i}_label`] || '',
  })).filter(s => s.label)

  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'

  return (
    <>
      <HeroSlider />

      {/* ── Categories — GRID-CARDS ─────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="gd-sec" aria-labelledby="cat-heading">
          <div className="gd-container">
            <div className="gd-section-header">
              <div>
                <div className="gd-eyebrow" data-reveal>Danh mục</div>
                <h2 className="gd-sec-title" id="cat-heading" data-reveal data-delay="1">
                  Tìm đúng <em>đôi giày</em><br />của bạn
                </h2>
              </div>
              <Link to="/san-pham" className="gd-btn gd-btn-ghost" data-reveal data-delay="2">
                Xem tất cả <i className="bi bi-arrow-right ms-1" />
              </Link>
            </div>

            <div className="gd-cat-grid">
              {categories.map((c, i) => (
                <Link to={`/san-pham?cat=${c.slug}`} className="gd-cat-card" key={c.id} data-reveal data-delay={String((i % 4) + 1)}>
                  <img src={c.image} alt={c.name} loading="lazy" />
                  <div className="gd-cat-info"><h3>{c.name}</h3><p>{c.product_count} mẫu</p></div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured — BENTO-GRID ──────────────────────────────────────── */}
      {featuredList.length > 0 && (
        <section className="gd-sec" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }} aria-labelledby="feat-heading">
          <div className="gd-container">
            <div className="gd-section-header">
              <div>
                <div className="gd-eyebrow" data-reveal>Nổi bật</div>
                <h2 className="gd-sec-title" id="feat-heading" data-reveal data-delay="1">Đang <em>bán chạy</em></h2>
                <p className="gd-sec-sub" data-reveal data-delay="2">Những đôi giày được săn đón nhiều nhất trong tháng này</p>
              </div>
              <Link to="/san-pham" className="gd-btn gd-btn-outline" data-reveal data-delay="2">Xem thêm <i className="bi bi-arrow-right ms-1" /></Link>
            </div>

            <div className="gd-bento">
              {featuredList.map((p, i) => (
                <div className="gd-prod-card" data-reveal data-delay={String(i)} key={p.id}>
                  <div className="gd-prod-thumb">
                    <Link to={`/san-pham/${p.slug}`}><img src={p.image} alt={p.name} loading="lazy" /></Link>
                    {p.badge && <div className={`gd-prod-badge${p.is_new ? ' new' : p.price_sale ? ' sale' : ''}`}>{p.badge}</div>}
                    <div className="gd-prod-actions">
                      <button className="gd-prod-action-btn" aria-label="Yêu thích"><i className="bi bi-heart" /></button>
                      <Link to={`/san-pham/${p.slug}`} className="gd-prod-action-btn" aria-label="Xem nhanh"><i className="bi bi-eye" /></Link>
                    </div>
                  </div>
                  <div className="gd-prod-info">
                    <div className="gd-prod-cat">{p.category_name}</div>
                    <h3 className="gd-prod-name"><Link to={`/san-pham/${p.slug}`}>{p.name}</Link></h3>
                    <div className="gd-prod-footer">
                      <div>
                        <span className="gd-prod-price-new">{fmt(p.price_sale || p.price)}</span>
                        {!!p.price_sale && <span className="gd-prod-price-old">{fmt(p.price)}</span>}
                      </div>
                      <button
                        className="gd-add-cart"
                        aria-label="Thêm vào giỏ hàng"
                        disabled={!p.in_stock}
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
      )}

      {/* ── FEATURE-ICON-ROW — Why choose us ─────────────────────────────── */}
      {values.length > 0 && (
        <section className="gd-sec" aria-labelledby="why-heading">
          <div className="gd-container">
            <div className="gd-eyebrow" data-reveal>Vì sao chọn chúng tôi</div>
            <h2 className="gd-sec-title" id="why-heading" data-reveal data-delay="1">Cam kết <em>chất lượng</em></h2>
            <div className="gd-feat-row">
              {values.map((v, i) => (
                <div className="gd-feat-item" data-reveal data-delay={String(i)} key={i}>
                  <div className="gd-feat-icon"><i className={`bi bi-${v.icon}`} /></div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PROMO — FULL-BLEED ───────────────────────────────────────────── */}
      {settings.promo_title && (
        <section className="gd-promo" aria-label="Khuyến mãi đặc biệt">
          <div className="gd-container">
            <div className="gd-promo-inner">
              <div data-reveal>
                <div className="gd-promo-label">{settings.promo_label}</div>
                <h2 className="gd-promo-title">{settings.promo_title} <em>{settings.promo_percent}</em><br />bộ sưu tập Sneaker</h2>
                <p className="gd-promo-sub">{settings.promo_desc}</p>
                <PromoTimer />
                <Link to="/san-pham" className="gd-btn gd-btn-primary">Mua ngay <i className="bi bi-arrow-right ms-1" /></Link>
              </div>
              <div className="gd-promo-visual" data-reveal data-delay="2">
                <img src={settings.promo_image} alt="Sneaker đang giảm giá" loading="lazy" />
                <div className="gd-promo-tag">-{settings.promo_percent}</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS — HORIZONTAL-SCROLL ─────────────────────────────── */}
      {reviews.length > 0 && (
        <section className="gd-sec" aria-labelledby="review-heading">
          <div className="gd-container">
            <div className="gd-section-header">
              <div>
                <div className="gd-eyebrow" data-reveal>Đánh giá</div>
                <h2 className="gd-sec-title" id="review-heading" data-reveal data-delay="1">Khách hàng <em>nói gì</em></h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} data-reveal data-delay="2">
                <i className="bi bi-star-fill" style={{ color: 'var(--accent)' }} />
                <span style={{ fontWeight: 700 }}>{settings.reviews_avg || '4.9'}/5</span>
                <span style={{ color: 'var(--text-3)', fontSize: 13 }}>({settings.reviews_count || ''} đánh giá)</span>
              </div>
            </div>
            <div className="gd-reviews-scroll" role="list">
              {reviews.map((r, i) => (
                <div className="gd-review-card" data-reveal data-delay={String(i)} role="listitem" key={i}>
                  <div className="gd-review-stars">
                    {Array.from({ length: 5 }, (_, s) => (
                      <i key={s} className={`bi ${s < r.rating ? 'bi-star-fill' : 'bi-star'}`} />
                    ))}
                  </div>
                  <p className="gd-review-text">{r.content}</p>
                  <div className="gd-review-author">
                    <div className="gd-review-avatar">{r.name.charAt(0)}</div>
                    <div><div className="gd-review-name">{r.name}</div><div className="gd-review-sub">{r.location}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── STATS — STAT-BAR ─────────────────────────────────────────────── */}
      {stats.length > 0 && (
        <section className="gd-stats" aria-label="Số liệu thành tựu">
          <div className="gd-container">
            <div className="gd-stats-grid">
              {stats.map((s, i) => (
                <div className="gd-stat" data-reveal data-delay={String(i)} key={i}>
                  <div className="gd-stat-num"><CountUp target={s.num} suffix={s.suffix} /></div>
                  <div className="gd-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── NEWSLETTER ───────────────────────────────────────────────────── */}
      <section className="gd-sec gd-newsletter" aria-labelledby="newsletter-heading">
        <div className="gd-container">
          <div className="gd-newsletter-inner">
            <div className="gd-eyebrow" style={{ justifyContent: 'center' }} data-reveal>Nhận ưu đãi</div>
            <h2 className="gd-sec-title" id="newsletter-heading" data-reveal data-delay="1">{settings.newsletter_title || 'Đăng ký nhận tin khuyến mãi'}</h2>
            <p style={{ fontSize: 15, color: 'var(--text-2)', marginTop: 10 }} data-reveal data-delay="2">{settings.newsletter_desc}</p>
            <form className="gd-newsletter-form" data-reveal data-delay="3" onSubmit={e => e.preventDefault()} noValidate>
              <input type="email" name="email" placeholder="Email của bạn" aria-label="Nhập email đăng ký nhận tin" />
              <button type="submit">Đăng ký</button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
