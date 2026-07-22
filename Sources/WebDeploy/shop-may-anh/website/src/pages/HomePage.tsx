import { Link } from 'react-router-dom'
import HeroSlider from '../components/HeroSlider'
import StatCounter from '../components/StatCounter'
import { useCart } from '../contexts/CartContext'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

function fmt(n: number) {
  return n.toLocaleString('vi-VN') + 'đ'
}

const TRUST_ITEMS = [
  { icon: 'patch-check', text: 'Hàng chính hãng 100%' },
  { icon: 'shield-check', text: 'Bảo hành 24 tháng' },
  { icon: 'arrow-counterclockwise', text: 'Đổi trả 7 ngày' },
  { icon: 'credit-card', text: 'Trả góp 0%' },
  { icon: 'truck', text: 'Giao hàng toàn quốc' },
]

const TIMELINE = [
  { step: 'Bước 1', title: 'Tư vấn nhu cầu chụp', desc: 'Chia sẻ phong cách chụp (chân dung, phong cảnh, sự kiện, vlog) để được gợi ý combo thân máy + ống kính phù hợp.' },
  { step: 'Bước 2', title: 'Kiểm tra máy trước khi giao', desc: 'Mỗi thân máy được test cảm biến, autofocus, màn trập trước khi đóng gói — kèm phiếu kiểm định.' },
  { step: 'Bước 3', title: 'Giao hàng & kích hoạt bảo hành', desc: 'Giao hàng toàn quốc, kích hoạt bảo hành điện tử ngay khi nhận máy — tra cứu online mọi lúc.' },
  { step: 'Bước 4', title: 'Hỗ trợ trọn đời sản phẩm', desc: 'Vệ sinh cảm biến miễn phí định kỳ, ưu tiên đặt lịch sửa chữa cho khách hàng đã mua tại cửa hàng.' },
]

