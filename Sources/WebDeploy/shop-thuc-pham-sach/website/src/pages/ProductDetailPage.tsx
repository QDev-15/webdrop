import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useSite, type Product } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'

function parseLines(v: string): string[] {
  return v ? v.split('|').filter(Boolean) : []
}

function parseNutrition(v: string): { label: string; value: string }[] {
  return v ? v.split('|').filter(Boolean).map(row => {
    const [label, ...rest] = row.split(':')
    return { label: label?.trim() || '', value: rest.join(':').trim() }
  }) : []
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { products } = useSite()
  const { addItem } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState<'mota' | 'dinhduong' | 'nguongoc' | 'danhgia'>('mota')
  const [activeImg, setActiveImg] = useState(0)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setNotFound(false)
    setActiveImg(0)
    setActiveTab('mota')
    setQty(1)
    api.get<Product>(`/public/products/${slug}`)
      .then(setProduct)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'

  if (loading) {
    return <div style={{ paddingTop: 180, textAlign: 'center', color: 'var(--text-3)', minHeight: '50vh' }}>Đang tải sản phẩm...</div>
  }
  if (notFound || !product) {
    return (
      <div style={{ paddingTop: 180, textAlign: 'center', color: 'var(--text-3)', minHeight: '50vh' }}>
        <p>Không tìm thấy sản phẩm</p>
        <Link to="/san-pham" className="tp-btn tp-btn-ghost" style={{ marginTop: 24, display: 'inline-flex' }}>← Quay lại</Link>
      </div>
    )
  }

  const gallery = [product.image, ...parseLines(product.gallery)].filter(Boolean)
  const certs = parseLines(product.certs)
  const nutrition = parseNutrition(product.nutrition)
  const hasOrigin = Boolean(product.origin_farm || product.harvest_note)
  const related = products.filter(p => p.slug !== slug && p.category_id === product.category_id).slice(0, 4)
  const relatedFallback = products.filter(p => p.slug !== slug).slice(0, 4)
  const relatedItems = related.length > 0 ? related : relatedFallback

  const handleAddToCart = () => {
    addItem({
      product_id: product.id, name: product.name, slug: product.slug, image: product.image,
      price: product.price_sale || product.price,
    }, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/gio-hang')
  }

  return (
    <>
      <div className="tp-container tp-detail-wrap">
        <div className="tp-breadcrumb" style={{ marginBottom: 32 }}>
          <Link to="/">Trang chủ</Link>
          <i className="bi bi-chevron-right" style={{ fontSize: 10 }} />
          <Link to="/san-pham">Sản phẩm</Link>
          <i className="bi bi-chevron-right" style={{ fontSize: 10 }} />
          <span>{product.name}</span>
        </div>

        <div className="tp-detail-grid">
          <div>
            <div className="tp-gallery-main">
              <img src={gallery[activeImg] || product.image} alt={product.name} loading="eager" />
            </div>
            {gallery.length > 1 && (
              <div className="tp-gallery-thumbs">
                {gallery.map((src, i) => (
                  <button key={i} className={`tp-thumb${activeImg === i ? ' tp-active' : ''}`} onClick={() => setActiveImg(i)}>
                    <img src={src} alt={`${product.name} - ảnh ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="tp-detail-info">
            {certs.length > 0 && (
              <div className="tp-detail-badges">
                {certs.map((c, i) => (
                  <span className="tp-detail-badge" key={i}><i className="bi bi-patch-check-fill" /> {c}</span>
                ))}
              </div>
            )}
            <h1 className="tp-detail-name">{product.name}</h1>
            <div className="tp-detail-rating">
              <span className="stars">
                {Array.from({ length: 5 }, (_, s) => (
                  <i key={s} className={`bi ${s < Math.round(product.rating) ? 'bi-star-fill' : 'bi-star'}`} />
                ))}
              </span>
              <span>{product.rating.toFixed(1)} ({Math.max(1, Math.round(product.sold_count / 8))} đánh giá)</span>
              <span>·</span>
              <span>Đã bán {product.sold_count}+</span>
            </div>
            <div className="tp-detail-price">
              <span className="tp-d-price-now">{fmt(product.price_sale || product.price)}</span>
              {!!product.price_sale && <span className="tp-d-price-old">{fmt(product.price)}</span>}
              {product.unit && <span className="tp-d-price-unit">/ {product.unit}</span>}
            </div>
            <p className="tp-detail-desc">{product.description}</p>

            <div className="tp-variant-label">Số lượng</div>
            <div className="tp-qty-add">
              <div className="tp-qty">
                <button aria-label="Giảm số lượng" onClick={() => setQty(v => Math.max(1, v - 1))}>−</button>
                <input type="text" value={qty} readOnly aria-label="Số lượng" />
                <button aria-label="Tăng số lượng" onClick={() => setQty(v => Math.min(99, v + 1))}>+</button>
              </div>
              <button className="tp-btn tp-btn-primary tp-btn-cart-full" disabled={!product.in_stock} onClick={handleAddToCart}>
                <i className={`bi ${added ? 'bi-check-circle-fill' : 'bi-bag-plus'}`} /> {added ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ'}
              </button>
              <button className="tp-btn-wishlist" aria-label="Yêu thích"><i className="bi bi-heart" /></button>
            </div>
            <button className="tp-btn tp-btn-dark tp-btn-full" disabled={!product.in_stock} onClick={handleBuyNow} style={{ marginBottom: 20 }}>
              Mua ngay
            </button>

            <ul className="tp-trust-list">
              <li><i className="bi bi-truck" /> Giao hàng lạnh trong 2–4 giờ tại nội thành</li>
              <li><i className="bi bi-qr-code" /> Quét mã QR để xem nguồn gốc lô hàng</li>
              <li><i className="bi bi-arrow-counterclockwise" /> Hoàn tiền 100% nếu không hài lòng</li>
            </ul>
          </div>
        </div>

        <div className="tp-tabs">
          <div className="tp-tab-nav" role="tablist">
            <button className={`tp-tab-btn${activeTab === 'mota' ? ' tp-active' : ''}`} role="tab" onClick={() => setActiveTab('mota')}>Mô tả sản phẩm</button>
            {nutrition.length > 0 && (
              <button className={`tp-tab-btn${activeTab === 'dinhduong' ? ' tp-active' : ''}`} role="tab" onClick={() => setActiveTab('dinhduong')}>Thông tin dinh dưỡng</button>
            )}
            {hasOrigin && (
              <button className={`tp-tab-btn${activeTab === 'nguongoc' ? ' tp-active' : ''}`} role="tab" onClick={() => setActiveTab('nguongoc')}>Nguồn gốc</button>
            )}
            <button className={`tp-tab-btn${activeTab === 'danhgia' ? ' tp-active' : ''}`} role="tab" onClick={() => setActiveTab('danhgia')}>
              Đánh giá ({Math.max(1, Math.round(product.sold_count / 8))})
            </button>
          </div>

          {activeTab === 'mota' && (
            <div className="tp-tab-panel tp-active">
              <p style={{ color: 'var(--text-2)', lineHeight: 1.8, maxWidth: 760 }}>{product.description}</p>
            </div>
          )}
          {activeTab === 'dinhduong' && nutrition.length > 0 && (
            <div className="tp-tab-panel tp-active">
              <table className="tp-specs-table">
                <tbody>
                  {nutrition.map((row, i) => (
                    <tr key={i}><td>{row.label}</td><td>{row.value}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'nguongoc' && hasOrigin && (
            <div className="tp-tab-panel tp-active">
              <table className="tp-specs-table">
                <tbody>
                  {product.origin_farm && <tr><td>Nông trại</td><td>{product.origin_farm}</td></tr>}
                  {product.harvest_note && <tr><td>Ngày thu hoạch</td><td>{product.harvest_note}</td></tr>}
                  {certs.length > 0 && <tr><td>Chứng nhận</td><td>{certs.join(', ')}</td></tr>}
                  <tr><td>Mã truy xuất</td><td>Quét mã QR trên bao bì sản phẩm</td></tr>
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'danhgia' && (
            <div className="tp-tab-panel tp-active">
              <p style={{ fontSize: 14, color: 'var(--text-2)' }}>
                Đánh giá trung bình {product.rating.toFixed(1)}/5 sao từ khách hàng đã mua sản phẩm này.
              </p>
            </div>
          )}
        </div>
      </div>

      {relatedItems.length > 0 && (
        <section className="tp-related" aria-label="Sản phẩm liên quan">
          <div className="tp-container">
            <div className="tp-sec-header" data-reveal>
              <div className="tp-eyebrow"><i className="bi bi-grid" /> Có thể bạn thích</div>
              <h2 className="tp-sec-title">Sản phẩm <em>liên quan</em></h2>
            </div>
            <div className="tp-related-grid">
              {relatedItems.map(p => (
                <div className="tp-prod-card" data-reveal key={p.id}>
                  <div className="tp-prod-thumb">
                    {p.badge && (
                      <span className={`tp-prod-badge ${p.is_new ? 'tp-prod-badge-new' : p.price_sale ? 'tp-prod-badge-sale' : 'tp-prod-badge-organic'}`}>{p.badge}</span>
                    )}
                    <Link to={`/san-pham/${p.slug}`}><img src={p.image} alt={p.name} loading="lazy" /></Link>
                  </div>
                  <div className="tp-prod-info">
                    <div className="tp-prod-cat">{p.category_name}</div>
                    <Link to={`/san-pham/${p.slug}`} className="tp-prod-name" style={{ display: 'block' }}>{p.name}</Link>
                    <div className="tp-prod-footer"><div className="tp-prod-price"><span className="tp-price-now">{fmt(p.price_sale || p.price)}</span></div></div>
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
