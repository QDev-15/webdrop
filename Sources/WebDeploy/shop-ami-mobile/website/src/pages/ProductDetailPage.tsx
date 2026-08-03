import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useSite, type Product } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { fmt, stars, CATEGORY_LABEL } from '../lib/format'
import { showCartToast } from '../lib/toast'
import { getPhoneSpecs, SPEC_TABS, SPEC_TAB_LABEL, type SpecTabKey } from '../lib/phoneSpecs'
import ProductCard from '../components/ProductCard'

const CART_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
)

function pickRelated(current: Product, pool: Product[], count: number): Product[] {
  const others = pool.filter(p => p.id !== current.id)
  const result: Product[] = others.filter(p => p.category_slug === current.category_slug).slice(0, count)
  const used = new Set(result.map(p => p.id))
  if (result.length < count) {
    others.filter(p => p.brand === current.brand && !used.has(p.id)).forEach(p => {
      if (result.length < count) { result.push(p); used.add(p.id) }
    })
  }
  if (result.length < count) {
    [...others].filter(p => !used.has(p.id)).sort((a, b) => b.sold - a.sold).forEach(p => {
      if (result.length < count) { result.push(p); used.add(p.id) }
    })
  }
  return result
}

export default function ProductDetailPage() {
  const { slug } = useParams()
  const { products, settings } = useSite()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [activeTab, setActiveTab] = useState<SpecTabKey>('manHinh')
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    if (!slug) return
    setProduct(null)
    setNotFound(false)
    setActiveImg(0)
    api.get<Product>(`/public/products/${slug}`)
      .then(setProduct)
      .catch(() => setNotFound(true))
  }, [slug])

  useDocumentMeta({
    title: product ? `${product.name} — ${settings.site_name || 'AMI Mobile'}` : `Chi tiết sản phẩm — ${settings.site_name || 'AMI Mobile'}`,
    description: product ? product.description.slice(0, 155) : undefined,
  })

  const related = useMemo(() => (product ? pickRelated(product, products, 8) : []), [product, products])

  if (notFound) {
    return (
      <div className="mb-container" style={{ padding: '120px 0', textAlign: 'center' }}>
        <h1 style={{ marginBottom: 12 }}>Không tìm thấy sản phẩm</h1>
        <Link to="/san-pham" className="mb-btn">Về trang sản phẩm</Link>
      </div>
    )
  }

  if (!product) {
    return <div className="mb-container" style={{ padding: '120px 0', textAlign: 'center', color: 'var(--text-2)' }}>Đang tải...</div>
  }

  const effectivePrice = product.price_sale ?? product.price
  const isPhone = product.category_slug === 'dien-thoai'
  const specs = isPhone ? getPhoneSpecs(product.name) : null

  const galleryExtra: string[] = (() => {
    if (!product.gallery?.trim()) return []
    try {
      const parsed = JSON.parse(product.gallery)
      return Array.isArray(parsed) ? (parsed as unknown[]).filter((x): x is string => typeof x === 'string' && x.trim() !== '') : []
    } catch { return [] }
  })()
  const images = [product.image || '', ...galleryExtra].filter(Boolean)

  const handleAddToCart = () => {
    addItem({ product_id: product.id, name: product.name, slug: product.slug, image: product.image, price: effectivePrice })
    showCartToast(`Đã thêm "${product.name}" vào giỏ hàng`)
  }

  return (
    <>
      <div className="mb-page-hero is-slim">
        <div className="mb-container">
          <div className="mb-breadcrumb">
            <Link to="/">Trang chủ</Link><span>/</span>
            <Link to="/san-pham">Sản phẩm</Link><span>/</span>
            <span>{product.name}</span>
          </div>
        </div>
      </div>

      <section className="mb-sec" style={{ paddingTop: 40, paddingBottom: 0 }}>
        <div className="mb-container">
          <div className="row g-4 g-lg-5">
            <div className="col-lg-6">
              <div className="mb-detail-img">
                <img src={images[activeImg] || product.image} alt={product.name} />
              </div>
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                  {images.map((url, i) => (
                    <button key={i} type="button" onClick={() => setActiveImg(i)}
                      style={{
                        width: 64, height: 64, padding: 0, cursor: 'pointer', flexShrink: 0,
                        border: i === activeImg ? '2px solid var(--mustard, var(--accent))' : '2px solid var(--border)',
                        borderRadius: 8, overflow: 'hidden', background: 'var(--warm, #f5f5f5)',
                        transition: 'border-color .15s',
                      }}
                      aria-label={`Ảnh ${i + 1}`}
                    >
                      <img src={url} alt={`Ảnh ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="col-lg-6">
              <div className="mb-detail-info">
                <span className="mb-detail-brand">{product.brand.toUpperCase()}</span>
                <h1 className="mb-detail-name">{product.name}</h1>
                <div className="mb-detail-rating">
                  <span style={{ color: 'var(--mustard)' }}>{stars(product.rating)}</span>
                  <span style={{ color: 'var(--text-2)', fontSize: 14, marginLeft: 6 }}>{product.rating}/5 · Đã bán {product.sold}</span>
                </div>
                <div className="mb-detail-price-row">
                  <span className="mb-detail-price">{fmt(effectivePrice)}</span>
                  {product.price_sale != null && (
                    <>
                      <span className="mb-detail-price-was">{fmt(product.price)}</span>
                      <span className="mb-detail-badge-sale">-{Math.round((1 - product.price_sale / product.price) * 100)}%</span>
                    </>
                  )}
                </div>
                <div className="mb-promo-box">
                  <div className="mb-promo-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20.59 13.41L11 3.83A2 2 0 009.59 3.24H4a1 1 0 00-1 1v5.59a2 2 0 00.59 1.41l9.58 9.58a2 2 0 002.82 0l4.6-4.6a2 2 0 000-2.82z" /><circle cx="7.5" cy="7.5" r="1.5" /></svg>
                    Ưu đãi khi mua hàng
                  </div>
                  <ul>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg> Giảm thêm 300.000đ khi thanh toán qua VNPay hoặc Momo</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C9 2 12 7 12 7z" /></svg> Tặng kèm ốp lưng + cường lực trị giá 390.000đ</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg> Trả góp 0% lãi suất qua thẻ tín dụng, duyệt hồ sơ trong 5 phút</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg> Miễn phí giao hàng toàn quốc, nội thành nhận trong 24h</li>
                  </ul>
                </div>
                <div className="mb-detail-meta">
                  <span className="mb-detail-meta-item">Màu: <strong>{product.colors}</strong></span>
                  <span className="mb-detail-meta-item">Tình trạng: <strong>{product.in_stock ? 'Còn hàng' : 'Hết hàng'}</strong></span>
                </div>
                <p className="mb-detail-desc">{product.description}</p>
                <div className="mb-detail-actions">
                  <button className="mb-btn mb-btn-primary" onClick={handleAddToCart}>{CART_ICON} Thêm vào giỏ</button>
                  <Link to="/lien-he" className="mb-btn mb-btn-outline">Tư vấn ngay</Link>
                </div>
                <div className="mb-detail-badges">
                  <span className="mb-badge-item">✓ Hàng chính hãng</span>
                  <span className="mb-badge-item">✓ Bảo hành {settings.warranty_months || '12'} tháng</span>
                  <span className="mb-badge-item">✓ Giao hàng toàn quốc</span>
                  <span className="mb-badge-item">✓ Đổi trả {settings.return_days || '7'} ngày</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-sec" style={{ paddingTop: 48, paddingBottom: 56 }}>
        <div className="mb-container">
          <div className="mb-label" data-reveal>{isPhone ? 'Chi tiết cấu hình' : 'Thông tin sản phẩm'}</div>
          <h2 className="mb-sec-title" data-reveal>{isPhone ? <>Thông số <em>kỹ thuật</em></> : <>Thông tin <em>chi tiết</em></>}</h2>
          <div className="mb-specs-tabs" data-reveal>
            {isPhone && specs ? (
              <>
                <div className="mb-specs-tabbar" role="tablist">
                  {SPEC_TABS.map(k => (
                    <button key={k} type="button" className={'mb-specs-tab' + (activeTab === k ? ' active' : '')} onClick={() => setActiveTab(k)} role="tab">
                      {SPEC_TAB_LABEL[k]}
                    </button>
                  ))}
                </div>
                {SPEC_TABS.map(k => (
                  <table key={k} className={'mb-specs-table' + (activeTab === k ? ' active' : '')}>
                    <tbody>
                      {specs[k].map(([label, val]) => (
                        <tr key={label}><th>{label}</th><td>{val}</td></tr>
                      ))}
                    </tbody>
                  </table>
                ))}
              </>
            ) : (
              <table className="mb-specs-table active">
                <tbody>
                  <tr><th>Thương hiệu</th><td>{product.brand.toUpperCase()}</td></tr>
                  <tr><th>Danh mục</th><td>{CATEGORY_LABEL[product.category_slug] || product.category_name}</td></tr>
                  <tr><th>Màu sắc</th><td>{product.colors}</td></tr>
                  <tr><th>Bảo hành</th><td>{settings.warranty_months || '12'} tháng chính hãng</td></tr>
                  <tr><th>Tình trạng</th><td>{product.in_stock ? 'Còn hàng' : 'Hết hàng'}</td></tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mb-sec" style={{ background: 'var(--surface)', padding: '56px 0' }}>
          <div className="mb-container">
            <div className="mb-label" data-reveal>Có thể bạn thích</div>
            <h2 className="mb-sec-title" data-reveal>Sản phẩm <em>liên quan</em></h2>
            <div className="mb-prod-grid">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
