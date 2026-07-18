import { Link } from 'react-router-dom'
import HeroSlider from '../components/HeroSlider'
import { useSite } from '../contexts/SiteContext'

const VALUES_STORY = [
  { num: '01', title: 'Da thuộc Ý cao cấp', desc: 'Nguồn da được chọn lọc kỹ lưỡng từ các xưởng thuộc da uy tín, đảm bảo độ bền và vẻ đẹp tự nhiên theo thời gian.' },
  { num: '02', title: 'Thủ công tinh xảo', desc: 'Mỗi sản phẩm mất trung bình 18 giờ để hoàn thiện bởi nghệ nhân có hơn 10 năm kinh nghiệm.' },
  { num: '03', title: 'Thiết kế vượt thời gian', desc: 'Đường nét tối giản, tinh tế — phù hợp mọi phong cách, không lỗi mốt theo xu hướng nhất thời.' },
  { num: '04', title: 'Bảo hành trọn đời', desc: 'Dịch vụ sửa chữa, bảo dưỡng miễn phí trọn đời sản phẩm — cam kết đồng hành cùng khách hàng.' },
]

const BENTO_CLASS = ['big', 'wide', '', '']

export default function HomePage() {
  const { settings, categories, products } = useSite()

  const featured = products.filter(p => p.is_featured).slice(0, 4)
  const featuredList = featured.length > 0 ? featured : products.slice(0, 4)

  const values = [1, 2, 3, 4].map(i => ({
    icon: settings[`value${i}_icon`] || 'gem',
    title: settings[`value${i}_title`] || '',
    desc: settings[`value${i}_desc`] || '',
  })).filter(v => v.title)

  const reviews = [1, 2, 3, 4].map(i => ({
    name: settings[`review${i}_name`] || '',
    location: settings[`review${i}_location`] || '',
    content: settings[`review${i}_content`] || '',
    rating: Number(settings[`review${i}_rating`] || 5),
  })).filter(r => r.name)

  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'

  return (
    <>
      <HeroSlider />

      {/* ── FEATURE-ICON-ROW — trust badges ──────────────────────────────── */}
      {values.length > 0 && (
        <section className="ts-badges">
          <div className="ts-container">
            <div className="ts-badges-row">
              {values.map((v, i) => {
                const delayProps: Record<string, string> = {}
                if (i === 1) delayProps['data-reveal-d1'] = ''
                if (i === 2) delayProps['data-reveal-d2'] = ''
                if (i === 3) delayProps['data-reveal-d3'] = ''
                return (
                  <div className="ts-badge-item" data-reveal {...delayProps} key={i}>
                    <i className={`bi bi-${v.icon}`} />
                    <div><strong>{v.title}</strong><span>{v.desc}</span></div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── BENTO-GRID — collections ─────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="sec-pad">
          <div className="ts-container">
            <div className="ts-sec-head" data-reveal>
              <div className="ts-eyebrow">Bộ sưu tập</div>
              <h2 className="ts-sec-title">Khám phá theo <em>từng dòng</em> sản phẩm</h2>
            </div>
            <div className="ts-bento">
              {categories.slice(0, 4).map((c, i) => (
                <Link to={`/san-pham?cat=${c.slug}`} className={`ts-bento-item ${BENTO_CLASS[i] || ''}`.trim()} data-reveal key={c.id}>
                  <img src={c.image} alt={c.name} loading="lazy" />
                  <div className="ts-bento-overlay">
                    <span>{i === 0 ? 'Best seller' : i === 1 ? 'Mới về' : 'Danh mục'}</span>
                    <h3>{c.name}</h3>
                    <p>{c.product_count} sản phẩm</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── STAT-BAR ──────────────────────────────────────────────────────── */}
      <section className="ts-stats">
        <div className="ts-container">
          <div className="ts-stats-row">
            {[1, 2, 3, 4].map(i => (
              settings[`stat${i}_label`] && (
                <div className="ts-stat-item" data-reveal key={i}>
                  <div className="num">{settings[`stat${i}_num`]}{settings[`stat${i}_suffix`]}</div>
                  <div className="label">{settings[`stat${i}_label`]}</div>
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* ── GRID-CARDS — featured products ───────────────────────────────── */}
      {featuredList.length > 0 && (
        <section className="sec-pad">
          <div className="ts-container">
            <div className="ts-sec-head center" data-reveal>
              <div className="ts-eyebrow">Sản phẩm nổi bật</div>
              <h2 className="ts-sec-title">Được yêu thích <em>nhất</em></h2>
              <p className="ts-sec-sub">Những mẫu túi bán chạy nhất — chế tác từ da thật, hoàn thiện tỉ mỉ từng đường kim mũi chỉ.</p>
            </div>
            <div className="ts-products-grid">
              {featuredList.map(p => (
                <Link to={`/san-pham/${p.slug}`} className="ts-card" data-reveal key={p.id}>
                  <div className="ts-card-media">
                    {p.badge && <span className={`ts-card-tag${p.price_sale ? ' sale' : ''}`}>{p.badge}</span>}
                    <button
                      type="button"
                      className="ts-card-wish"
                      aria-label="Thêm vào yêu thích"
                      onClick={e => { e.preventDefault() }}
                    ><i className="bi bi-heart" /></button>
                    <img src={p.image} alt={p.name} loading="lazy" />
                  </div>
                  <span className="ts-card-cat">{p.category_name}</span>
                  <h3 className="ts-card-name">{p.name}</h3>
                  <div className="ts-card-price">
                    {fmt(p.price_sale || p.price)}
                    {!!p.price_sale && <del>{fmt(p.price)}</del>}
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-5" data-reveal>
              <Link to="/san-pham" className="ts-link-arrow">Xem tất cả sản phẩm <i className="bi bi-arrow-right" /></Link>
            </div>
          </div>
        </section>
      )}

      {/* ── FULL-BLEED promo ─────────────────────────────────────────────── */}
      {settings.promo_title && (
        <section className="ts-promo" data-reveal>
          <img src={settings.promo_image} alt="Khuyến mãi đặc biệt" loading="lazy" />
          <div className="ts-promo-content">
            <div className="ts-eyebrow">{settings.promo_label}</div>
            <h2>{settings.promo_title} <em>{settings.promo_percent}</em> cho bộ sưu tập mới</h2>
            <p>{settings.promo_desc}</p>
            <Link to="/san-pham" className="ts-btn solid">Mua ngay</Link>
          </div>
        </section>
      )}

      {/* ── LIST-ELEGANT — câu chuyện thương hiệu ────────────────────────── */}
      <section className="sec-pad">
        <div className="ts-container">
          <div className="ts-values-row">
            <div>
              <div className="ts-eyebrow" data-reveal>Câu chuyện thương hiệu</div>
              <h2 className="ts-sec-title" data-reveal>Cam kết <em>chất lượng</em> trong từng chi tiết</h2>
              <ul className="ts-values-list">
                {VALUES_STORY.map(v => (
                  <li data-reveal key={v.num}>
                    <span className="ts-values-num">{v.num}</span>
                    <div className="ts-values-body">
                      <h3>{v.title}</h3>
                      <p>{v.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="ts-values-media" data-reveal>
              <img src="https://images.unsplash.com/photo-1591084728795-1149f32d9866?w=700&auto=format&fit=crop&q=80" alt="Nghệ nhân đang cắt và may da thủ công trong xưởng" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* ── HORIZONTAL-SCROLL — testimonials ─────────────────────────────── */}
      {reviews.length > 0 && (
        <section className="sec-pad" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="ts-container">
            <div className="ts-sec-head" data-reveal>
              <div className="ts-eyebrow">Khách hàng nói gì</div>
              <h2 className="ts-sec-title">Những trải nghiệm <em>đáng nhớ</em></h2>
            </div>
            <div className="ts-testi-scroll" data-reveal>
              {reviews.map((r, i) => (
                <div className="ts-testi-card" key={i}>
                  <div className="ts-testi-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                  <p>&ldquo;{r.content}&rdquo;</p>
                  <div className="ts-testi-person">
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>{r.name.charAt(0)}</div>
                    <div><strong>{r.name}</strong><span>{r.location}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── NEWSLETTER ────────────────────────────────────────────────────── */}
      <section className="ts-newsletter" data-reveal>
        <div className="ts-container">
          <h2>Đăng ký nhận <em style={{ color: 'var(--accent)' }}>ưu đãi riêng</em></h2>
          <p>{settings.newsletter_desc || 'Nhận thông tin bộ sưu tập mới và ưu đãi độc quyền dành cho thành viên.'}</p>
          <form className="ts-newsletter-form" onSubmit={e => e.preventDefault()} noValidate>
            <label htmlFor="ts-newsletter-email" className="visually-hidden">Địa chỉ email</label>
            <input type="email" id="ts-newsletter-email" placeholder="Nhập email của bạn" required />
            <button type="submit">Đăng ký</button>
          </form>
        </div>
      </section>
    </>
  )
}
