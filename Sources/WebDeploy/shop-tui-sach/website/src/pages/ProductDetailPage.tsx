import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useSite, type Product } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

function parseColors(colors: string): { name: string; hex: string }[] {
  return colors ? colors.split('|').map(c => c.split(':')).filter(([n]) => n).map(([name, hex]) => ({ name, hex })) : []
}

function parseSizes(sizes: string): string[] {
  return sizes ? sizes.split('|').filter(Boolean) : []
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { products } = useSite()
  const { addItem } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState<'desc' | 'spec' | 'review'>('desc')
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [added, setAdded] = useState(false)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setNotFound(false)
    setActiveTab('desc')
    setQty(1)
    setActiveImg(0)
    api.get<Product>(`/public/products/${slug}`)
      .then(p => {
        setProduct(p)
        const colors = parseColors(p.colors)
        const sizes = parseSizes(p.sizes)
        setSelectedColor(colors[0]?.name || '')
        setSelectedSize(sizes[0] || '')
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  useDocumentMeta({
    title: product ? `${product.name} — Maison Cuir` : 'Maison Cuir',
    description: product?.description ? product.description.slice(0, 155) : undefined,
  })

  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'

  if (loading) {
    return <div style={{ paddingTop: 180, textAlign: 'center', color: 'var(--text-3)', minHeight: '50vh' }}>Đang tải sản phẩm...</div>
  }
  if (notFound || !product) {
    return (
      <div style={{ paddingTop: 180, textAlign: 'center', color: 'var(--text-3)', minHeight: '50vh' }}>
        <p>Không tìm thấy sản phẩm</p>
        <Link to="/san-pham" className="ts-btn" style={{ marginTop: 24, display: 'inline-flex' }}>← Quay lại</Link>
      </div>
    )
  }

  const colorOptions = parseColors(product.colors)
  const sizeOptions = parseSizes(product.sizes)

  const galleryExtra: string[] = (() => {
    if (!product.gallery?.trim()) return []
    try {
      const parsed = JSON.parse(product.gallery)
      return Array.isArray(parsed) ? (parsed as unknown[]).filter((x): x is string => typeof x === 'string' && x.trim() !== '') : []
    } catch { return [] }
  })()
  const images = [product.image || '', ...galleryExtra].filter(Boolean)

  const related = products.filter(p => p.slug !== slug && p.category_id === product.category_id).slice(0, 4)
  const relatedFallback = products.filter(p => p.slug !== slug).slice(0, 4)
  const relatedItems = related.length > 0 ? related : relatedFallback

  const handleAddToCart = () => {
    addItem({
      product_id: product.id, name: product.name, slug: product.slug, image: product.image,
      price: product.price_sale || product.price,
      color: selectedColor || undefined, size: selectedSize || undefined,
    }, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  const roundedRating = Math.round(product.rating)

  return (
    <>
      <div className="ts-container" style={{ paddingTop: 110 }}>
        <div className="ts-breadcrumb" style={{ justifyContent: 'flex-start' }}>
          <Link to="/">Trang chủ</Link>
          <span>/</span>
          <Link to="/san-pham">Sản phẩm</Link>
          <span>/</span>
          <span className="current">{product.name}</span>
        </div>
      </div>

      <section className="sec-pad" style={{ paddingTop: 32 }}>
        <div className="ts-container">
          <div className="ts-pd-layout">
            <div>
              <div className="ts-pd-main-img">
                <img src={images[activeImg] || product.image} alt={product.name} loading="eager" />
              </div>
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                  {images.map((url, i) => (
                    <button key={i} type="button" onClick={() => setActiveImg(i)}
                      style={{
                        width: 64, height: 64, padding: 0, cursor: 'pointer', flexShrink: 0,
                        border: i === activeImg ? '2px solid var(--gold, #c9a24d)' : '2px solid var(--border)',
                        borderRadius: 6, overflow: 'hidden', background: 'var(--dark2, #1a1714)',
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

            <div className="ts-pd-info">
              <span className="ts-card-cat">{product.category_name}</span>
              <h1>{product.name}</h1>
              <div className="ts-pd-rating">
                <span className="stars">{'★'.repeat(roundedRating)}{'☆'.repeat(5 - roundedRating)}</span>
                <span>{product.rating.toFixed(1)}/5 · {product.in_stock ? 'Còn hàng' : 'Tạm hết hàng'}</span>
              </div>
              <div className="ts-pd-price">
                {fmt(product.price_sale || product.price)}
                {!!product.price_sale && <del>{fmt(product.price)}</del>}
              </div>
              <p className="ts-pd-desc">{product.description}</p>

              {colorOptions.length > 0 && (
                <div className="ts-pd-option-block">
                  <div className="ts-pd-option-label">Màu sắc <span className="val">{selectedColor}</span></div>
                  <div className="ts-swatch-row">
                    {colorOptions.map(c => (
                      <div
                        key={c.name}
                        className={`ts-color-swatch${selectedColor === c.name ? ' active' : ''}`}
                        style={{ background: c.hex }}
                        tabIndex={0}
                        role="button"
                        aria-pressed={selectedColor === c.name}
                        aria-label={`Màu ${c.name}`}
                        onClick={() => setSelectedColor(c.name)}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedColor(c.name) } }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {sizeOptions.length > 0 && (
                <div className="ts-pd-option-block">
                  <div className="ts-pd-option-label">Kích thước <span className="val">{selectedSize}</span></div>
                  <div className="ts-swatch-row">
                    {sizeOptions.map(s => (
                      <div
                        key={s}
                        className={`ts-size-swatch${selectedSize === s ? ' active' : ''}`}
                        tabIndex={0}
                        role="button"
                        aria-pressed={selectedSize === s}
                        onClick={() => setSelectedSize(s)}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedSize(s) } }}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="ts-pd-option-block">
                <div className="ts-pd-option-label">Số lượng</div>
                <div className="ts-qty-stepper">
                  <button type="button" onClick={() => setQty(v => Math.max(1, v - 1))} aria-label="Giảm số lượng">−</button>
                  <label htmlFor="ts-qty-input" className="visually-hidden">Số lượng sản phẩm</label>
                  <input type="text" id="ts-qty-input" value={qty} readOnly />
                  <button type="button" onClick={() => setQty(v => Math.min(10, v + 1))} aria-label="Tăng số lượng">+</button>
                </div>
              </div>

              <div className="ts-pd-actions">
                <button type="button" className="ts-btn solid" disabled={!product.in_stock} onClick={handleAddToCart}>
                  {added ? 'Đã thêm vào giỏ ✓' : 'Thêm vào giỏ hàng'}
                </button>
                <button type="button" className="ts-pd-wish-btn" aria-label="Thêm vào yêu thích"><i className="bi bi-heart" /></button>
              </div>

              <ul className="ts-pd-features">
                <li><i className="bi bi-check2" /> Da bò thật nguyên miếng, thuộc theo tiêu chuẩn Ý</li>
                <li><i className="bi bi-check2" /> Bảo hành trọn đời — sửa chữa miễn phí</li>
                <li><i className="bi bi-check2" /> Giao hàng toàn quốc trong 2-4 ngày</li>
                <li><i className="bi bi-check2" /> Đổi trả miễn phí trong 30 ngày</li>
              </ul>
            </div>
          </div>

          <div style={{ marginTop: 80 }}>
            <div className="ts-tabs-nav" role="tablist" aria-label="Thông tin sản phẩm">
              <button className="ts-tab-btn" role="tab" aria-selected={activeTab === 'desc'} onClick={() => setActiveTab('desc')}>Mô tả</button>
              <button className="ts-tab-btn" role="tab" aria-selected={activeTab === 'spec'} onClick={() => setActiveTab('spec')}>Thông số</button>
              <button className="ts-tab-btn" role="tab" aria-selected={activeTab === 'review'} onClick={() => setActiveTab('review')}>Đánh giá</button>
            </div>

            {activeTab === 'desc' && (
              <div className="ts-tab-panel active" role="tabpanel">
                <p>{product.description}</p>
              </div>
            )}
            {activeTab === 'spec' && (
              <div className="ts-tab-panel active" role="tabpanel">
                <table className="ts-spec-table">
                  <tbody>
                    <tr><td>Danh mục</td><td>{product.category_name}</td></tr>
                    {colorOptions.length > 0 && <tr><td>Màu sắc</td><td>{colorOptions.map(c => c.name).join(' / ')}</td></tr>}
                    {sizeOptions.length > 0 && <tr><td>Kích thước</td><td>{sizeOptions.join(' / ')}</td></tr>}
                    <tr><td>Chất liệu</td><td>Da bò thật nguyên miếng, thuộc da chuẩn Ý</td></tr>
                    <tr><td>Bảo hành</td><td>Trọn đời sản phẩm</td></tr>
                    <tr><td>Xuất xứ</td><td>Sản xuất tại Việt Nam</td></tr>
                    <tr><td>Tình trạng</td><td>{product.in_stock ? 'Còn hàng' : 'Tạm hết hàng'}</td></tr>
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === 'review' && (
              <div className="ts-tab-panel active" role="tabpanel">
                <p style={{ fontSize: '14.5px', fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.85, maxWidth: 720 }}>
                  Đánh giá trung bình {product.rating.toFixed(1)}/5 sao từ khách hàng đã mua sản phẩm này.
                </p>
              </div>
            )}
          </div>

          {relatedItems.length > 0 && (
            <div style={{ marginTop: 96 }}>
              <div className="ts-sec-head" data-reveal>
                <div className="ts-eyebrow">Có thể bạn thích</div>
                <h2 className="ts-sec-title">Sản phẩm <em>liên quan</em></h2>
              </div>
              <div className="ts-products-grid">
                {relatedItems.map(p => (
                  <Link to={`/san-pham/${p.slug}`} className="ts-card" data-reveal key={p.id}>
                    <div className="ts-card-media">
                      {p.badge && <span className={`ts-card-tag${p.price_sale ? ' sale' : ''}`}>{p.badge}</span>}
                      <button type="button" className="ts-card-wish" aria-label="Thêm vào yêu thích" onClick={e => e.preventDefault()}><i className="bi bi-heart" /></button>
                      <img src={p.image} alt={p.name} loading="lazy" />
                    </div>
                    <span className="ts-card-cat">{p.category_name}</span>
                    <h3 className="ts-card-name">{p.name}</h3>
                    <div className="ts-card-price">
                      {fmt(p.price_sale || p.price)}
                      {!!p.price_sale && <del>{fmt(p.price)}</del>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
