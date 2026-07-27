import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import ProductCard from '../components/ProductCard'

export default function CollectionPage() {
  const { settings, products } = useSite()

  useDocumentMeta({
    title: `Bộ Sưu Tập — ${settings.site_name || 'LUMIÈRE Beauty'}`,
    description: `Khám phá các bộ sưu tập mỹ phẩm chủ đề của ${settings.site_name || 'LUMIÈRE'}: Skincare Routine, Hương thơm đặc quyền, Công cụ làm đẹp chuyên nghiệp.`,
  })

  const col1Products = useMemo(() => products.filter(p => p.category_slug === 'cham-soc-da').slice(0, 4), [products])
  const col2Products = useMemo(() => products.filter(p => p.category_slug === 'nuoc-hoa').slice(0, 4), [products])
  const col3Products = useMemo(() => products.filter(p => p.category_slug === 'dung-cu-lam-dep').slice(0, 4), [products])

  const c2Features = [settings.c2_feature1, settings.c2_feature2, settings.c2_feature3].filter(Boolean)
  const c3Features = [settings.c3_feature1, settings.c3_feature2, settings.c3_feature3].filter(Boolean)

  return (
    <main id="mp-main">
      <section className="mp-page-hero">
        <div className="wd-container">
          <nav aria-label="Breadcrumb">
            <ol className="mp-breadcrumb">
              <li><Link to="/">Trang chủ</Link></li>
              <li><span>Bộ sưu tập</span></li>
            </ol>
          </nav>
          <h1 className="mp-page-hero-title">{settings.coll_hero_title || 'Bộ Sưu Tập'}</h1>
          <p className="mp-page-hero-sub">{settings.coll_hero_sub}</p>
        </div>
      </section>

      {/* Collection 1: Full-bleed banner */}
      <section className="mp-collection-hero" aria-labelledby="mpCol1Title" data-reveal>
        <div className="mp-col-hero-img-wrap">
          <img src={settings.c1_image} alt="Bộ sưu tập Skincare Routine toàn diện" className="mp-col-hero-img" loading="lazy" />
          <div className="mp-col-hero-overlay" aria-hidden="true"></div>
        </div>
        <div className="mp-col-hero-content wd-container">
          <div className="mp-eyebrow" style={{ color: 'rgba(255,255,255,.7)' }}>{settings.c1_label}</div>
          <h2 id="mpCol1Title" className="mp-col-hero-title">{settings.c1_title1}<br /><em>{settings.c1_title2}</em></h2>
          <p className="mp-col-hero-desc">{settings.c1_desc}</p>
          <Link to={settings.c1_link || '/san-pham?category=cham-soc-da'} className="mp-btn mp-btn-white">{settings.c1_link_label || 'Xem bộ sưu tập →'}</Link>
        </div>
      </section>

      <section className="mp-home-section" aria-labelledby="mpCol1ProdsTitle" data-reveal>
        <div className="wd-container">
          <div className="mp-sec-header">
            <div className="mp-sec-header-left">
              <h2 id="mpCol1ProdsTitle" className="mp-sec-title">Sản Phẩm Trong Bộ Sưu Tập</h2>
            </div>
            <Link to="/san-pham?category=cham-soc-da" className="mp-sec-viewall">Xem tất cả →</Link>
          </div>
          <div className="mp-grid" role="list">
            {col1Products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Collection 2: Alternating strip (reversed) */}
      <section className="mp-col-strip" aria-labelledby="mpCol2Title" data-reveal>
        <div className="wd-container">
          <div className="mp-col-strip-inner mp-col-strip-inner--reverse">
            <div className="mp-col-strip-img-wrap">
              <img src={settings.c2_image} alt="Bộ sưu tập hương thơm đặc quyền" className="mp-col-strip-img" loading="lazy" />
            </div>
            <div className="mp-col-strip-content">
              <div className="mp-eyebrow">{settings.c2_label}</div>
              <h2 id="mpCol2Title" className="mp-sec-title">{settings.c2_title1}<br /><em>{settings.c2_title2}</em></h2>
              <p className="mp-col-strip-desc">{settings.c2_desc}</p>
              <ul className="mp-col-strip-features">
                {c2Features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
              <Link to={settings.c2_link || '/san-pham?category=nuoc-hoa'} className="mp-btn mp-btn-accent">{settings.c2_link_label || 'Khám phá ngay →'}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mp-home-section mp-home-section--alt" aria-labelledby="mpCol2ProdsTitle" data-reveal>
        <div className="wd-container">
          <div className="mp-sec-header">
            <div className="mp-sec-header-left">
              <h2 id="mpCol2ProdsTitle" className="mp-sec-title">Nước Hoa Nổi Bật</h2>
            </div>
            <Link to="/san-pham?category=nuoc-hoa" className="mp-sec-viewall">Xem tất cả →</Link>
          </div>
          <div className="mp-grid" role="list">
            {col2Products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Collection 3: Alternating strip (normal) */}
      <section className="mp-col-strip" aria-labelledby="mpCol3Title" data-reveal>
        <div className="wd-container">
          <div className="mp-col-strip-inner">
            <div className="mp-col-strip-img-wrap">
              <img src={settings.c3_image} alt="Bộ sưu tập dụng cụ làm đẹp chuyên nghiệp" className="mp-col-strip-img" loading="lazy" />
            </div>
            <div className="mp-col-strip-content">
              <div className="mp-eyebrow">{settings.c3_label}</div>
              <h2 id="mpCol3Title" className="mp-sec-title">{settings.c3_title1}<br /><em>{settings.c3_title2}</em></h2>
              <p className="mp-col-strip-desc">{settings.c3_desc}</p>
              <ul className="mp-col-strip-features">
                {c3Features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
              <Link to={settings.c3_link || '/san-pham?category=dung-cu-lam-dep'} className="mp-btn mp-btn-accent">{settings.c3_link_label || 'Khám phá ngay →'}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mp-home-section" aria-labelledby="mpCol3ProdsTitle" data-reveal>
        <div className="wd-container">
          <div className="mp-sec-header">
            <div className="mp-sec-header-left">
              <h2 id="mpCol3ProdsTitle" className="mp-sec-title">Dụng Cụ Nổi Bật</h2>
            </div>
            <Link to="/san-pham?category=dung-cu-lam-dep" className="mp-sec-viewall">Xem tất cả →</Link>
          </div>
          <div className="mp-grid" role="list">
            {col3Products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <section className="mp-cta-banner" data-reveal>
        <div className="wd-container">
          <div className="mp-cta-inner">
            <h2 className="mp-cta-title">Chưa tìm được sản phẩm ưng ý?</h2>
            <p className="mp-cta-sub">Xem toàn bộ 36 sản phẩm hoặc liên hệ tư vấn miễn phí với chuyên gia làm đẹp của LUMIÈRE.</p>
            <div className="mp-cta-btns">
              <Link to="/san-pham" className="mp-btn mp-btn-white">Xem tất cả sản phẩm</Link>
              <Link to="/lien-he" className="mp-btn mp-btn-outline-white">Tư vấn miễn phí</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
