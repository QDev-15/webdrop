import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useSite, type Product } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface Review {
  id: number
  author_name: string
  rating: number
  variant_note: string
  review_date: string
  content: string
}

function parseColors(colors: string): { name: string; hex: string }[] {
  return colors ? colors.split('|').map(c => c.split(':')).filter(([n]) => n).map(([name, hex]) => ({ name, hex })) : []
}

function parseSizes(sizes: string): string[] {
  return sizes ? sizes.split('|').filter(Boolean) : []
}

function parseSpecs(json: string): [string, string][] {
  try {
    const arr = JSON.parse(json || '[]')
    if (!Array.isArray(arr)) return []
    return arr
      .filter((r: unknown): r is unknown[] => Array.isArray(r) && r.length >= 2)
      .map((r): [string, string] => [String(r[0] ?? ''), String(r[1] ?? '')])
  } catch { return [] }
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { products } = useSite()
  const { addItem } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews' | 'care'>('desc')
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [activeImg, setActiveImg] = useState(0)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setActiveImg(0)
    setActiveTab('desc')
    Promise.all([
      api.get<Product>(`/public/products/${slug}`),
      api.get<Review[]>(`/public/products/${slug}/reviews`).catch(() => []),
    ]).then(([p, r]) => {
      setProduct(p)
      setReviews(r)
      const colors = parseColors(p.colors)
      const sizes = parseSizes(p.sizes)
      setSelectedColor(colors[0]?.name || '')
      setSelectedSize(sizes[0] || '')
    }).catch(() => {}).finally(() => setLoading(false))
  }, [slug])

  useDocumentMeta({
    title: product ? `${product.name} — Nova Store` : 'Sản phẩm — Nova Store',
    description: product?.description ? product.description.slice(0, 155) : undefined,
  })

  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'

  if (loading) return (
    <div style={{ paddingTop: 140, textAlign: 'center', color: 'var(--text-3)', minHeight: '60vh' }}>Đang tải sản phẩm...</div>
  )

  if (!product) return (
    <div style={{ paddingTop: 140, textAlign: 'center', color: 'var(--text-3)', minHeight: '60vh' }}>
      <p>Không tìm thấy sản phẩm</p>
      <Link to="/san-pham" className="st-btn st-btn-outline" style={{ marginTop: 24, display: 'inline-flex' }}>← Quay lại</Link>
    </div>
  )

  const colorOptions = parseColors(product.colors)
  const sizeOptions = parseSizes(product.sizes)
  const specs = parseSpecs(product.specs)
  const features = (product.features || '').split('\n').map(s => s.trim()).filter(Boolean)
  const gallery = [product.image, ...(product.gallery ? product.gallery.split('|') : [])].filter(Boolean)
  const related = products.filter(p => p.slug !== slug && p.category_id === product.category_id).slice(0, 3)
  const relatedFallback = products.filter(p => p.slug !== slug).slice(0, 3)
  const relatedItems = related.length > 0 ? related : relatedFallback

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: product.price_sale || product.price,
      color: selectedColor || undefined,
      size: selectedSize || undefined,
    }, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <>
      <div style={{ background: 'var(--surface)', padding: '88px 0 0' }}>
        <div className="st-container" style={{ paddingTop: 24, paddingBottom: 16 }}>
          <nav className="st-breadcrumb" aria-label="Điều hướng">
            <Link to="/">Trang chủ</Link>
            <span className="st-breadcrumb-sep">/</span>
            <Link to="/san-pham">Bộ sưu tập</Link>
            <span className="st-breadcrumb-sep">/</span>
            <span>{product.name}</span>
          </nav>
        </div>
      </div>

      <section className="st-sec" style={{ background: 'var(--surface)', paddingTop: 32 }} aria-label="Chi tiết sản phẩm">
        <div className="st-container">
          <div className="st-detail-layout">
            <div className="st-gallery">
              <div className="st-gallery-main">
                <img src={gallery[activeImg] || product.image} alt={product.name} loading="eager" />
              </div>
              {gallery.length > 1 && (
                <div className="st-gallery-thumbs" role="group" aria-label="Ảnh sản phẩm">
                  {gallery.map((src, i) => (
                    <div key={i} className={`st-thumb ${activeImg === i ? 'st-active' : ''}`} onClick={() => setActiveImg(i)}>
                      <img src={src} alt={`${product.name} — ảnh ${i + 1}`} loading="lazy" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="st-detail-info">
              {product.brand && <div className="st-detail-brand">{product.brand}</div>}
              <h1 className="st-detail-title">{product.name}</h1>

              <div className="st-detail-price">
                <span className="st-d-price-now">{fmt(product.price_sale || product.price)}</span>
                {!!product.price_sale && product.price_sale < product.price && (
                  <>
                    <span className="st-d-price-old">{fmt(product.price)}</span>
                    <span className="st-d-price-save">Tiết kiệm {fmt(product.price - product.price_sale)}</span>
                  </>
                )}
              </div>

              <div className="st-detail-rating">
                <div className="st-rating-stars" aria-label={`${product.rating} sao`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <i key={i} className={`bi ${i < Math.round(product.rating) ? 'bi-star-fill' : 'bi-star'}`} />
                  ))}
                </div>
                <span className="st-rating-count">{product.rating.toFixed(1)} ({product.review_count} đánh giá)</span>
                {product.sold_count > 0 && <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 700, marginLeft: 8 }}>Đã bán {product.sold_count}+</span>}
              </div>

              <div className="st-divider" />

              {colorOptions.length > 0 && (
                <>
                  <div className="st-opt-label">Màu sắc: <strong style={{ fontWeight: 800 }}>{selectedColor}</strong></div>
                  <div className="d-flex gap-2 mb-4">
                    {colorOptions.map(c => (
                      <span
                        key={c.name}
                        className={`st-color-dot ${selectedColor === c.name ? 'active' : ''}`}
                        style={{ background: c.hex, width: 28, height: 28, outline: c.hex === '#ffffff' ? '1px solid #ccc' : undefined }}
                        onClick={() => setSelectedColor(c.name)}
                        title={c.name}
                        role="button"
                        tabIndex={0}
                        aria-label={`Màu ${c.name}`}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSelectedColor(c.name) }}
                      />
                    ))}
                  </div>
                </>
              )}

              {sizeOptions.length > 0 && (
                <>
                  <div className="st-opt-label">Size: <strong style={{ fontWeight: 800 }}>{selectedSize}</strong></div>
                  <div className="st-size-grid">
                    {sizeOptions.map(s => (
                      <button key={s} type="button" className={`st-size-btn ${selectedSize === s ? 'active' : ''}`} onClick={() => setSelectedSize(s)}>{s}</button>
                    ))}
                  </div>
                </>
              )}

              <div className="st-qty-row">
                <div className="st-qty-ctrl">
                  <button type="button" onClick={() => setQty(v => Math.max(1, v - 1))} aria-label="Giảm số lượng"><i className="bi bi-dash" /></button>
                  <input type="number" value={qty} min={1} max={99} aria-label="Số lượng" onChange={e => setQty(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))} />
                  <button type="button" onClick={() => setQty(v => Math.min(99, v + 1))} aria-label="Tăng số lượng"><i className="bi bi-plus" /></button>
                </div>
                <span style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 600 }}>
                  {product.in_stock ? <>Còn <strong style={{ color: 'var(--text)' }}>{product.stock_qty}</strong> sản phẩm</> : <span style={{ color: 'var(--sale)' }}>Tạm hết hàng</span>}
                </span>
              </div>

              <div className="st-detail-ctas">
                <button type="button" className="st-btn st-btn-dark st-btn-lg" disabled={!product.in_stock} onClick={handleAddToCart}>
                  {added ? <><i className="bi bi-check-lg" /> Đã thêm</> : <><i className="bi bi-bag-plus" /> Thêm vào giỏ</>}
                </button>
                <Link to="/gio-hang" className="st-btn st-btn-primary st-btn-lg" onClick={() => !added && handleAddToCart()}>
                  Mua ngay <i className="bi bi-arrow-right" />
                </Link>
              </div>

              <div className="st-detail-trust">
                <div className="st-trust-item"><i className="bi bi-truck" /> Freeship đơn &gt; 300.000đ</div>
                <div className="st-trust-item"><i className="bi bi-arrow-repeat" /> Đổi trả 14 ngày</div>
                <div className="st-trust-item"><i className="bi bi-shield-check" /> Cam kết chính hãng</div>
              </div>
            </div>
          </div>

          <div className="st-tabs">
            <div className="st-tab-nav" role="tablist">
              <button className={`st-tab-btn ${activeTab === 'desc' ? 'active' : ''}`} onClick={() => setActiveTab('desc')} role="tab" aria-selected={activeTab === 'desc'}>Mô tả</button>
              <button className={`st-tab-btn ${activeTab === 'specs' ? 'active' : ''}`} onClick={() => setActiveTab('specs')} role="tab" aria-selected={activeTab === 'specs'}>Thông số</button>
              <button className={`st-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')} role="tab" aria-selected={activeTab === 'reviews'}>Đánh giá ({product.review_count})</button>
              <button className={`st-tab-btn ${activeTab === 'care' ? 'active' : ''}`} onClick={() => setActiveTab('care')} role="tab" aria-selected={activeTab === 'care'}>Hướng dẫn chăm sóc</button>
            </div>

            {activeTab === 'desc' && (
              <div className="st-tab-panel active" role="tabpanel">
                <div className="row g-4">
                  <div className="col-md-8">
                    <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.8, marginBottom: 16 }}>{product.description}</p>
                    {features.length > 0 && (
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {features.map((f, i) => (
                          <li key={i} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--text-2)', alignItems: 'flex-start' }}>
                            <i className="bi bi-check2-circle" style={{ color: 'var(--accent)', marginTop: 2, fontSize: 16, flexShrink: 0 }} />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="st-tab-panel active" role="tabpanel">
                <div className="st-container-sm" style={{ padding: 0 }}>
                  <table className="st-specs-table">
                    <tbody>
                      {specs.length > 0 ? specs.map(([label, value], i) => (
                        <tr key={i}><td>{label}</td><td>{value}</td></tr>
                      )) : <tr><td colSpan={2}>Chưa có thông số chi tiết.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="st-tab-panel active" role="tabpanel">
                <div className="row g-4 mb-4">
                  <div className="col-auto" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1 }}>{product.rating.toFixed(1)}</div>
                    <div className="d-flex gap-1 justify-content-center my-2">
                      {Array.from({ length: 5 }, (_, i) => (
                        <i key={i} className={`bi ${i < Math.round(product.rating) ? 'bi-star-fill' : 'bi-star'}`} style={{ color: '#f59e0b' }} />
                      ))}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 600 }}>{product.review_count} đánh giá</div>
                  </div>
                </div>

                {reviews.length === 0 ? (
                  <p style={{ color: 'var(--text-3)' }}>Chưa có đánh giá nào cho sản phẩm này.</p>
                ) : reviews.map(r => (
                  <div className="st-review-item" key={r.id}>
                    <div className="st-review-top">
                      <div className="st-review-avatar">{r.author_name.charAt(0).toUpperCase()}</div>
                      <div>
                        <div className="st-review-name">{r.author_name}</div>
                        <div className="d-flex gap-1 my-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <i key={i} className={`bi ${i < r.rating ? 'bi-star-fill' : 'bi-star'}`} style={{ color: '#f59e0b', fontSize: 13 }} />
                          ))}
                        </div>
                        <div className="st-review-date">
                          {[r.variant_note, r.review_date ? new Date(r.review_date).toLocaleDateString('vi-VN') : ''].filter(Boolean).join(' | ')}
                        </div>
                      </div>
                    </div>
                    <p className="st-review-text">"{r.content}"</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'care' && (
              <div className="st-tab-panel active" role="tabpanel">
                <div className="row g-4">
                  <div className="col-md-8">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      <div style={{ padding: 20, border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: 28, marginBottom: 12, color: 'var(--accent)' }}>🫧</div>
                        <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Giặt</div>
                        <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7 }}>Giặt máy ở nhiệt độ ≤ 30°C. Lộn trái trước khi giặt để giữ màu bền.</p>
                      </div>
                      <div style={{ padding: 20, border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: 28, marginBottom: 12, color: 'var(--accent)' }}>🌡️</div>
                        <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Ủi</div>
                        <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7 }}>Ủi ở nhiệt độ thấp. Không ủi trực tiếp lên hình in (nếu có).</p>
                      </div>
                      <div style={{ padding: 20, border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: 28, marginBottom: 12, color: 'var(--accent)' }}>🏷️</div>
                        <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Tẩy &amp; Phơi</div>
                        <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7 }}>Không sử dụng nước tẩy. Phơi trong bóng râm, tránh ánh nắng trực tiếp.</p>
                      </div>
                      <div style={{ padding: 20, border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: 28, marginBottom: 12, color: 'var(--accent)' }}>👕</div>
                        <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Bảo quản</div>
                        <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7 }}>Gấp gọn hoặc treo móc. Bảo quản nơi khô ráo, thoáng mát.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {relatedItems.length > 0 && (
            <div className="st-sec-sm">
              <div className="d-flex align-items-end justify-content-between mb-4 flex-wrap gap-3">
                <div>
                  <div className="st-eyebrow">Gợi Ý</div>
                  <h2 className="st-sec-title mb-0">Sản Phẩm Liên Quan</h2>
                </div>
                <Link to="/san-pham" className="st-btn st-btn-outline">Xem tất cả <i className="bi bi-arrow-right" /></Link>
              </div>
              <div className="st-prods-grid">
                {relatedItems.map(p => (
                  <div className="st-prod-card" data-reveal key={p.id}>
                    <div className="st-prod-thumb">
                      <Link to={`/san-pham/${p.slug}`}><img src={p.image} alt={p.name} loading="lazy" /></Link>
                      {p.badge && <span className={`st-prod-badge ${p.is_new ? 'st-prod-badge-new' : 'st-prod-badge-sale'}`}>{p.badge}</span>}
                      <div className="st-prod-actions">
                        <button aria-label="Thêm vào giỏ hàng" onClick={() => addItem({ product_id: p.id, name: p.name, slug: p.slug, image: p.image, price: p.price_sale || p.price })}>Thêm giỏ</button>
                      </div>
                    </div>
                    <div className="st-prod-info">
                      <div className="st-prod-name"><Link to={`/san-pham/${p.slug}`}>{p.name}</Link></div>
                      <div className="st-prod-price">
                        <span className="st-price-current">{fmt(p.price_sale || p.price)}</span>
                        {!!p.price_sale && p.price_sale < p.price && <span className="st-price-original">{fmt(p.price)}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
