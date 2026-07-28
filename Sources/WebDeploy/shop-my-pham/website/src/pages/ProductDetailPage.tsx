import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useSite, type Product } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { fmtPrice, catLabel, parsePadded, SKIN_TYPE_LABELS, onImgError } from '../lib/format'
import ProductCard from '../components/ProductCard'

type TabKey = 'desc' | 'ingr' | 'use' | 'policy'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { products, settings } = useSite()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState<TabKey>('desc')
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!slug) return
    setProduct(null)
    setNotFound(false)
    setQty(1)
    setActiveTab('desc')
    api.get<Product>(`/public/products/${slug}`)
      .then(setProduct)
      .catch(() => setNotFound(true))
  }, [slug])

  useDocumentMeta({
    title: product ? `${product.name} — ${settings.site_name || 'LUMIÈRE Beauty'}` : `Chi tiết sản phẩm — ${settings.site_name || 'LUMIÈRE Beauty'}`,
    description: product?.description?.slice(0, 155),
  })

  const related = useMemo(
    () => (product ? products.filter(p => p.id !== product.id && p.category_slug === product.category_slug).slice(0, 4) : []),
    [product, products]
  )

  if (notFound) {
    return (
      <main id="mp-main">
        <div className="wd-container" style={{ padding: '120px 0', textAlign: 'center' }}>
          <h1 style={{ marginBottom: 12 }}>Không tìm thấy sản phẩm</h1>
          <Link to="/san-pham" className="mp-btn mp-btn-accent">Về trang Sản phẩm →</Link>
        </div>
      </main>
    )
  }

  if (!product) {
    return <main id="mp-main"><div className="wd-container" style={{ padding: '120px 0', textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div></main>
  }

  const effectivePrice = product.price_sale ?? product.price
  const skinTypes = parsePadded(product.skin_type)

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: effectivePrice,
    }, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/gio-hang')
  }

  return (
    <main id="mp-main">
      <div className="mp-breadcrumb-bar">
        <div className="wd-container">
          <nav aria-label="Breadcrumb">
            <ol className="mp-breadcrumb">
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/san-pham">Sản phẩm</Link></li>
              <li><Link to={`/san-pham?category=${product.category_slug}`}>{catLabel(product.category_slug)}</Link></li>
              <li><span>{product.name}</span></li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="mp-product-detail" itemScope itemType="https://schema.org/Product">
        <div className="wd-container">
          <div className="mp-detail-grid">
            <div className="mp-detail-gallery">
              <div className="mp-gallery-main">
                <img src={product.image} alt={product.name} className="mp-gallery-main-img" itemProp="image" onError={onImgError} />
              </div>
            </div>

            <div className="mp-detail-info">
              <div className="mp-detail-brand" itemProp="brand" itemScope itemType="https://schema.org/Brand">
                <span itemProp="name">{product.brand}</span>
              </div>
              <h1 className="mp-detail-name" itemProp="name">{product.name}</h1>

              <div className="mp-detail-rating" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                <span className="mp-stars" aria-label={`${product.rating} sao`}>{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
                <span className="mp-rating-val" itemProp="ratingValue">{product.rating}</span>
                <span className="mp-rating-count">(<span itemProp="reviewCount">{product.sold}</span> đánh giá)</span>
                <span className="mp-sold-count">· Đã bán {product.sold}+</span>
              </div>

              <div className="mp-detail-price" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                <meta itemProp="priceCurrency" content="VND" />
                {product.price_sale ? (
                  <>
                    <span className="mp-price-main" itemProp="price" content={String(product.price_sale)}>{fmtPrice(product.price_sale)}</span>
                    <span className="mp-price-note" style={{ textDecoration: 'line-through' }}>{fmtPrice(product.price)}</span>
                  </>
                ) : (
                  <span className="mp-price-main" itemProp="price" content={String(product.price)}>{fmtPrice(product.price)}</span>
                )}
              </div>

              <div className="mp-detail-trust-row">
                <span className="mp-trust-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg> Hàng chính hãng</span>
                <span className="mp-trust-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg> Đổi trả {settings.return_days || '30'} ngày</span>
                <span className="mp-trust-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg> Freeship đơn từ 500K</span>
              </div>

              <div className="mp-detail-desc">
                <p>{product.description}</p>
              </div>

              <div className="mp-detail-qty-row">
                <label className="mp-detail-label" htmlFor="mpQtyInput">Số lượng</label>
                <div className="mp-qty-ctrl">
                  <button className="mp-qty-btn" type="button" aria-label="Giảm số lượng" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <input type="number" id="mpQtyInput" className="mp-qty-input" value={qty} min={1} max={99} aria-label="Số lượng" readOnly />
                  <button className="mp-qty-btn" type="button" aria-label="Tăng số lượng" onClick={() => setQty(q => Math.min(99, q + 1))}>+</button>
                </div>
              </div>

              <div className="mp-detail-cta">
                <button className="mp-btn mp-btn-accent mp-btn-large" type="button" aria-label="Thêm vào giỏ hàng" onClick={handleAddToCart}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                  {added ? '✓ Đã thêm vào giỏ' : 'Thêm vào giỏ'}
                </button>
                <button className="mp-btn mp-btn-dark mp-btn-large" type="button" aria-label="Mua ngay" onClick={handleBuyNow}>Mua ngay</button>
              </div>

              <dl className="mp-detail-meta-list">
                <div className="mp-meta-row">
                  <dt>Thương hiệu</dt>
                  <dd>{product.brand}</dd>
                </div>
                <div className="mp-meta-row">
                  <dt>Danh mục</dt>
                  <dd><Link to={`/san-pham?category=${product.category_slug}`}>{catLabel(product.category_slug)}</Link></dd>
                </div>
                {skinTypes.length > 0 && (
                  <div className="mp-meta-row">
                    <dt>Phù hợp</dt>
                    <dd>{skinTypes.map(s => SKIN_TYPE_LABELS[s] || s).join(', ')}</dd>
                  </div>
                )}
                <div className="mp-meta-row">
                  <dt>Tình trạng</dt>
                  <dd>{product.in_stock ? 'Còn hàng' : 'Hết hàng'}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mp-detail-tabs">
            <div className="mp-tabs-nav" role="tablist" aria-label="Thông tin sản phẩm">
              <button className={'mp-tab' + (activeTab === 'desc' ? ' active' : '')} role="tab" aria-selected={activeTab === 'desc'} onClick={() => setActiveTab('desc')}>Mô tả</button>
              <button className={'mp-tab' + (activeTab === 'ingr' ? ' active' : '')} role="tab" aria-selected={activeTab === 'ingr'} onClick={() => setActiveTab('ingr')}>Thành phần</button>
              <button className={'mp-tab' + (activeTab === 'use' ? ' active' : '')} role="tab" aria-selected={activeTab === 'use'} onClick={() => setActiveTab('use')}>Cách dùng</button>
              <button className={'mp-tab' + (activeTab === 'policy' ? ' active' : '')} role="tab" aria-selected={activeTab === 'policy'} onClick={() => setActiveTab('policy')}>Chính sách</button>
            </div>
            <div className="mp-tab-panels">
              {activeTab === 'desc' && (
                <div className="mp-tab-panel active" role="tabpanel">
                  <h3>Về sản phẩm</h3>
                  <p>{product.description}</p>
                </div>
              )}
              {activeTab === 'ingr' && (
                <div className="mp-tab-panel active" role="tabpanel">
                  <h3>Thành phần</h3>
                  <p>LUMIÈRE công bố đầy đủ danh sách thành phần (INCI list) của mọi sản phẩm ngay trên bao bì — bạn có quyền biết mình đang dùng gì. Sản phẩm không chứa Paraben, không sulfate, không hương liệu tổng hợp gây kích ứng, được kiểm định an toàn cho mọi loại da kể cả da nhạy cảm.</p>
                </div>
              )}
              {activeTab === 'use' && (
                <div className="mp-tab-panel active" role="tabpanel">
                  <h3>Hướng dẫn sử dụng</h3>
                  <ol>
                    <li>Làm sạch da/tóc trước khi sử dụng sản phẩm.</li>
                    <li>Sử dụng lượng vừa đủ theo hướng dẫn trên bao bì.</li>
                    <li>Thoa/massage đều lên vùng cần chăm sóc.</li>
                    <li>Sử dụng đều đặn theo tần suất khuyến nghị để đạt hiệu quả tốt nhất.</li>
                  </ol>
                  <p><strong>Lưu ý:</strong> Nếu da/tóc nhạy cảm, nên thử trên vùng da nhỏ trước khi sử dụng toàn bộ.</p>
                </div>
              )}
              {activeTab === 'policy' && (
                <div className="mp-tab-panel active" role="tabpanel">
                  <h3>Chính sách mua hàng</h3>
                  <ul>
                    <li><strong>Miễn phí vận chuyển</strong> cho đơn hàng từ 500.000đ.</li>
                    <li><strong>Đổi trả {settings.return_days || '30'} ngày</strong> — Sản phẩm lỗi hoặc không đúng mô tả được đổi trả miễn phí.</li>
                    <li><strong>Cam kết chính hãng 100%</strong> — Hoàn tiền gấp đôi nếu phát hiện hàng giả.</li>
                    <li><strong>Bảo quản:</strong> Nhiệt độ phòng, tránh ánh nắng trực tiếp.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {related.length > 0 && (
            <section className="mp-related" aria-labelledby="mpRelatedTitle" data-reveal>
              <div className="mp-sec-header">
                <div className="mp-sec-header-left">
                  <div className="mp-eyebrow">Có thể bạn thích</div>
                  <h2 id="mpRelatedTitle" className="mp-sec-title">Sản Phẩm Liên Quan</h2>
                </div>
                <Link to={`/san-pham?category=${product.category_slug}`} className="mp-sec-viewall">Xem tất cả →</Link>
              </div>
              <div className="mp-grid" role="list">
                {related.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  )
}
