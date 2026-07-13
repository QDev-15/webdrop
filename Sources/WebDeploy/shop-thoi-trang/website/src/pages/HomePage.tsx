import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'
import HeroSlider from '../components/HeroSlider'

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    const step = Math.max(1, Math.ceil(target / 60))
    let cur = 0
    const t = setInterval(() => {
      cur = Math.min(cur + step, target)
      setValue(cur)
      if (cur >= target) clearInterval(t)
    }, 25)
    return () => clearInterval(t)
  }, [target, active])
  return value
}

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect() } }, { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const count = useCountUp(value, visible)
  return (
    <div className="st-stat-item" ref={ref}>
      <div className="st-stat-num">{count}{suffix}</div>
      <div className="st-stat-label">{label}</div>
    </div>
  )
}

function Countdown({ endAt }: { endAt: string }) {
  const [remaining, setRemaining] = useState('')
  const target = useRef<number>(endAt ? new Date(endAt).getTime() : Date.now() + (11 * 3600 + 47 * 60 + 23) * 1000)

  useEffect(() => {
    const pad = (n: number) => String(n).padStart(2, '0')
    const tick = () => {
      const diff = target.current - Date.now()
      if (diff <= 0) { setRemaining('ended'); return }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setRemaining(`${pad(h)}:${pad(m)}:${pad(s)}`)
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  if (remaining === 'ended') {
    return <div className="st-countdown" style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>Đã kết thúc</div>
  }
  const [h, m, s] = remaining.split(':')
  return (
    <div className="st-countdown" aria-label="Thời gian còn lại">
      <div className="st-countdown-unit"><span className="st-countdown-num">{h || '00'}</span><span className="st-countdown-label">Giờ</span></div>
      <div className="st-countdown-sep">:</div>
      <div className="st-countdown-unit"><span className="st-countdown-num">{m || '00'}</span><span className="st-countdown-label">Phút</span></div>
      <div className="st-countdown-sep">:</div>
      <div className="st-countdown-unit"><span className="st-countdown-num">{s || '00'}</span><span className="st-countdown-label">Giây</span></div>
    </div>
  )
}

export default function HomePage() {
  const { settings, categories, products, testimonials } = useSite()
  const { addItem } = useCart()
  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'

  const featured = products.filter(p => p.is_featured).slice(0, 5)
  const bentoItems = featured.length >= 5 ? featured : [...featured, ...products.filter(p => !p.is_featured)].slice(0, 5)

  const trackRef = useRef<HTMLDivElement>(null)
  const scrollTrack = (dir: number) => trackRef.current?.scrollBy({ left: dir * 380, behavior: 'smooth' })

  return (
    <>
      <HeroSlider />

      <section className="st-statbar" aria-label="Thống kê">
        <div className="st-container">
          <div className="st-statbar-grid">
            <StatItem value={Number(settings.stat_customers) || 50} suffix={settings.stat_customers_suffix || 'K+'} label="Khách hàng" />
            <StatItem value={Number(settings.stat_products) || 2850} suffix={settings.stat_products_suffix || '+'} label="Sản phẩm" />
            <StatItem value={Number(settings.stat_rating) || 5} suffix="" label="Đánh giá trung bình" />
            <StatItem value={Number(settings.stat_freeship_pct) || 100} suffix="%" label="Miễn phí vận chuyển" />
          </div>
        </div>
      </section>

      <section className="st-sec-sm" aria-label="Danh mục sản phẩm">
        <div className="st-container">
          <div className="text-center mb-5" data-reveal>
            <div className="st-eyebrow">Danh Mục</div>
            <h2 className="st-sec-title">Phong Cách<br />Của Bạn</h2>
          </div>
        </div>
        <div className="st-container">
          <div className="st-cats-grid">
            {categories.map((cat, i) => (
              <Link to={`/san-pham?cat=${cat.slug}`} className="st-cat-card" data-reveal data-delay={String((i % 3) + 1)} key={cat.id}>
                <img src={cat.image} alt={cat.name} loading="lazy" />
                <div className="st-cat-overlay">
                  <div className="st-cat-name">{cat.name}</div>
                  <div className="st-cat-count">{cat.product_count}+ sản phẩm</div>
                  <div className="st-cat-arrow">Xem tất cả <i className="bi bi-arrow-right" /></div>
                </div>
              </Link>
            ))}
            <Link to="/san-pham?sale=1" className="st-cat-card" data-reveal data-delay="2">
              <img src="https://picsum.photos/seed/novaSale/600/460" alt="Sale" loading="lazy" />
              <div className="st-cat-overlay">
                <div className="st-cat-name">Sale</div>
                <div className="st-cat-count">Giảm đến 50%</div>
                <div className="st-cat-arrow">Xem ngay <i className="bi bi-arrow-right" /></div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {bentoItems.length > 0 && (
        <section className="st-sec" style={{ background: 'var(--surface)' }} aria-label="Sản phẩm nổi bật">
          <div className="st-container">
            <div className="d-flex align-items-end justify-content-between gap-3 mb-5 flex-wrap" data-reveal>
              <div>
                <div className="st-eyebrow">Nổi Bật</div>
                <h2 className="st-sec-title mb-0">Được Yêu<br />Thích Nhất</h2>
              </div>
              <Link to="/san-pham" className="st-btn st-btn-outline">Xem tất cả <i className="bi bi-arrow-right" /></Link>
            </div>

            <div className="st-bento">
              {bentoItems.map((p, i) => {
                const colors = p.colors ? p.colors.split('|').map(c => c.split(':')) : []
                return (
                  <div className={i === 0 ? 'st-bento-large st-prod-card' : 'st-bento-small st-prod-card'} data-reveal data-delay={String((i % 3) + 1)} key={p.id}>
                    <div className="st-prod-thumb">
                      <Link to={`/san-pham/${p.slug}`}><img src={p.image} alt={p.name} loading="lazy" /></Link>
                      {p.badge && <span className={`st-prod-badge ${p.is_new ? 'st-prod-badge-new' : p.price_sale ? 'st-prod-badge-sale' : 'st-prod-badge-hot'}`}>{p.badge}</span>}
                      <div className="st-prod-actions">
                        <button aria-label="Thêm vào giỏ hàng" onClick={() => addItem({ product_id: p.id, name: p.name, slug: p.slug, image: p.image, price: p.price_sale || p.price })}>Thêm vào giỏ</button>
                        <Link to={`/san-pham/${p.slug}`} aria-label="Xem nhanh">Xem nhanh</Link>
                      </div>
                    </div>
                    <div className="st-prod-info">
                      <div className="st-prod-brand">{p.brand}</div>
                      <div className="st-prod-name">{p.name}</div>
                      <div className="st-prod-price">
                        <span className="st-price-current">{fmt(p.price_sale || p.price)}</span>
                        {!!p.price_sale && p.price_sale < p.price && (
                          <>
                            <span className="st-price-original">{fmt(p.price)}</span>
                            <span className="st-price-pct">-{Math.round((1 - p.price_sale / p.price) * 100)}%</span>
                          </>
                        )}
                      </div>
                      {colors.length > 0 && (
                        <div className="st-prod-colors">
                          {colors.map(([name, hex]) => (
                            <span key={name} className="st-color-dot" style={{ background: hex, outline: hex === '#ffffff' ? '1px solid #ccc' : undefined }} title={name} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <div className="st-strip" aria-label="Về thương hiệu">
        <div className="st-strip-img">
          <img src="https://picsum.photos/seed/novaStory1/800/640" alt="Câu chuyện thương hiệu" loading="lazy" />
        </div>
        <div className="st-strip-content">
          <div className="st-strip-watermark" aria-hidden="true">{settings.story1_watermark || '01'}</div>
          <div className="st-eyebrow">{settings.story1_badge}</div>
          <h2 className="st-sec-title">{settings.story1_title_1}<br />{settings.story1_title_2}</h2>
          <p className="st-sec-sub" style={{ maxWidth: 400 }}>{settings.story1_text}</p>
          <div className="st-strip-features" style={{ marginTop: 24 }}>
            {[settings.story1_feat1, settings.story1_feat2, settings.story1_feat3].filter(Boolean).map((f, i) => (
              <div className="st-strip-feature" key={i}><i className="bi bi-check2-circle" /><span>{f}</span></div>
            ))}
          </div>
          <div className="mt-4">
            <Link to="/lien-he" className="st-btn st-btn-dark">Tìm hiểu thêm <i className="bi bi-arrow-right" /></Link>
          </div>
        </div>
      </div>

      <div className="st-strip" aria-label="Cam kết chất lượng">
        <div className="st-strip-content st-dark">
          <div className="st-strip-watermark" aria-hidden="true">{settings.story2_watermark || '02'}</div>
          <div className="st-eyebrow">{settings.story2_badge}</div>
          <h2 className="st-sec-title">{settings.story2_title_1}<br />{settings.story2_title_2}</h2>
          <p className="st-sec-sub" style={{ maxWidth: 400 }}>{settings.story2_text}</p>
          <div className="st-strip-features" style={{ marginTop: 24 }}>
            {[settings.story2_feat1, settings.story2_feat2, settings.story2_feat3].filter(Boolean).map((f, i) => (
              <div className="st-strip-feature" key={i}><i className="bi bi-shield-check" /><span>{f}</span></div>
            ))}
          </div>
          <div className="mt-4">
            <Link to="/san-pham" className="st-btn st-btn-outline-white">Mua sắm ngay <i className="bi bi-arrow-right" /></Link>
          </div>
        </div>
        <div className="st-strip-img">
          <img src="https://picsum.photos/seed/novaStory2/800/640" alt="Chất lượng sản phẩm" loading="lazy" />
        </div>
      </div>

      <section className="st-promo" aria-label="Flash Sale">
        <div className="st-container">
          <div className="st-promo-inner">
            <div className="st-promo-tag" data-reveal>{settings.promo_tag || 'Flash Sale'}</div>
            <h2 className="st-promo-heading" data-reveal data-delay="1">
              {settings.promo_title || 'GIẢM ĐẾN'}<br /><span>{settings.promo_percent || '50%'}</span>
            </h2>
            <p className="st-promo-desc" data-reveal data-delay="2">{settings.promo_desc}</p>
            <div data-reveal data-delay="3">
              <Countdown endAt={settings.promo_end_at} />
            </div>
            <div data-reveal data-delay="4">
              <Link to="/san-pham?sale=1" className="st-btn st-btn-primary st-btn-lg">Mua ngay — Kết thúc sớm <i className="bi bi-arrow-right" /></Link>
            </div>
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="st-sec st-testi-bg" aria-label="Đánh giá khách hàng">
          <div className="st-container">
            <div className="d-flex align-items-end justify-content-between gap-3 mb-5 flex-wrap" data-reveal>
              <div>
                <div className="st-eyebrow">Phản Hồi</div>
                <h2 className="st-sec-title mb-0">Khách Hàng<br />Nói Gì</h2>
              </div>
              <div className="d-flex gap-2">
                <button className="st-view-btn" onClick={() => scrollTrack(-1)} aria-label="Trước"><i className="bi bi-chevron-left" /></button>
                <button className="st-view-btn active" onClick={() => scrollTrack(1)} aria-label="Tiếp theo"><i className="bi bi-chevron-right" /></button>
              </div>
            </div>

            <div className="st-testi-track" ref={trackRef}>
              {testimonials.map(t => (
                <div className="st-testi-card" key={t.id}>
                  <div className="st-testi-stars">
                    {Array.from({ length: 5 }, (_, i) => <i key={i} className={`bi ${i < t.stars ? 'bi-star-fill' : 'bi-star'}`} />)}
                  </div>
                  <div className="st-testi-quote">"</div>
                  <p className="st-testi-text">"{t.content}"</p>
                  <div className="st-testi-author">
                    {t.author_avatar && t.author_avatar.startsWith('http') ? (
                      <img src={t.author_avatar} alt={t.author_name} className="st-testi-avatar" style={{ objectFit: 'cover' }} />
                    ) : (
                      <div className="st-testi-avatar">{t.author_name.charAt(0).toUpperCase()}</div>
                    )}
                    <div>
                      <div className="st-testi-name">{t.author_name}</div>
                      <div className="st-testi-role">{t.author_role}</div>
                      {t.product_purchased && <div className="st-testi-brand">{t.product_purchased}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="st-newsletter" aria-label="Đăng ký nhận tin">
        <div className="st-container">
          <div className="st-newsletter-inner">
            <div>
              <h2 className="st-newsletter-heading">{settings.newsletter_title || 'Nhận Ưu Đãi Độc Quyền'}</h2>
              <p className="st-newsletter-sub">{settings.newsletter_sub}</p>
            </div>
            <form className="st-newsletter-form" onSubmit={e => e.preventDefault()} noValidate>
              <input type="email" placeholder="Nhập email của bạn..." aria-label="Email đăng ký" />
              <button type="submit">Đăng Ký</button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
