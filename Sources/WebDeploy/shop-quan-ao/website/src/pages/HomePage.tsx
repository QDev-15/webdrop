import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import HeroSlider from '../components/HeroSlider'
import { useSite } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

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
    <div className="qa-promo-timer" aria-label="Đếm ngược thời gian">
      <div className="qa-timer-unit"><div className="qa-timer-num">{pad(remaining.days)}</div><div className="qa-timer-label">Ngày</div></div>
      <div className="qa-timer-unit"><div className="qa-timer-num">{pad(remaining.hours)}</div><div className="qa-timer-label">Giờ</div></div>
      <div className="qa-timer-unit"><div className="qa-timer-num">{pad(remaining.mins)}</div><div className="qa-timer-label">Phút</div></div>
      <div className="qa-timer-unit"><div className="qa-timer-num">{pad(remaining.secs)}</div><div className="qa-timer-label">Giây</div></div>
    </div>
  )
}

export default function HomePage() {
  useDocumentMeta({
    title: 'Lys Chic — Thời Trang Nữ Nhẹ Nhàng, Tinh Tế',
    description: 'Khám phá bộ sưu tập váy đầm, áo, quần và phụ kiện thời trang nữ tại Lys Chic — chất liệu mềm mại, form dáng tinh tế, giao hàng toàn quốc.',
  })
  const { settings, categories, products } = useSite()
  const { addItem } = useCart()

  const featured = products.filter(p => p.is_featured).slice(0, 6)
  const featuredList = featured.length > 0 ? featured : products.slice(0, 6)

  const values = [1, 2, 3, 4].map(i => ({
    icon: settings[`value${i}_icon`] || 'flower2',
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
        <section className="qa-sec" aria-labelledby="cat-heading">
          <div className="qa-container">
            <div className="qa-section-header">
              <div>
                <div className="qa-eyebrow" data-reveal>Danh mục</div>
                <h2 className="qa-sec-title" id="cat-heading" data-reveal data-delay="1">
                  Mặc đẹp mỗi <strong>ngày</strong>
                </h2>
              </div>
              <Link to="/san-pham" className="qa-btn qa-btn-ghost" data-reveal data-delay="2">
                Xem tất cả <i className="bi bi-arrow-right ms-1" />
              </Link>
            </div>
            <div className="qa-cat-grid">
              {categories.map((c, i) => (
                <Link to={`/san-pham?cat=${c.slug}`} className="qa-cat-card" key={c.id} data-reveal data-delay={String((i % 4) + 1)}>
                  <img src={c.image} alt={c.name} loading="lazy" />
                  <div className="qa-cat-info"><h3>{c.name}</h3><p>{c.product_count} mẫu</p></div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured — MASONRY ──────────────────────────────────────────── */}
      {featuredList.length > 0 && (
        <section className="qa-sec" style={{ background: 'var(--surface)' }} aria-labelledby="feat-heading">
          <div className="qa-container">
            <div className="qa-section-header">
              <div>
                <div className="qa-eyebrow" data-reveal>Nổi bật</div>
                <h2 className="qa-sec-title" id="feat-heading" data-reveal data-delay="1">Đang <strong>được yêu thích</strong></h2>
                <p className="qa-sec-sub" data-reveal data-delay="2">Những mẫu được khách hàng lựa chọn nhiều nhất trong tháng</p>
              </div>
              <Link to="/san-pham" className="qa-btn qa-btn-outline" data-reveal data-delay="2">Xem thêm <i className="bi bi-arrow-right ms-1" /></Link>
            </div>

            <div className="qa-masonry">
              {featuredList.map((p, i) => (
                <div className="qa-prod-card" data-reveal data-delay={String((i % 3) + 1)} key={p.id}>
                  <div className="qa-prod-thumb">
                    <Link to={`/san-pham/${p.slug}`}><img src={p.image} alt={p.name} loading="lazy" /></Link>
                    {p.badge && <div className={`qa-prod-badge${p.is_new ? ' new' : p.price_sale ? ' sale' : ''}`}>{p.badge}</div>}
                    <div className="qa-prod-actions">
                      <button className="qa-prod-action-btn" aria-label="Yêu thích"><i className="bi bi-heart" /></button>
                    </div>
                  </div>
                  <div className="qa-prod-info">
                    <div className="qa-prod-cat">{p.category_name}</div>
                    <h3 className="qa-prod-name"><Link to={`/san-pham/${p.slug}`}>{p.name}</Link></h3>
                    <div className="qa-prod-footer">
                      <div>
                        <span className="qa-prod-price-new">{fmt(p.price_sale || p.price)}</span>
                        {!!p.price_sale && <span className="qa-prod-price-old">{fmt(p.price)}</span>}
                      </div>
                      <button
                        className="qa-add-cart"
                        aria-label="Thêm vào giỏ"
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

      {/* ── Brand values — LIST-ELEGANT ─────────────────────────────────── */}
      {values.length > 0 && (
        <section className="qa-sec" aria-labelledby="values-heading">
          <div className="qa-container-sm">
            <div className="qa-eyebrow" data-reveal>Vì sao chọn chúng tôi</div>
            <h2 className="qa-sec-title" id="values-heading" data-reveal data-delay="1">Cam kết <strong>của chúng tôi</strong></h2>
            <div className="qa-values-list">
              {values.map((v, i) => (
                <div className="qa-value-item" data-reveal data-delay={String(i + 1)} key={i}>
                  <div className="qa-value-num">{String(i + 1).padStart(2, '0')}</div>
                  <div className="qa-value-body"><h3>{v.title}</h3><p>{v.desc}</p></div>
                  <div className="qa-value-icon"><i className={`bi bi-${v.icon}`} /></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Promo — FULL-BLEED ───────────────────────────────────────────── */}
      {settings.promo_title && (
        <section className="qa-sec-sm" aria-label="Khuyến mãi đặc biệt">
          <div className="qa-container">
            <div className="qa-promo">
              <div className="qa-promo-inner">
                <div data-reveal>
                  <div className="qa-promo-label">{settings.promo_label}</div>
                  <h2 className="qa-promo-title">{settings.promo_title} <strong>{settings.promo_percent}</strong><br />bộ sưu tập mới</h2>
                  <p className="qa-promo-sub">{settings.promo_desc}</p>
                  <PromoTimer />
                  <Link to="/san-pham" className="qa-btn qa-btn-primary">Mua ngay <i className="bi bi-arrow-right ms-1" /></Link>
                </div>
                <div className="qa-promo-visual" data-reveal data-delay="2">
                  <img src={settings.promo_image} alt="Bộ sưu tập đang giảm giá" loading="lazy" />
                  <div className="qa-promo-tag">-{settings.promo_percent}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Reviews — HORIZONTAL-SCROLL ──────────────────────────────────── */}
      {reviews.length > 0 && (
        <section className="qa-sec" aria-labelledby="review-heading">
          <div className="qa-container">
            <div className="qa-section-header">
              <div>
                <div className="qa-eyebrow" data-reveal>Đánh giá</div>
                <h2 className="qa-sec-title" id="review-heading" data-reveal data-delay="1">Khách hàng <strong>nói gì</strong></h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} data-reveal data-delay="2">
                <i className="bi bi-star-fill" style={{ color: 'var(--butter)' }} />
                <span style={{ fontWeight: 700 }}>{settings.reviews_avg || '4.9'}/5</span>
                <span style={{ color: 'var(--text-3)', fontSize: 13 }}>({settings.reviews_count || ''} đánh giá)</span>
              </div>
            </div>
            <div className="qa-reviews-scroll" role="list">
              {reviews.map((r, i) => (
                <div className="qa-review-card" data-reveal data-delay={String(i + 1)} role="listitem" key={i}>
                  <div className="qa-review-stars">
                    {Array.from({ length: 5 }, (_, s) => (
                      <i key={s} className={`bi ${s < r.rating ? 'bi-star-fill' : 'bi-star'}`} />
                    ))}
                  </div>
                  <p className="qa-review-text">{r.content}</p>
                  <div className="qa-review-author">
                    <div className="qa-review-avatar">{r.name.charAt(0)}</div>
                    <div><div className="qa-review-name">{r.name}</div><div className="qa-review-sub">{r.location}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Stats — STAT-BAR ─────────────────────────────────────────────── */}
      {stats.length > 0 && (
        <section className="qa-stats" aria-label="Số liệu thành tựu">
          <div className="qa-container">
            <div className="qa-stats-grid">
              {stats.map((s, i) => (
                <div className="qa-stat" data-reveal data-delay={String(i + 1)} key={i}>
                  <div className="qa-stat-num"><CountUp target={s.num} suffix={s.suffix} /></div>
                  <div className="qa-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Newsletter ───────────────────────────────────────────────────── */}
      <section className="qa-sec qa-newsletter" aria-labelledby="newsletter-heading">
        <div className="qa-container">
          <div className="qa-newsletter-inner">
            <div className="qa-eyebrow" style={{ justifyContent: 'center' }} data-reveal>Nhận ưu đãi</div>
            <h2 className="qa-sec-title" id="newsletter-heading" data-reveal data-delay="1">{settings.newsletter_title || 'Đăng ký nhận tin khuyến mãi'}</h2>
            <p style={{ fontSize: 15, color: 'var(--text-2)', marginTop: 8 }} data-reveal data-delay="2">{settings.newsletter_desc}</p>
            <form className="qa-newsletter-form" data-reveal data-delay="3" onSubmit={e => e.preventDefault()} noValidate>
              <input type="email" name="email" placeholder="Email của bạn" aria-label="Nhập email đăng ký nhận tin" />
              <button type="submit">Đăng ký</button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
