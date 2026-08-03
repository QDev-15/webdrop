import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface Product {
  id: number
  name: string
  slug: string
  category_name: string
  image: string
  price: number
  price_sale: number
  badge: string
  description: string
  material: string
  colors: string
  gallery?: string
  rating: number
  in_stock: number
  is_new: number
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { products } = useSite()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState(0)
  const [selectedColor, setSelectedColor] = useState('')
  const [added, setAdded] = useState(false)
  const [activeImg, setActiveImg] = useState(0)

  const galleryExtra: string[] = (() => {
    if (!product?.gallery?.trim()) return []
    try {
      const p = JSON.parse(product.gallery)
      return Array.isArray(p) ? (p as unknown[]).filter((x): x is string => typeof x === 'string' && x.trim() !== '') : []
    } catch { return [] }
  })()
  const images = product ? [product.image || '', ...galleryExtra].filter(Boolean) : []

  useDocumentMeta({
    title: product ? `${product.name} — Shop Hữu Cơ` : 'Shop Hữu Cơ',
    description: product?.description ? product.description.slice(0, 155) : undefined,
  })

  useEffect(() => {
    if (!slug) return
    api.get<Product>(`/public/products/${slug}`)
      .then(p => {
        setProduct(p)
        const firstColor = p.colors ? p.colors.split('|')[0]?.split(':')[0] : ''
        setSelectedColor(firstColor || '')
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  const colorOptions = product?.colors
    ? product.colors.split('|').map(c => c.split(':')).filter(([name]) => name).map(([name, hex]) => ({ name, hex }))
    : []

  const handleAddToCart = () => {
    if (!product) return
    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: product.price_sale || product.price,
      color: selectedColor || undefined,
    }, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'
  const related = products.filter(p => p.slug !== slug && p.status === 'published').slice(0, 4)

  if (loading) return (
    <div style={{ paddingTop: 120, textAlign: 'center', color: 'var(--text-3)' }}>
      <div style={{ fontSize: 32, marginBottom: 16 }}>⌛</div>
      <p>Đang tải sản phẩm...</p>
    </div>
  )

  if (!product) return (
    <div style={{ paddingTop: 120, textAlign: 'center', color: 'var(--text-3)' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
      <p>Không tìm thấy sản phẩm</p>
      <Link to="/san-pham" className="sb-btn sb-btn-outline" style={{ marginTop: 24, display: 'inline-flex' }}>← Quay lại</Link>
    </div>
  )

  return (
    <>
      <div className="sb-product-detail-wrap">
        <div className="sb-container">
          <div className="sb-breadcrumb" style={{ marginBottom: 32 }}>
            <Link to="/">Trang chủ</Link>
            <span>›</span>
            <Link to="/san-pham">Sản phẩm</Link>
            <span>›</span>
            <span>{product.name}</span>
          </div>

          <div className="sb-detail-grid">
            <div>
              <div className="sb-gallery-main">
                {images.length > 0 ? (
                  <img src={images[activeImg]} alt={product.name} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'var(--cream-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>🛍</div>
                )}
              </div>
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                  {images.map((url, i) => (
                    <button key={i} type="button" onClick={() => setActiveImg(i)}
                      style={{
                        width: 64, height: 64, padding: 0, cursor: 'pointer', flexShrink: 0,
                        border: i === activeImg ? '2px solid var(--accent)' : '2px solid var(--border)',
                        borderRadius: 8, overflow: 'hidden', background: 'var(--warm)',
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

            <div className="sb-detail-info">
              <div className="sb-prod-cat">{product.category_name}</div>
              <h1 className="sb-detail-name">{product.name}</h1>
              <div className="sb-detail-rating">
                <span className="stars">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
                <span>{product.rating.toFixed(1)} / 5</span>
              </div>

              <div className="sb-detail-price">
                <span className="sb-detail-price-new">{fmt(product.price_sale || product.price)}</span>
                {product.price_sale > 0 && product.price_sale < product.price && (
                  <span className="sb-detail-price-old">{fmt(product.price)}</span>
                )}
              </div>

              {product.description && (
                <p className="sb-detail-desc">{product.description}</p>
              )}

              {colorOptions.length > 0 && (
                <div style={{ margin: '20px 0' }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-2)', marginBottom: 8 }}>Màu sắc: {selectedColor}</div>
                  <div className="sb-color-swatches">
                    {colorOptions.map(c => (
                      <div
                        key={c.name}
                        className={`sb-color-swatch ${selectedColor === c.name ? 'selected' : ''}`}
                        style={{ background: c.hex, border: c.hex === '#ffffff' ? '1px solid var(--border)' : undefined }}
                        title={c.name}
                        role="button"
                        tabIndex={0}
                        aria-label={`Chọn màu ${c.name}`}
                        onClick={() => setSelectedColor(c.name)}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSelectedColor(c.name) }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {!product.in_stock && (
                <p style={{ color: '#dc2626', fontSize: 13, fontWeight: 500, margin: '12px 0' }}>Sản phẩm tạm hết hàng</p>
              )}

              <div className="sb-detail-divider" />

              <div className="sb-qty-add">
                <div className="sb-qty" role="group" aria-label="Số lượng">
                  <button onClick={() => setQty(v => Math.max(1, v - 1))} aria-label="Giảm số lượng">−</button>
                  <input type="number" value={qty} min={1} aria-label="Số lượng sản phẩm" onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} />
                  <button onClick={() => setQty(v => v + 1)} aria-label="Tăng số lượng">+</button>
                </div>
                <button className="sb-btn-cart-full" disabled={!product.in_stock} onClick={handleAddToCart}>
                  {added ? (
                    <>
                      <i className="bi bi-check-circle" />
                      Đã thêm vào giỏ
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Thêm vào giỏ hàng
                    </>
                  )}
                </button>
                <button className="sb-btn-wishlist" aria-label="Yêu thích">♡</button>
              </div>

              {product.material && (
                <div className="sb-product-tags">
                  <span>Chất liệu:</span>
                  <span>{product.material}</span>
                </div>
              )}
            </div>
          </div>

          <div className="sb-tabs">
            <div className="sb-tab-list">
              {['Mô tả', 'Chất liệu & Chăm sóc', 'Đánh giá'].map((tab, i) => (
                <button key={tab} className={`sb-tab-btn ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>{tab}</button>
              ))}
            </div>
            <div className="sb-tab-panel" style={{ display: activeTab === 0 ? 'block' : 'none' }}>
              <p style={{ color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.75 }}>{product.description || 'Chưa có mô tả chi tiết.'}</p>
            </div>
            <div className="sb-tab-panel" style={{ display: activeTab === 1 ? 'block' : 'none' }}>
              <p style={{ color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.75 }}>
                <strong>Chất liệu:</strong> {product.material || 'Nguyên liệu tự nhiên hữu cơ'}<br />
                <strong>Bảo quản:</strong> Tránh ánh nắng trực tiếp, bảo quản nơi khô ráo.<br />
                <strong>Xuất xứ:</strong> Việt Nam
              </p>
            </div>
            <div className="sb-tab-panel" style={{ display: activeTab === 2 ? 'block' : 'none' }}>
              <p style={{ color: 'var(--text-2)', fontWeight: 300 }}>★★★★★ 5.0 / 5 — Dựa trên 32 đánh giá</p>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="sb-related">
          <div className="sb-container">
            <div className="sb-eyebrow">Gợi ý</div>
            <h2 className="sb-sec-title">Có thể bạn <em>cũng thích</em></h2>
            <div className="sb-related-grid">
              {related.map(p => (
                <Link key={p.id} to={`/san-pham/${p.slug}`} className="sb-prod-card">
                  <div className="sb-prod-img">
                    {p.image ? <img src={p.image} alt={p.name} loading="lazy" /> : <div style={{ aspectRatio: '1', background: 'var(--cream-deep)' }} />}
                    {p.badge && <div className="sb-prod-badge">{p.badge}</div>}
                  </div>
                  <div className="sb-prod-info">
                    <div className="sb-prod-cat">{p.category_name}</div>
                    <div className="sb-prod-name">{p.name}</div>
                    <div className="sb-prod-price">
                      <span className="sb-prod-price-new">{fmt(p.price_sale || p.price)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
