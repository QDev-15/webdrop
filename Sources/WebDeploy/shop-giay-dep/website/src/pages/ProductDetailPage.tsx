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
  const [activeImg, setActiveImg] = useState(0)
  const [added, setAdded] = useState(false)

  useDocumentMeta({
    title: product ? `${product.name} — Volt Kicks` : 'Volt Kicks',
    description: product?.description ? product.description.slice(0, 155) : undefined,
  })

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setNotFound(false)
    setActiveImg(0)
    setActiveTab('desc')
    setQty(1)
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

  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'

  if (loading) {
    return <div style={{ paddingTop: 180, textAlign: 'center', color: 'var(--text-3)', minHeight: '50vh' }}>Đang tải sản phẩm...</div>
  }
  if (notFound || !product) {
    return (
      <div style={{ paddingTop: 180, textAlign: 'center', color: 'var(--text-3)', minHeight: '50vh' }}>
        <p>Không tìm thấy sản phẩm</p>
        <Link to="/san-pham" className="gd-btn gd-btn-outline" style={{ marginTop: 24, display: 'inline-flex' }}>← Quay lại</Link>
      </div>
    )
  }

  const colorOptions = parseColors(product.colors)
  const sizeOptions = parseSizes(product.sizes)
  const galleryExtra: string[] = (() => {
    if (!product.gallery?.trim()) return []
    try {
      const p = JSON.parse(product.gallery)
      return Array.isArray(p) ? (p as unknown[]).filter((x): x is string => typeof x === 'string' && x.trim() !== '') : []
    } catch { return [] }
  })()
  const gallery = [product.image || '', ...galleryExtra].filter(Boolean)
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
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <main>
      <div className="gd-container">
        <nav className="gd-breadcrumb" style={{ marginTop: 150 }} aria-label="Breadcrumb">
          <Link to="/">Trang chủ</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span>
          <Link to="/san-pham">Sản phẩm</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span>
          <span>{product.name}</span>
        </nav>

        <div className="gd-detail-layout">
          <div data-reveal>
            <div className="gd-gallery-main">
              <img src={gallery[activeImg] || product.image} alt={product.name} loading="eager" />
            </div>
            {gallery.length > 1 && (
              <div className="gd-gallery-thumbs">
                {gallery.map((src, i) => (
                  <div key={i} className={`gd-gallery-thumb${activeImg === i ? ' active' : ''}`} onClick={() => setActiveImg(i)}>
                    <img src={src} alt={`${product.name} — ảnh góc ${i + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div data-reveal data-delay="1">
            <div className="gd-detail-cat">{product.category_name}</div>
            <h1 className="gd-detail-title">{product.name}</h1>
            <div className="gd-detail-rating">
              <span style={{ color: 'var(--accent)' }}>{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
              <span>{product.rating.toFixed(1)}/5</span>
              <span>·</span>
              <span style={{ color: product.in_stock ? 'var(--accent)' : 'var(--sale)' }}>{product.in_stock ? 'Còn hàng' : 'Tạm hết hàng'}</span>
            </div>
            <div className="gd-detail-price">
              <span className="gd-detail-price-new">{fmt(product.price_sale || product.price)}</span>
              {!!product.price_sale && <span className="gd-detail-price-old">{fmt(product.price)}</span>}
            </div>
            <p className="gd-detail-desc">{product.description}</p>

            {colorOptions.length > 0 && (
              <div className="gd-option-block">
                <div className="gd-option-label"><span>Màu sắc</span><span style={{ fontWeight: 400, color: 'var(--text-3)' }}>{selectedColor}</span></div>
                <div className="gd-color-swatches">
                  {colorOptions.map(c => (
                    <div
                      key={c.name}
                      className={`gd-color-swatch${selectedColor === c.name ? ' selected' : ''}`}
                      style={{ background: c.hex, borderColor: c.hex === '#ffffff' && selectedColor !== c.name ? 'var(--border)' : undefined }}
                      title={c.name}
                      role="button"
                      tabIndex={0}
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
              <div className="gd-option-block">
                <div className="gd-option-label"><span>Kích cỡ</span><Link to="/lien-he" style={{ color: 'var(--accent)', fontWeight: 400 }}>Hướng dẫn chọn size</Link></div>
                <div className="gd-size-swatches">
                  {sizeOptions.map(s => (
                    <div
                      key={s}
                      className={`gd-size-swatch${selectedSize === s ? ' selected' : ''}`}
                      role="button"
                      tabIndex={0}
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

            <div className="gd-option-block">
              <div className="gd-option-label"><span>Số lượng</span></div>
              <div className="gd-qty-selector">
                <button type="button" onClick={() => setQty(v => Math.max(1, v - 1))} aria-label="Giảm số lượng">−</button>
                <input type="number" value={qty} min={1} max={10} aria-label="Số lượng" onChange={e => setQty(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))} />
                <button type="button" onClick={() => setQty(v => Math.min(10, v + 1))} aria-label="Tăng số lượng">+</button>
              </div>
            </div>

            <div className="gd-detail-actions">
              <button type="button" className="gd-btn gd-btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={!product.in_stock} onClick={handleAddToCart}>
                {added ? <><i className="bi bi-check-circle-fill" /> Đã thêm vào giỏ</> : <><i className="bi bi-bag-plus" /> Thêm vào giỏ</>}
              </button>
              <button type="button" className="gd-btn gd-btn-outline" aria-label="Yêu thích sản phẩm"><i className="bi bi-heart" /></button>
            </div>

            <div className="gd-detail-features">
              <div className="gd-detail-feature"><i className="bi bi-patch-check-fill" /> Hàng chính hãng 100%</div>
              <div className="gd-detail-feature"><i className="bi bi-arrow-repeat" /> Đổi size miễn phí trong 15 ngày</div>
              <div className="gd-detail-feature"><i className="bi bi-truck" /> Giao hàng toàn quốc 1–3 ngày</div>
            </div>

            <div className="gd-detail-tabs" role="tablist">
              <button className={`gd-detail-tab${activeTab === 'desc' ? ' active' : ''}`} onClick={() => setActiveTab('desc')} role="tab" aria-selected={activeTab === 'desc'}>Mô tả</button>
              <button className={`gd-detail-tab${activeTab === 'spec' ? ' active' : ''}`} onClick={() => setActiveTab('spec')} role="tab" aria-selected={activeTab === 'spec'}>Thông số</button>
              <button className={`gd-detail-tab${activeTab === 'review' ? ' active' : ''}`} onClick={() => setActiveTab('review')} role="tab" aria-selected={activeTab === 'review'}>Đánh giá</button>
            </div>
            {activeTab === 'desc' && (
              <div role="tabpanel" style={{ padding: '20px 0', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.8 }}>
                {product.description}
              </div>
            )}
            {activeTab === 'spec' && (
              <div role="tabpanel" style={{ padding: '20px 0', fontSize: 14, color: 'var(--text-2)', lineHeight: 2 }}>
                <div>Danh mục: {product.category_name}</div>
                {colorOptions.length > 0 && <div>Màu sắc: {colorOptions.map(c => c.name).join(' / ')}</div>}
                {sizeOptions.length > 0 && <div>Kích cỡ: {sizeOptions.join(' / ')}</div>}
                <div>Tình trạng: {product.in_stock ? 'Còn hàng' : 'Tạm hết hàng'}</div>
                <div>Xuất xứ: Việt Nam</div>
              </div>
            )}
            {activeTab === 'review' && (
              <div role="tabpanel" style={{ padding: '20px 0', fontSize: 14, color: 'var(--text-2)' }}>
                Đánh giá trung bình {product.rating.toFixed(1)}/5 sao từ khách hàng đã mua sản phẩm này.
              </div>
            )}
          </div>
        </div>

        {relatedItems.length > 0 && (
          <div style={{ margin: '64px 0 80px' }}>
            <div className="gd-eyebrow" data-reveal>Gợi ý thêm</div>
            <h2 className="gd-sec-title" data-reveal data-delay="1">Sản phẩm <em>liên quan</em></h2>
            <div className="gd-related-grid" style={{ marginTop: 32 }}>
              {relatedItems.map((p, i) => (
                <div className="gd-prod-card" data-reveal data-delay={String((i % 4) + 1)} key={p.id}>
                  <div className="gd-prod-thumb">
                    <Link to={`/san-pham/${p.slug}`}><img src={p.image} alt={p.name} loading="lazy" /></Link>
                    {p.badge && <div className={`gd-prod-badge${p.is_new ? ' new' : p.price_sale ? ' sale' : ''}`}>{p.badge}</div>}
                  </div>
                  <div className="gd-prod-info">
                    <div className="gd-prod-cat">{p.category_name}</div>
                    <h3 className="gd-prod-name"><Link to={`/san-pham/${p.slug}`}>{p.name}</Link></h3>
                    <div className="gd-prod-footer">
                      <span className="gd-prod-price-new">{fmt(p.price_sale || p.price)}</span>
                      <button
                        className="gd-add-cart"
                        aria-label="Thêm vào giỏ"
                        disabled={!p.in_stock}
                        onClick={() => addItem({ product_id: p.id, name: p.name, slug: p.slug, image: p.image, price: p.price_sale || p.price })}
                      >
                        <i className="bi bi-bag-plus" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
