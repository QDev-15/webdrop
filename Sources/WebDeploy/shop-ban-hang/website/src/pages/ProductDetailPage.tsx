import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'

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
  is_new: number
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { products } = useSite()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    if (!slug) return
    api.get<Product>(`/public/products/${slug}`)
      .then(setProduct)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

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
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'var(--cream-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>🛍</div>
                )}
              </div>
            </div>

            <div className="sb-detail-info">
              <div className="sb-prod-cat">{product.category_name}</div>
              <h1 className="sb-detail-name">{product.name}</h1>
              <div className="sb-detail-rating">
                <span className="stars">★★★★★</span>
                <span>5.0 (32 đánh giá)</span>
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

              <div className="sb-detail-divider" />

              <div className="sb-qty-add">
                <div className="sb-qty">
                  <button onClick={() => setQty(v => Math.max(1, v - 1))}>−</button>
                  <input type="number" value={qty} min={1} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} />
                  <button onClick={() => setQty(v => v + 1)}>+</button>
                </div>
                <button className="sb-btn-cart-full">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Thêm vào giỏ hàng
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
