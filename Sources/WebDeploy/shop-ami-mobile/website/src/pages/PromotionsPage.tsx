import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import ProductCard from '../components/ProductCard'

export default function PromotionsPage() {
  const { settings, products } = useSite()
  useDocumentMeta({
    title: `Khuyến mãi — ${settings.site_name || 'AMI Mobile'}`,
    description: `Các chương trình khuyến mãi, ưu đãi hot nhất tại ${settings.site_name || 'AMI Mobile'} — giảm giá điện thoại, tai nghe, phụ kiện.`,
  })

  const saleProducts = useMemo(() => products.filter(p => p.theme.split(',').includes('giam-gia')).slice(0, 8), [products])
  const newProducts = useMemo(() => products.filter(p => p.theme.split(',').includes('moi-ve')).slice(0, 4), [products])

  const promoCards = [1, 2, 3].map(i => ({
    icon: settings[`promo_card${i}_icon`],
    title: settings[`promo_card${i}_title`],
    desc: settings[`promo_card${i}_desc`],
  })).filter(c => c.title)

  return (
    <>
      <div className="mb-page-hero">
        <div className="mb-container">
          <div className="mb-breadcrumb">
            <Link to="/">Trang chủ</Link><span>/</span><span>Khuyến mãi</span>
          </div>
          <div className="mb-label mb-page-hero-label">Ưu đãi</div>
          <h1>Khuyến mãi <em>đặc biệt</em></h1>
          <p>Ưu đãi có thời hạn — đặt hàng ngay trước khi hết</p>
        </div>
      </div>

      <section className="mb-sec" style={{ paddingTop: 48 }}>
        <div className="mb-container">
          <div className="mb-promo-hero" data-reveal>
            <div className="mb-promo-hero-text">
              <span className="mb-label" style={{ color: 'var(--mustard)' }}>Flash Sale</span>
              <h2>GIẢM ĐẾN <em>{settings.promo_percent || '30'}%</em><br />ĐIỆN THOẠI CHÍNH HÃNG</h2>
              <p>{settings.promo_desc || 'Áp dụng cho nhiều mẫu điện thoại chính hãng. Số lượng có hạn!'}</p>
              <Link to="/san-pham?sort=price-asc" className="mb-btn">Mua ngay</Link>
            </div>
            <div className="mb-promo-hero-badge">
              <div className="mb-promo-circle">
                <span className="mb-promo-pct">{settings.promo_percent || '30'}%</span>
                <span className="mb-promo-off">OFF</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {saleProducts.length > 0 && (
        <section className="mb-sec" style={{ paddingBottom: 72 }}>
          <div className="mb-container">
            <div className="mb-label" data-reveal>Đang giảm giá</div>
            <h2 className="mb-sec-title" data-reveal>Sản phẩm <em>ưu đãi</em></h2>
            <div className="mb-prod-grid">
              {saleProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            <div style={{ textAlign: 'center', marginTop: 32 }} data-reveal>
              <Link to="/san-pham?theme=giam-gia" className="mb-btn mb-btn-outline">Xem tất cả ưu đãi →</Link>
            </div>
          </div>
        </section>
      )}

      {promoCards.length > 0 && (
        <section className="mb-sec" style={{ background: 'var(--surface)', padding: '56px 0' }}>
          <div className="mb-container">
            <div className="mb-label" data-reveal>Chính sách</div>
            <h2 className="mb-sec-title" data-reveal>Ưu đãi <em>thêm</em> khi mua</h2>
            <div className="row g-4 mt-2">
              {promoCards.map((c, i) => (
                <div className="col-md-4" data-reveal key={i}>
                  <div className="mb-promo-card">
                    <div className="mb-promo-icon">{c.icon}</div>
                    <h3>{c.title}</h3>
                    <p>{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {newProducts.length > 0 && (
        <section className="mb-sec" style={{ padding: '56px 0 72px' }}>
          <div className="mb-container">
            <div className="mb-label" data-reveal>Hàng về</div>
            <h2 className="mb-sec-title" data-reveal>Mới về — <em>giá tốt</em></h2>
            <div className="mb-prod-grid">
              {newProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
