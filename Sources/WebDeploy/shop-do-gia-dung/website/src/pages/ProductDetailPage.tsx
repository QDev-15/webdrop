import { useState, useMemo, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSite, Product } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='450'%3E%3Crect fill='%23f5ede0' width='600' height='450'/%3E%3C/svg%3E"

function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/)
  return match ? match[1] : null
}

function RelatedCard({ product }: { product: Product }) {
  return (
    <div className="dg-card">
      <Link to={`/san-pham/${product.slug}`} className="dg-card__img-wrap">
        <img className="dg-card__img" src={product.image || ''} alt={product.name} loading="lazy" onError={e => { (e.target as HTMLImageElement).src = FALLBACK }} />
      </Link>
      <div className="dg-card__body">
        <h3 className="dg-card__name" style={{ fontSize: 14 }}><Link to={`/san-pham/${product.slug}`}>{product.name}</Link></h3>
        <div className="dg-card__footer">
          <div className="dg-card__prices">
            {product.salePrice
              ? <><span className="dg-price dg-price--sale" style={{ fontSize: 14 }}>{product.salePrice.toLocaleString('vi-VN')}đ</span><span className="dg-price dg-price--old" style={{ fontSize: 12 }}>{product.price.toLocaleString('vi-VN')}đ</span></>
              : <span className="dg-price" style={{ fontSize: 14 }}>{product.price.toLocaleString('vi-VN')}đ</span>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { products, categories } = useSite()
  const { addItem } = useCart()
  const navigate = useNavigate()

  const product = products.find(p => p.slug === slug)

  useDocumentMeta({
    title: product ? `${product.name} – Shop Đồ Gia Dụng` : 'Sản phẩm – Shop Đồ Gia Dụng',
    description: product?.description?.slice(0, 155),
  })

  const [addedToCart, setAddedToCart] = useState(false)
  const [qty, setQty] = useState(1)

  // Parse all available colors for this product
  const colorOptions = useMemo(() => {
    if (!product?.colors) return []
    return product.colors.split('|').filter(Boolean).map(part => {
      const [name, hex] = part.split(':')
      return { name: name?.trim() ?? '', hex: hex?.trim() ?? '#ccc' }
    }).filter(c => c.name)
  }, [product?.colors])

  const [selectedColor, setSelectedColor] = useState<string>('')

  // Auto-select first color when product loads
  useEffect(() => {
    if (colorOptions.length > 0) setSelectedColor(colorOptions[0].name)
  }, [colorOptions])

  if (!product) {
    return (
      <div className="dg-container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <h2 style={{ marginBottom: 12 }}>Không tìm thấy sản phẩm</h2>
        <p style={{ color: 'var(--text-2)', marginBottom: 24 }}>Sản phẩm này không tồn tại hoặc đã bị xoá.</p>
        <Link to="/san-pham" className="dg-btn dg-btn--primary">Xem tất cả sản phẩm</Link>
      </div>
    )
  }

  // Gallery: chỉ 1 ảnh chính (tránh fake thumbs)
  const images = [product.image || '']

  // Video
  const ytId = product.video_url ? getYoutubeId(product.video_url) : null

  // Specs (JSON string)
  let specs: Record<string, string> = {}
  if (product.specs) {
    try { specs = JSON.parse(product.specs) } catch {}
  }
  if (product.material) specs['Chất liệu'] = product.material

  // Related (same category, exclude current)
  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const catName = categories.find(c => c.slug === product.category)?.name || product.categoryName

  const handleAddCart = () => {
    addItem({
      product_id: product.id, slug: product.slug, name: product.name,
      image: product.image || '', price: product.salePrice ?? product.price,
      color: selectedColor, size: ''
    }, qty)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2500)
  }

  const handleBuyNow = () => {
    handleAddCart()
    navigate('/gio-hang')
  }

  return (
    <>
      <div className="dg-container" style={{ padding: '24px clamp(16px,4vw,64px) 0' }}>
        {/* Breadcrumb */}
        <nav className="dg-breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span className="dg-breadcrumb__sep">›</span>
          <Link to="/san-pham">Sản phẩm</Link>
          {catName && <><span className="dg-breadcrumb__sep">›</span><Link to={`/san-pham?category=${product.category}`}>{catName}</Link></>}
          <span className="dg-breadcrumb__sep">›</span>
          <span>{product.name}</span>
        </nav>

        {/* Detail grid */}
        <div className="dg-detail-grid" style={{ paddingBottom: 48 }}>
          {/* Gallery */}
          <div>
            <div className="dg-detail-gallery__main">
              <img
                src={images[0] || ''}
                alt={product.name}
                onError={e => { (e.target as HTMLImageElement).src = FALLBACK }}
              />
            </div>

            {/* Video embed */}
            {ytId && (
              <div className="dg-video-wrap" style={{ marginTop: 16 }}>
                <iframe
                  src={`https://www.youtube.com/embed/${ytId}`}
                  title={`Video ${product.name}`}
                  allowFullScreen
                />
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {catName && <p className="dg-detail-info__cat">{catName}</p>}
            <h1 className="dg-detail-info__name">{product.name}</h1>

            {product.rating != null && (
              <div className="dg-detail-info__meta">
                <span className="dg-detail-info__stars">{'★'.repeat(Math.round(product.rating ?? 5))}</span>
                <span className="dg-detail-info__rating-text">{(product.rating ?? 5).toFixed(1)} / 5</span>
                {product.sold != null && <span className="dg-detail-info__sold">· Đã bán {product.sold}</span>}
              </div>
            )}

            <div className="dg-detail-info__prices">
              {product.salePrice ? (
                <>
                  <span className="dg-detail-info__price">{product.salePrice.toLocaleString('vi-VN')}đ</span>
                  <span className="dg-detail-info__old">{product.price.toLocaleString('vi-VN')}đ</span>
                  <span style={{ background: '#fee2e2', color: '#b91c1c', fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>
                    -{Math.round((1 - product.salePrice / product.price) * 100)}%
                  </span>
                </>
              ) : (
                <span className="dg-detail-info__price">{product.price.toLocaleString('vi-VN')}đ</span>
              )}
            </div>

            {product.description && <p className="dg-detail-info__desc">{product.description}</p>}

            <hr className="dg-detail-info__divider" />

            {/* Color — multi-select, track vào cart */}
            {colorOptions.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <p className="dg-detail-info__label">
                  Màu sắc
                  {selectedColor && (
                    <span style={{ fontWeight: 400, color: 'var(--text-2)', marginLeft: 8 }}>— {selectedColor}</span>
                  )}
                </p>
                <div className="dg-swatch-wrap">
                  {colorOptions.map(c => {
                    const isSelected = selectedColor === c.name
                    const isWhite = c.hex.toLowerCase() === '#ffffff' || c.hex.toLowerCase() === '#fff'
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        aria-pressed={isSelected}
                        aria-label={`Chọn màu ${c.name}`}
                        className={`dg-swatch${isSelected ? ' dg-swatch--active' : ''}`}
                        title={c.name}
                      >
                        <span className="dg-swatch__dot" style={{
                          background: c.hex,
                          border: isWhite ? '1px solid #ddd' : 'none',
                        }} />
                        {c.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={{ marginBottom: 20 }}>
              <p className="dg-detail-info__label">Số lượng</p>
              <div className="dg-qty">
                <button className="dg-qty__btn" onClick={() => setQty(v => Math.max(1, v - 1))}>−</button>
                <span className="dg-qty__val">{qty}</span>
                <button className="dg-qty__btn" onClick={() => setQty(v => v + 1)}>+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="dg-detail-actions">
              <button className="dg-btn dg-btn--primary dg-btn--lg" onClick={handleAddCart} style={{ flex: 1, justifyContent: 'center' }}>
                {addedToCart ? '✓ Đã thêm vào giỏ' : '🛒 Thêm vào giỏ hàng'}
              </button>
              <button className="dg-btn dg-btn--sage dg-btn--lg" onClick={handleBuyNow} style={{ flex: 1, justifyContent: 'center' }}>
                Mua ngay →
              </button>
            </div>

            {/* Trust badges */}
            <div className="dg-detail-trust" style={{ marginTop: 20 }}>
              {[
                ['🚚', 'Miễn phí giao hàng từ 500k'],
                ['🔄', 'Đổi trả trong 30 ngày'],
                ['✅', 'Hàng chính hãng'],
                ['💬', 'Hỗ trợ 24/7'],
              ].map(([icon, text], i) => (
                <div key={i} className="dg-trust-item">
                  <span>{icon}</span> {text}
                </div>
              ))}
            </div>

            {/* Specs */}
            {Object.keys(specs).length > 0 && (
              <div style={{ marginTop: 24, padding: '16px 20px', background: 'var(--warm)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-light)' }}>
                <p className="dg-detail-info__label" style={{ marginBottom: 12 }}>Thông số kỹ thuật</p>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {Object.entries(specs).map(([k, v]) => (
                      <tr key={k} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '7px 0', fontSize: 14, color: 'var(--text-3)', width: '40%', fontWeight: 500 }}>{k}</td>
                        <td style={{ padding: '7px 0', fontSize: 14, color: 'var(--text)' }}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="dg-related">
          <div className="dg-container">
            <h2 className="dg-related__title">Sản phẩm liên quan</h2>
            <div className="dg-grid dg-grid--4">
              {related.map(p => <RelatedCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
