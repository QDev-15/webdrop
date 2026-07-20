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

export default function HomePage() {
  const { settings, categories, products } = useSite()
  const { addItem } = useCart()

  useDocumentMeta({
    title: 'Vườn Xanh — Rau Củ Quả Hữu Cơ Giao Tận Nhà',
    description: 'Vườn Xanh cung cấp rau củ quả hữu cơ tươi mỗi ngày từ nông trại đến bàn ăn — không thuốc bảo vệ thực vật, giao hàng trong ngày.',
  })

  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'

  const commits = [1, 2, 3, 4].map(i => ({
    icon: settings[`commit${i}_icon`] || 'patch-check-fill',
    title: settings[`commit${i}_title`] || '',
    desc: settings[`commit${i}_desc`] || '',
  })).filter(v => v.title)

  const timeline = [1, 2, 3, 4].map(i => ({
    title: settings[`timeline${i}_title`] || '',
    desc: settings[`timeline${i}_desc`] || '',
  })).filter(v => v.title)

  const featured = products.filter(p => p.is_featured).slice(0, 6)
  const featuredList = featured.length > 0 ? featured : products.slice(0, 6)

  const stats = [1, 2, 3, 4].map(i => ({
    num: Number(settings[`stat${i}_num`] || 0),
    suffix: settings[`stat${i}_suffix`] || '',
    label: settings[`stat${i}_label`] || '',
  })).filter(s => s.label)

  const reviews = [1, 2, 3, 4].map(i => ({
    name: settings[`review${i}_name`] || '',
    location: settings[`review${i}_location`] || '',
    content: settings[`review${i}_content`] || '',
    rating: Number(settings[`review${i}_rating`] || 5),
  })).filter(r => r.name)

  return (
    <>
      <HeroSlider />

      {/* ── Commitments — FEATURE-ICON-ROW ─────────────────────────────── */}
      {commits.length > 0 && (
        <section className="rx-commit rx-sec-sm" aria-label="Cam kết">
          <div className="rx-container">
            <div className="rx-commit-row">
              {commits.map((c, i) => (
                <div className="rx-commit-item" data-reveal data-delay={String(i)} key={i}>
                  <div className="rx-commit-icon"><i className={`bi bi-${c.icon}`} /></div>
                  <div>
                    <h3>{c.title}</h3>
                    <p>{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Categories — GRID-CARDS ─────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="rx-sec" aria-label="Danh mục sản phẩm">
          <div className="rx-container">
            <div className="rx-eyebrow" data-reveal>Danh mục</div>
            <h2 className="rx-sec-title" data-reveal data-delay="1">Chọn theo <strong>nhóm rau củ</strong> bạn cần</h2>
            <p className="rx-sec-sub" data-reveal data-delay="2">Từ rau ăn lá mỗi bữa đến trái cây tráng miệng — mỗi nhóm đều được chọn lọc kỹ theo mùa vụ.</p>

            <div className="rx-cat-grid">
              {categories.map((c, i) => (
                <Link to={`/san-pham?cat=${c.slug}`} className="rx-cat-card" key={c.id} data-reveal data-delay={String((i % 4) + 1)}>
                  <div className={`rx-cat-img ${i % 2 === 0 ? 'rx-blob' : 'rx-blob-alt'}`}>
                    <img src={c.image} alt={c.name} loading="lazy" />
                  </div>
                  <h3>{c.name}</h3>
                  <p>{c.product_count} sản phẩm</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Timeline — Từ vườn đến bàn ăn ─────────────────────────────────── */}
      {timeline.length > 0 && (
        <section className="rx-timeline rx-sec" id="rx-quy-trinh" aria-label="Quy trình">
          <div className="rx-container">
            <div className="rx-eyebrow" data-reveal>Quy trình</div>
            <h2 className="rx-sec-title" data-reveal data-delay="1">Từ vườn đến bàn ăn <strong>chỉ trong một ngày</strong></h2>
            <p className="rx-sec-sub" data-reveal data-delay="2">Mỗi lô rau đều đi qua 4 bước để giữ trọn độ tươi khi đến tay bạn.</p>

            <div className="rx-timeline-track">
              {timeline.map((step, i) => (
                <div className="rx-timeline-step" data-reveal data-delay={String(i)} key={i}>
                  <div className="rx-timeline-num">{i + 1}</div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured products — GRID-CARDS ─────────────────────────────────── */}
      {featuredList.length > 0 && (
        <section className="rx-sec" aria-label="Sản phẩm nổi bật">
          <div className="rx-container">
            <div className="rx-section-header">
              <div>
                <div className="rx-eyebrow" data-reveal>Bán chạy nhất</div>
                <h2 className="rx-sec-title" data-reveal data-delay="1">Sản phẩm <strong>được yêu thích</strong> tuần này</h2>
              </div>
              <Link to="/san-pham" className="rx-btn rx-btn-outline" data-reveal data-delay="1">Xem tất cả</Link>
            </div>

            <div className="rx-prod-grid" style={{ marginTop: 40 }}>
              {featuredList.map((p, i) => (
                <div className="rx-prod-card" data-reveal data-delay={String((i % 6) + 1)} key={p.id}>
                  <div className="rx-prod-thumb">
                    <img src={p.image} alt={p.name} loading="lazy" />
                    {p.badge && <div className={`rx-prod-badge${p.is_new ? ' new' : p.price_sale ? ' sale' : ''}`}>{p.badge}</div>}
                    <div className="rx-prod-actions">
                      <button className="rx-prod-action-btn" aria-label="Yêu thích"><i className="bi bi-heart" /></button>
                      <Link to={`/san-pham/${p.slug}`} className="rx-prod-action-btn" aria-label="Xem chi tiết"><i className="bi bi-eye" /></Link>
                    </div>
                  </div>
                  <div className="rx-prod-info">
                    <div className="rx-prod-cat">{p.category_name}</div>
                    <h3 className="rx-prod-name"><Link to={`/san-pham/${p.slug}`}>{p.name}</Link></h3>
                    <div className="rx-prod-footer">
                      <div className="rx-prod-price">
                        <span className="rx-prod-price-new">{fmt(p.price_sale || p.price)}</span>
                        {!!p.price_sale && <span className="rx-prod-price-old">{fmt(p.price)}</span>}
                        {!p.price_sale && p.unit && <span className="rx-prod-unit">/{p.unit}</span>}
                      </div>
                      <button
                        className="rx-add-cart"
                        aria-label="Thêm vào giỏ"
                        disabled={!p.in_stock}
                        onClick={() => addItem({ product_id: p.id, name: p.name, slug: p.slug, image: p.image, price: p.price_sale || p.price })}
                      >
                        <i className="bi bi-plus-lg" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Promo — FULL-BLEED torn-paper ─────────────────────────────────── */}
      {settings.promo_title && (
        <section className="rx-promo" aria-label="Combo rau củ tuần">
          <div className="rx-container">
            <div className="rx-promo-inner">
              <div data-reveal>
                <div className="rx-promo-label">{settings.promo_label}</div>
                <h2 className="rx-promo-title">
                  {settings.promo_title.includes(',')
                    ? <>{settings.promo_title.split(',')[0]},<br /><strong>{settings.promo_title.split(',').slice(1).join(',').trim()}</strong></>
                    : settings.promo_title}
                </h2>
                <p className="rx-promo-sub">{settings.promo_desc}</p>
                <ul className="rx-promo-list">
                  {[settings.promo_list1, settings.promo_list2, settings.promo_list3].filter(Boolean).map((li, i) => (
                    <li key={i}><i className="bi bi-check-circle-fill" /> {li}</li>
                  ))}
                </ul>
                <Link to="/san-pham" className="rx-btn rx-btn-primary rx-btn-lg">
                  <i className="bi bi-basket2-fill" /> {settings.promo_cta_text || 'Đặt combo ngay'}
                </Link>
              </div>
              {settings.promo_image && (
                <div className="rx-promo-visual rx-blob-alt" data-reveal data-delay="1">
                  <img src={settings.promo_image} alt="Combo rau củ tuần đóng gói sẵn" loading="lazy" />
                  {settings.promo_tag && <div className="rx-promo-tag">{settings.promo_tag}</div>}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Brand story — ALTERNATING-STRIPS ─────────────────────────────── */}
      {(settings.story1_text || settings.story2_text) && (
        <section className="rx-sec" aria-label="Câu chuyện thương hiệu">
          <div className="rx-container">
            {settings.story1_text && (
              <div className="rx-story-row" data-reveal>
                <div>
                  <div className="rx-story-num">{settings.story1_num || '01'}</div>
                  <h3 className="rx-story-title">{settings.story1_title_pre} <strong>{settings.story1_title_strong}</strong> {settings.story1_title_post}</h3>
                  <p className="rx-story-text">{settings.story1_text}</p>
                  <ul className="rx-story-list">
                    {[settings.story1_list1, settings.story1_list2].filter(Boolean).map((li, i) => (
                      <li key={i}><i className="bi bi-check2" /> {li}</li>
                    ))}
                  </ul>
                </div>
                <div className="rx-story-img">
                  <img src={settings.story1_image} alt={settings.story1_title_strong} loading="lazy" />
                </div>
              </div>
            )}

            {settings.story2_text && (
              <div className="rx-story-row reverse" data-reveal>
                <div>
                  <div className="rx-story-num">{settings.story2_num || '02'}</div>
                  <h3 className="rx-story-title">{settings.story2_title_pre} <strong>{settings.story2_title_strong}</strong>, {settings.story2_title_post}</h3>
                  <p className="rx-story-text">{settings.story2_text}</p>
                  <ul className="rx-story-list">
                    {[settings.story2_list1, settings.story2_list2].filter(Boolean).map((li, i) => (
                      <li key={i}><i className="bi bi-check2" /> {li}</li>
                    ))}
                  </ul>
                </div>
                <div className="rx-story-img">
                  <img src={settings.story2_image} alt={settings.story2_title_strong} loading="lazy" />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Stats — STAT-BAR ─────────────────────────────────────────────── */}
      {stats.length > 0 && (
        <section className="rx-stats" aria-label="Số liệu">
          <div className="rx-container">
            <div className="rx-stats-grid">
              {stats.map((s, i) => (
                <div className="rx-stat" data-reveal data-delay={String(i)} key={i}>
                  <div className="rx-stat-num"><CountUp target={s.num} suffix={s.suffix} /></div>
                  <div className="rx-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials — HORIZONTAL-SCROLL ─────────────────────────────── */}
      {reviews.length > 0 && (
        <section className="rx-sec" aria-label="Khách hàng nói gì">
          <div className="rx-container">
            <div className="rx-eyebrow" data-reveal>Cảm nhận khách hàng</div>
            <h2 className="rx-sec-title" data-reveal data-delay="1">Được tin dùng bởi <strong>hàng ngàn gia đình</strong></h2>

            <div className="rx-reviews-scroll" role="list">
              {reviews.map((r, i) => (
                <div className="rx-review-card" data-reveal data-delay={String(i)} role="listitem" key={i}>
                  <div className="rx-review-stars">
                    {Array.from({ length: 5 }, (_, s) => (
                      <i key={s} className={`bi ${s < r.rating ? 'bi-star-fill' : 'bi-star'}`} />
                    ))}
                  </div>
                  <p className="rx-review-text">"{r.content}"</p>
                  <div className="rx-review-author">
                    <div className="rx-review-avatar">{r.name.charAt(0)}</div>
                    <div>
                      <div className="rx-review-name">{r.name}</div>
                      <div className="rx-review-sub">{r.location}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
