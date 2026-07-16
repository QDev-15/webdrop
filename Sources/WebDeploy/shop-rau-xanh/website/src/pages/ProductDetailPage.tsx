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
  const [activeTab, setActiveTab] = useState<'desc' | 'nutrition' | 'review'>('desc')
  const [activeImg, setActiveImg] = useState(0)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setNotFound(false)
    setActiveImg(0)
    setActiveTab('desc')
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
        <Link to="/san-pham" className="rx-btn rx-btn-outline" style={{ marginTop: 24, display: 'inline-flex' }}>← Quay lại</Link>
      </div>
    )
  }

  const gallery = [product.image, ...parseLines(product.gallery)].filter(Boolean)
  const tags = parseLines(product.tags)
  const nutrition = parseNutrition(product.nutrition)
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
    <main>
      <div className="rx-page-header" style={{ paddingBottom: 0 }}>
        <div className="rx-container">
          <nav className="rx-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Trang chủ</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span>
            <Link to="/san-pham">Sản phẩm</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span>
            <span>{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="rx-container">
        <div className="rx-detail-layout">
          <div data-reveal>
            <div className="rx-gallery-main">
              <img src={gallery[activeImg] || product.image} alt={product.name} loading="eager" />
            </div>
            {gallery.length > 1 && (
              <div className="rx-gallery-thumbs">
                {gallery.map((src, i) => (
                  <div key={i} className={`rx-gallery-thumb${activeImg === i ? ' active' : ''}`} onClick={() => setActiveImg(i)}>
                    <img src={src} alt={`${product.name} — ảnh ${i + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div data-reveal data-delay="1">
            <div className="rx-detail-cat">{product.category_name}</div>
            <h1 className="rx-detail-title">{product.name}</h1>
            <div className="rx-detail-rating">
              <span className="rx-stars">
                {Array.from({ length: 5 }, (_, s) => (
                  <i key={s} className={`bi ${s < Math.round(product.rating) ? 'bi-star-fill' : 'bi-star'}`} />
                ))}
              </span>
              <span>{product.rating.toFixed(1)} ({Math.max(1, Math.round(product.sold_count / 8))} đánh giá) · Đã bán {product.sold_count}+</span>
            </div>
            <div className="rx-detail-price">
              <span className="rx-detail-price-new">{fmt(product.price_sale || product.price)}</span>
              {!!product.price_sale && <span className="rx-detail-price-old">{fmt(product.price)}</span>}
            </div>
            <div className="rx-detail-unit">
              {product.unit && <>/{product.unit} &middot; </>}
              {product.in_stock ? `còn ${product.stock_qty} ${product.unit || 'sản phẩm'}` : 'tạm hết hàng'}
            </div>
            <p className="rx-detail-desc">{product.description}</p>

            {tags.length > 0 && (
              <div className="rx-detail-badges">
                {tags.map((t, i) => (
                  <span className="rx-detail-badge" key={i}><i className="bi bi-patch-check-fill" /> {t}</span>
                ))}
              </div>
            )}

            <div className="rx-divider" />

            <div className="rx-option-block">
              <div className="rx-option-label">Số lượng</div>
              <div className="rx-qty-add">
                <div className="rx-qty-selector">
                  <button type="button" onClick={() => setQty(v => Math.max(1, v - 1))} aria-label="Giảm số lượng">−</button>
                  <input type="text" value={qty} readOnly aria-label="Số lượng" />
                  <button type="button" onClick={() => setQty(v => Math.min(99, v + 1))} aria-label="Tăng số lượng">+</button>
                </div>
              </div>
            </div>

            <div className="rx-detail-actions">
              <button type="button" className="rx-btn rx-btn-primary rx-btn-lg" disabled={!product.in_stock} onClick={handleAddToCart}>
                <i className={`bi ${added ? 'bi-check-circle-fill' : 'bi-basket2-fill'}`} /> {added ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ'}
              </button>
              <button type="button" className="rx-btn rx-btn-dark rx-btn-lg" disabled={!product.in_stock} onClick={handleBuyNow}>Mua ngay</button>
              <button type="button" className="rx-btn-wishlist" aria-label="Yêu thích"><i className="bi bi-heart" /></button>
            </div>

            <div className="rx-detail-trust">
              <span className="rx-trust-item"><i className="bi bi-truck" /> Giao trong ngày</span>
              <span className="rx-trust-item"><i className="bi bi-arrow-repeat" /> Đổi trả trong 24h</span>
              <span className="rx-trust-item"><i className="bi bi-shield-lock" /> Thanh toán an toàn</span>
            </div>
          </div>
        </div>

        <div className="rx-tabs">
          <div className="rx-tab-nav" role="tablist">
            <button className={`rx-tab-btn${activeTab === 'desc' ? ' active' : ''}`} role="tab" aria-selected={activeTab === 'desc'} onClick={() => setActiveTab('desc')}>Mô tả</button>
            {nutrition.length > 0 && (
              <button className={`rx-tab-btn${activeTab === 'nutrition' ? ' active' : ''}`} role="tab" aria-selected={activeTab === 'nutrition'} onClick={() => setActiveTab('nutrition')}>Thông tin dinh dưỡng</button>
            )}
            <button className={`rx-tab-btn${activeTab === 'review' ? ' active' : ''}`} role="tab" aria-selected={activeTab === 'review'} onClick={() => setActiveTab('review')}>Đánh giá</button>
          </div>

          {activeTab === 'desc' && (
            <div className="rx-tab-panel active" role="tabpanel">
              <p style={{ maxWidth: 760, color: 'var(--text-2)', lineHeight: 1.85, fontSize: 15 }}>{product.description}</p>
            </div>
          )}
          {activeTab === 'nutrition' && nutrition.length > 0 && (
            <div className="rx-tab-panel active" role="tabpanel">
              <table className="rx-nutri-table">
                <tbody>
                  {nutrition.map((row, i) => (
                    <tr key={i}><td>{row.label}</td><td>{row.value}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'review' && (
            <div className="rx-tab-panel active" role="tabpanel">
              <p style={{ fontSize: 14, color: 'var(--text-2)' }}>
                Đánh giá trung bình {product.rating.toFixed(1)}/5 sao từ khách hàng đã mua sản phẩm này.
              </p>
            </div>
          )}
        </div>
      </div>

      {relatedItems.length > 0 && (
        <section className="rx-related rx-sec" aria-label="Sản phẩm liên quan">
          <div className="rx-container">
            <div className="rx-eyebrow" data-reveal>Có thể bạn cũng thích</div>
            <h2 className="rx-sec-title" data-reveal data-delay="1">{product.category_name} <strong>khác đang có</strong></h2>

            <div className="rx-related-grid">
              {relatedItems.map((p, i) => (
                <div className="rx-prod-card" data-reveal data-delay={String((i % 4) + 1)} key={p.id}>
                  <div className="rx-prod-thumb">
                    <Link to={`/san-pham/${p.slug}`}><img src={p.image} alt={p.name} loading="lazy" /></Link>
                    {p.badge && <div className={`rx-prod-badge${p.is_new ? ' new' : p.price_sale ? ' sale' : ''}`}>{p.badge}</div>}
                  </div>
                  <div className="rx-prod-info">
                    <div className="rx-prod-cat">{p.category_name}</div>
                    <h3 className="rx-prod-name"><Link to={`/san-pham/${p.slug}`}>{p.name}</Link></h3>
                    <div className="rx-prod-footer">
                      <div className="rx-prod-price">
                        <span className="rx-prod-price-new">{fmt(p.price_sale || p.price)}</span>
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
    </main>
  )
}