export default function HomePage() {
  useDocumentMeta({
    title: 'PhotoPro — Máy Ảnh & Thiết Bị Nhiếp Ảnh Chính Hãng',
    description: 'Cửa hàng máy ảnh & thiết bị nhiếp ảnh chính hãng — thân máy mirrorless/DSLR, ống kính, tripod, phụ kiện — bảo hành chính hãng, tư vấn kỹ thuật chuyên sâu.',
  })

  const { settings, products, categories } = useSite()
  const { addItem } = useCart()
  const val = (k: string, fallback = '') => settings[k] || fallback

  const featured = products.filter(p => p.is_featured).slice(0, 5)

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
    role: val(`review${i}_role`),
    content: val(`review${i}_content`),
    rating: Number(val(`review${i}_rating`)) || 5,
  })).filter(r => r.name)

  const stories = [1, 2].map(i => ({
    badge: val(`story${i}_badge`),
    titlePre: val(`story${i}_title_pre`),
    titleEm: val(`story${i}_title_em`),
    text: val(`story${i}_text`),
    image: val(`story${i}_image`),
    items: [val(`story${i}_li1`), val(`story${i}_li2`), val(`story${i}_li3`)].filter(Boolean),
  })).filter(s => s.titlePre || s.text)

  return (
    <>
      <HeroSlider />

      {/* Trust strip */}
      <section className="ma-trust" aria-label="Cam kết">
        <div className="ma-container">
          <div className="ma-trust-row" data-reveal>
            {TRUST_ITEMS.map(t => (
              <div className="ma-trust-item" key={t.text}><i className={`bi bi-${t.icon}`} /> {t.text}</div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE-ICON-ROW — Dịch vụ */}
      {values.length > 0 && (
        <section className="ma-sec">
          <div className="ma-container">
            <div className="ma-sec-header ma-center" data-reveal>
              <div className="ma-eyebrow"><i className="bi bi-tools" /> Dịch vụ hậu mãi</div>
              <h2 className="ma-sec-title">Đồng hành cùng <em>người cầm máy</em></h2>
              <p className="ma-sec-sub">Từ tư vấn chọn máy đến bảo hành, sửa chữa — đội ngũ kỹ thuật viên chuyên sâu luôn sẵn sàng hỗ trợ.</p>
            </div>
            <div className="ma-feature-grid">
              {values.map((v, i) => (
                <div className="ma-feature" data-reveal data-delay={String(i + 1)} key={v.title}>
                  <div className="ma-feature-icon"><i className={`bi bi-${v.icon}`} /></div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GRID-CARDS — Danh mục */}
      <section className="ma-sec ma-sec-alt">
        <div className="ma-container">
          <div className="ma-sec-header ma-split" data-reveal>
            <div>
              <div className="ma-eyebrow"><i className="bi bi-grid" /> Danh mục</div>
              <h2 className="ma-sec-title">Trang bị theo <em>phong cách chụp</em></h2>
            </div>
            <Link to="/san-pham" className="ma-btn ma-btn-ghost">Xem tất cả <i className="bi bi-arrow-right" /></Link>
          </div>
          <div className="ma-cat-grid">
            {categories.map((c, i) => (
              <Link to={`/san-pham?cat=${c.slug}`} className="ma-cat-card" data-reveal data-delay={String((i % 5) + 1)} key={c.id}>
                <img src={c.image} alt={c.name} loading="lazy" />
                <div className="ma-cat-overlay" />
                <div className="ma-cat-info"><h3>{c.name}</h3><span>{c.product_count} sản phẩm</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE — Quy trình mua hàng */}
      <section id="quy-trinh" className="ma-sec">
        <div className="ma-container">
          <div className="ma-sec-header ma-center" data-reveal>
            <div className="ma-eyebrow"><i className="bi bi-signpost-split" /> Quy trình</div>
            <h2 className="ma-sec-title">Mua máy <em>đơn giản, minh bạch</em></h2>
            <p className="ma-sec-sub">4 bước để sở hữu thiết bị đúng nhu cầu, không phát sinh chi phí ẩn.</p>
          </div>
          <div className="ma-timeline">
            {TIMELINE.map((t, i) => (
              <div className="ma-timeline-item" data-reveal data-delay={String(i + 1)} key={t.step}>
                <div className="ma-timeline-dot">{i + 1}</div>
                <div className="ma-timeline-content">
                  <div className="ma-timeline-step">{t.step}</div>
                  <h3>{t.title}</h3>
                  <p>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENTO-GRID — Sản phẩm nổi bật */}
      {featured.length > 0 && (
        <section className="ma-sec ma-sec-alt">
          <div className="ma-container">
            <div className="ma-sec-header ma-split" data-reveal>
              <div>
                <div className="ma-eyebrow"><i className="bi bi-star" /> Bán chạy</div>
                <h2 className="ma-sec-title">Thiết bị <em>được săn đón</em></h2>
              </div>
              <Link to="/san-pham" className="ma-btn ma-btn-ghost">Xem tất cả <i className="bi bi-arrow-right" /></Link>
            </div>
            <div className="ma-bento">
              {featured.map((p, i) => (
                <Link
                  to={`/san-pham/${p.slug}`}
                  className={'ma-prod-card ' + (i === 0 ? 'ma-bento-large' : 'ma-bento-small')}
                  data-reveal data-delay={String(i + 1)}
                  key={p.id}
                >
                  <div className="ma-prod-thumb">
                    {p.badge && <span className={'ma-prod-badge ' + (p.price_sale ? 'ma-prod-badge-sale' : p.is_new ? 'ma-prod-badge-new' : 'ma-prod-badge-hot')}>{p.badge}</span>}
                    <img src={p.image} alt={p.name} loading="lazy" />
                    <span
                      className="ma-prod-quickadd"
                      role="button"
                      tabIndex={0}
                      aria-label="Thêm nhanh vào giỏ"
                      onClick={e => { e.preventDefault(); addItem({ product_id: p.id, name: p.name, slug: p.slug, image: p.image, price: p.price_sale || p.price }) }}
                    ><i className="bi bi-plus-lg" /></span>
                  </div>
                  <div className="ma-prod-info">
                    <div className="ma-prod-cat">{p.category_name}</div>
                    <div className="ma-prod-name">{p.name}</div>
                    <div className="ma-prod-footer">
                      <div className="ma-prod-price">
                        <span className="ma-price-now">{fmt(p.price_sale || p.price)}</span>
                        {!!p.price_sale && <span className="ma-price-old">{fmt(p.price)}</span>}
                      </div>
                      {p.rating > 0 && <div className="ma-prod-rating"><i className="bi bi-star-fill" /> {p.rating}</div>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ALTERNATING-STRIPS — Câu chuyện cửa hàng */}
      <section className="ma-sec">
        <div className="ma-container">
          {stories.map((s, i) => (
            <div className={'ma-story-row' + (i === 1 ? ' ma-reverse' : '')} data-reveal key={i}>
              <div className="ma-story-img">
                <img src={s.image} alt={s.badge} loading="lazy" />
              </div>
              <div>
                <div className="ma-story-badge">{s.badge}</div>
                <h3 className="ma-story-title">{s.titlePre} <em>{s.titleEm}</em></h3>
                <p className="ma-story-text">{s.text}</p>
                <ul className="ma-story-list">
                  {s.items.map(li => <li key={li}><i className="bi bi-check-circle-fill" /> {li}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STAT-BAR */}
      {stats.length > 0 && (
        <section className="ma-stats" aria-label="Số liệu">
          <div className="ma-container">
            <div className="ma-stats-grid" data-reveal>
              {stats.map(s => <StatCounter key={s.label} target={s.num} suffix={s.suffix} label={s.label} />)}
            </div>
          </div>
        </section>
      )}

      {/* HORIZONTAL-SCROLL — Đánh giá khách hàng */}
      {reviews.length > 0 && (
        <section className="ma-sec ma-sec-alt">
          <div className="ma-container">
            <div className="ma-sec-header ma-center" data-reveal>
              <div className="ma-eyebrow"><i className="bi bi-chat-heart" /> Khách hàng nói gì</div>
              <h2 className="ma-sec-title">Được <em>tin tưởng</em> bởi người cầm máy</h2>
            </div>
            <div className="ma-testi-track" data-reveal>
              {reviews.map(r => (
                <div className="ma-testi-card" key={r.name}>
                  <div className="ma-testi-stars">
                    {Array.from({ length: 5 }).map((_, idx) => <i key={idx} className={idx < r.rating ? 'bi bi-star-fill' : 'bi bi-star'} />)}
                  </div>
                  <p className="ma-testi-text">"{r.content}"</p>
                  <div className="ma-testi-author">
                    <div className="ma-testi-avatar">{r.name.charAt(0)}</div>
                    <div><div className="ma-testi-name">{r.name}</div><div className="ma-testi-role">{r.role}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="ma-newsletter">
        <div className="ma-container">
          <div className="ma-newsletter-inner" data-reveal>
            <h2 className="ma-sec-title">{val('newsletter_title', 'Nhận tin khuyến mãi & hàng mới về')}</h2>
            <p className="ma-sec-sub">{val('newsletter_desc', 'Đăng ký để nhận mã giảm 500.000đ cho đơn hàng thân máy đầu tiên.')}</p>
            <form className="ma-newsletter-form" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Email của bạn" required aria-label="Email" />
              <button type="submit">Đăng ký</button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
