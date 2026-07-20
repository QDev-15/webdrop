import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'
import HeroSlider from '../components/HeroSlider'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function HomePage() {
  useDocumentMeta({
    title: 'Tươi Mỗi Ngày — Thực Phẩm Sạch, Tươi Mỗi Ngày',
    description: 'Rau củ hữu cơ, thịt cá tươi, gạo & đồ khô truy xuất nguồn gốc rõ ràng, giao hàng lạnh trong ngày. Đạt chuẩn VietGAP — không thuốc bảo vệ thực vật.',
  })
  const { settings, categories, products } = useSite()
  const { addItem } = useCart()
  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'

  const commits = [1, 2, 3, 4].map(i => ({
    icon: settings[`commit${i}_icon`] || 'flower1',
    title: settings[`commit${i}_title`] || '',
    desc: settings[`commit${i}_desc`] || '',
  })).filter(c => c.title)

  const timeline = [1, 2, 3, 4].map(i => ({
    title: settings[`timeline${i}_title`] || '',
    desc: settings[`timeline${i}_desc`] || '',
  })).filter(t => t.title)

  const stats = [1, 2, 3, 4].map(i => ({
    num: settings[`stat${i}_num`] || '0',
    suffix: settings[`stat${i}_suffix`] || '',
    label: settings[`stat${i}_label`] || '',
  })).filter(s => s.label)

  const reviews = [1, 2, 3, 4].map(i => ({
    name: settings[`review${i}_name`] || '',
    location: settings[`review${i}_location`] || '',
    content: settings[`review${i}_content`] || '',
    rating: Number(settings[`review${i}_rating`] || '5'),
  })).filter(r => r.name)

  const featured = products.filter(p => p.is_featured).slice(0, 5)
  const featuredList = featured.length > 0 ? featured : products.slice(0, 5)

  return (
    <>
      <HeroSlider />

      {/* FEATURE-ICON-ROW */}
      <section className="tp-sec tp-features-bg">
        <div className="tp-container">
          <div className="tp-sec-header tp-center" data-reveal>
            <div className="tp-eyebrow"><i className="bi bi-leaf" /> Cam kết của chúng tôi</div>
            <h2 className="tp-sec-title">Vì sao khách hàng <em>tin chọn</em></h2>
            <p className="tp-sec-sub">Mỗi sản phẩm đều đi qua quy trình kiểm định nghiêm ngặt trước khi đến tay bạn.</p>
          </div>
          <div className="tp-feature-grid">
            {commits.map((c, i) => (
              <div className="tp-feature" data-reveal data-delay={String(i + 1)} key={i}>
                <div className="tp-feature-icon"><i className={`bi bi-${c.icon}`} /></div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES — GRID-CARDS */}
      <section className="tp-sec">
        <div className="tp-container">
          <div className="tp-sec-header tp-split" data-reveal>
            <div>
              <div className="tp-eyebrow"><i className="bi bi-grid" /> Danh mục</div>
              <h2 className="tp-sec-title">Mua sắm theo <em>nhu cầu</em></h2>
            </div>
            <Link to="/san-pham" className="tp-btn tp-btn-ghost">Xem tất cả <i className="bi bi-arrow-right" /></Link>
          </div>
          <div className="tp-cat-grid">
            {categories.map((c, i) => (
              <Link to={`/san-pham?cat=${c.slug}`} className="tp-cat-card" data-reveal data-delay={String((i % 5) + 1)} key={c.id}>
                <img src={c.image} alt={c.name} loading="lazy" />
                <div className="tp-cat-overlay" />
                <div className="tp-cat-info"><h3>{c.name}</h3><span>{c.product_count} sản phẩm</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="quy-trinh" className="tp-sec tp-timeline-bg">
        <div className="tp-container">
          <div className="tp-sec-header tp-center" data-reveal>
            <div className="tp-eyebrow"><i className="bi bi-signpost-split" /> Quy trình</div>
            <h2 className="tp-sec-title">Từ nông trại <em>đến bàn ăn</em></h2>
            <p className="tp-sec-sub">4 bước đảm bảo mỗi sản phẩm giữ trọn độ tươi và an toàn khi đến tay bạn.</p>
          </div>
          <div className="tp-timeline">
            {timeline.map((t, i) => (
              <div className="tp-timeline-item" data-reveal data-delay={String(i + 1)} key={i}>
                <div className="tp-timeline-dot">{i + 1}</div>
                <div className="tp-timeline-content">
                  <div className="tp-timeline-step">Bước {i + 1}</div>
                  <h3>{t.title}</h3>
                  <p>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS — BENTO-GRID */}
      {featuredList.length > 0 && (
        <section className="tp-sec">
          <div className="tp-container">
            <div className="tp-sec-header tp-split" data-reveal>
              <div>
                <div className="tp-eyebrow"><i className="bi bi-star" /> Bán chạy</div>
                <h2 className="tp-sec-title">Sản phẩm <em>được yêu thích</em></h2>
              </div>
              <Link to="/san-pham" className="tp-btn tp-btn-ghost">Xem tất cả <i className="bi bi-arrow-right" /></Link>
            </div>
            <div className="tp-bento">
              {featuredList.map((p, i) => (
                <Link
                  to={`/san-pham/${p.slug}`}
                  className={`tp-prod-card ${i === 0 ? 'tp-bento-large' : 'tp-bento-small'}`}
                  data-reveal data-delay={String(i + 1)}
                  key={p.id}
                >
                  <div className="tp-prod-thumb">
                    {p.badge && (
                      <span className={`tp-prod-badge ${p.is_new ? 'tp-prod-badge-new' : p.price_sale ? 'tp-prod-badge-sale' : 'tp-prod-badge-organic'}`}>{p.badge}</span>
                    )}
                    <img src={p.image} alt={p.name} loading="lazy" />
                    <span
                      className="tp-prod-quickadd"
                      onClick={e => { e.preventDefault(); addItem({ product_id: p.id, name: p.name, slug: p.slug, image: p.image, price: p.price_sale || p.price }) }}
                    ><i className="bi bi-plus-lg" /></span>
                  </div>
                  <div className="tp-prod-info">
                    <div className="tp-prod-cat">{p.category_name}</div>
                    <div className="tp-prod-name">{p.name}</div>
                    <div className="tp-prod-footer">
                      <div className="tp-prod-price">
                        <span className="tp-price-now">{fmt(p.price_sale || p.price)}</span>
                        {p.unit && <span className="tp-price-unit">/{p.unit}</span>}
                      </div>
                      <div className="tp-prod-rating"><i className="bi bi-star-fill" /> {p.rating.toFixed(1)}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ALTERNATING-STRIPS — Câu chuyện nông trại */}
      <section className="tp-sec tp-features-bg">
        <div className="tp-container">
          <div className="tp-story-row" data-reveal>
            <div className="tp-story-img">
              <img src={settings.story1_image} alt={settings.story1_title_strong} loading="lazy" />
            </div>
            <div>
              <div className="tp-story-badge">{settings.story1_badge}</div>
              <h3 className="tp-story-title"><em>{settings.story1_title_strong}</em> {settings.story1_title_post}</h3>
              <p className="tp-story-text">{settings.story1_text}</p>
              <ul className="tp-story-list">
                {[settings.story1_list1, settings.story1_list2, settings.story1_list3].filter(Boolean).map((l, i) => (
                  <li key={i}><i className="bi bi-check-circle-fill" /> {l}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="tp-story-row tp-reverse" data-reveal>
            <div className="tp-story-img">
              <img src={settings.story2_image} alt={settings.story2_title_strong} loading="lazy" />
            </div>
            <div>
              <div className="tp-story-badge">{settings.story2_badge}</div>
              <h3 className="tp-story-title"><em>{settings.story2_title_strong}</em> {settings.story2_title_post}</h3>
              <p className="tp-story-text">{settings.story2_text}</p>
              <ul className="tp-story-list">
                {[settings.story2_list1, settings.story2_list2, settings.story2_list3].filter(Boolean).map((l, i) => (
                  <li key={i}><i className="bi bi-check-circle-fill" /> {l}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* STAT-BAR */}
      <section className="tp-stats" aria-label="Số liệu">
        <div className="tp-container">
          <div className="tp-stats-grid" data-reveal>
            {stats.map((s, i) => (
              <div className="tp-stat" key={i}>
                <div className="tp-stat-num"><span>{Number(s.num).toLocaleString('vi-VN')}{s.suffix}</span></div>
                <div className="tp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS — HORIZONTAL-SCROLL */}
      {reviews.length > 0 && (
        <section className="tp-sec tp-features-bg">
          <div className="tp-container">
            <div className="tp-sec-header tp-center" data-reveal>
              <div className="tp-eyebrow"><i className="bi bi-chat-heart" /> Khách hàng nói gì</div>
              <h2 className="tp-sec-title">Được <em>tin dùng</em> mỗi ngày</h2>
            </div>
            <div className="tp-testi-track" data-reveal>
              {reviews.map((r, i) => (
                <div className="tp-testi-card" key={i}>
                  <div className="tp-testi-stars">
                    {Array.from({ length: 5 }, (_, s) => (
                      <i key={s} className={`bi ${s < r.rating ? 'bi-star-fill' : 'bi-star'}`} />
                    ))}
                  </div>
                  <p className="tp-testi-text">&quot;{r.content}&quot;</p>
                  <div className="tp-testi-author">
                    <div className="tp-testi-avatar">{r.name.charAt(0)}</div>
                    <div><div className="tp-testi-name">{r.name}</div><div className="tp-testi-role">{r.location}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="tp-newsletter">
        <div className="tp-container">
          <div className="tp-newsletter-inner" data-reveal>
            <h2 className="tp-sec-title">{settings.newsletter_title || 'Nhận ưu đãi & tin nông sản mới'}</h2>
            <p className="tp-sec-sub" style={{ marginLeft: 'auto', marginRight: 'auto' }}>{settings.newsletter_desc || 'Đăng ký để nhận mã giảm giá 10.000đ cho đơn hàng đầu tiên.'}</p>
            <form className="tp-newsletter-form" onSubmit={e => e.preventDefault()} noValidate>
              <input type="email" placeholder="Email của bạn" required aria-label="Email" />
              <button type="submit">Đăng ký</button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
