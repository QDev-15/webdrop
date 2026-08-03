import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useCart } from '../contexts/CartContext'
import { useSite, type Product } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

function fmt(n: number) {
  return n.toLocaleString('vi-VN') + 'đ'
}

function parseColors(colors: string): { name: string; hex: string }[] {
  return colors.split('|').filter(Boolean).map(c => {
    const [name, hex] = c.split(':')
    return { name: name?.trim() ?? '', hex: hex?.trim() ?? '#ccc' }
  })
}

function parseConfigs(configOptions: string): string[] {
  return configOptions.split('|').map(c => c.trim()).filter(Boolean)
}

function parseSpecs(specs: string): { label: string; value: string }[] {
  return specs.split('|').filter(Boolean).map(s => {
    const [label, ...rest] = s.split(':')
    return { label: label?.trim() ?? '', value: rest.join(':').trim() }
  })
}

export default function ProductDetailPage() {
  const { slug } = useParams()
  const { products } = useSite()
  const { addItem } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState('')
  const [selectedConfig, setSelectedConfig] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState<'desc' | 'spec' | 'review'>('desc')
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    api.get<Product>(`/public/products/${slug}`)
      .then(p => {
        setProduct(p)
        setMainImage(p.image)
        const configs = parseConfigs(p.config_options)
        setSelectedConfig(configs[0] ?? '')
        const colors = parseColors(p.colors)
        setSelectedColor(colors[0]?.name ?? '')
        setQty(1)
        setTab('desc')
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [slug])

  useDocumentMeta({
    title: product ? `${product.name} — NovaTech` : 'NovaTech',
    description: product?.description ? product.description.slice(0, 155) : undefined,
  })

  if (loading) {
    return <div style={{ padding: '180px 0 80px', textAlign: 'center', color: 'var(--text-3)' }}>Đang tải sản phẩm...</div>
  }
  if (!product) {
    return (
      <div style={{ padding: '180px 0 80px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-3)', marginBottom: 20 }}>Không tìm thấy sản phẩm.</p>
        <Link to="/san-pham" className="mt-btn mt-btn-primary">Quay lại danh sách sản phẩm</Link>
      </div>
    )
  }

  const gallery = [product.image, ...(product.gallery ? product.gallery.split('|').filter(Boolean) : [])].filter(Boolean)
  const colors = parseColors(product.colors)
  const configs = parseConfigs(product.config_options)
  const specs = parseSpecs(product.specs)
  const related = products.filter(p => p.id !== product.id && p.category_id === product.category_id).slice(0, 4)

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: product.price_sale || product.price,
      color: selectedColor || undefined,
      size: selectedConfig || undefined,
    }, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <main>
      <div className="mt-container">
        <nav className="mt-breadcrumb" style={{ marginTop: 150 }} aria-label="Breadcrumb">
          <Link to="/">Trang chủ</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span>
          <Link to="/san-pham">Sản phẩm</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span>
          <span>{product.name}</span>
        </nav>

        <div className="mt-detail-layout">
          <div data-reveal>
            <div className="mt-gallery-main">
              <img src={mainImage} alt={`${product.name} — ảnh chính`} loading="eager" />
            </div>
            {gallery.length > 1 && (
              <div className="mt-gallery-thumbs">
                {gallery.map((img, i) => (
                  <div key={i} className={'mt-gallery-thumb' + (img === mainImage ? ' active' : '')} onClick={() => setMainImage(img)}>
                    <img src={img} alt={`${product.name} — ảnh góc ${i + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div data-reveal data-delay="1">
            <div className="mt-detail-cat">{product.category_name}</div>
            <h1 className="mt-detail-title">{product.name}</h1>
            <div className="mt-detail-rating">
              <span style={{ color: 'var(--amber)' }}>{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
              <span>{product.rating}/5 ({product.review_count} đánh giá)</span>
              <span>·</span>
              <span style={{ color: product.in_stock ? 'var(--accent)' : 'var(--danger)' }}>{product.in_stock ? 'Còn hàng' : 'Hết hàng'}</span>
            </div>
            <div className="mt-detail-price">
              <span className="mt-detail-price-new">{fmt(product.price_sale || product.price)}</span>
              {!!product.price_sale && <span className="mt-detail-price-old">{fmt(product.price)}</span>}
            </div>
            <p className="mt-detail-desc">{product.description}</p>

            {configs.length > 0 && (
              <div className="mt-option-block">
                <div className="mt-option-label"><span>Cấu hình RAM / Ổ cứng</span><span style={{ fontWeight: 400, color: 'var(--text-3)' }}>{selectedConfig}</span></div>
                <div className="mt-config-swatches">
                  {configs.map(c => (
                    <div
                      key={c}
                      className={'mt-config-swatch' + (selectedConfig === c ? ' selected' : '')}
                      tabIndex={0} role="button" aria-pressed={selectedConfig === c}
                      onClick={() => setSelectedConfig(c)}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedConfig(c) } }}
                    >{c}</div>
                  ))}
                </div>
              </div>
            )}

            {colors.length > 0 && (
              <div className="mt-option-block">
                <div className="mt-option-label"><span>Màu sắc / Vỏ case</span><Link to="/lien-he" style={{ color: 'var(--accent)', fontWeight: 400 }}>Xem hướng dẫn chọn case</Link></div>
                <div className="mt-color-swatches">
                  {colors.map(c => (
                    <div
                      key={c.name}
                      className={'mt-color-swatch' + (selectedColor === c.name ? ' selected' : '')}
                      style={{ background: c.hex }}
                      title={c.name}
                      tabIndex={0} role="button" aria-pressed={selectedColor === c.name} aria-label={`Màu ${c.name}`}
                      onClick={() => setSelectedColor(c.name)}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedColor(c.name) } }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-option-block">
              <div className="mt-option-label"><span>Số lượng</span></div>
              <div className="mt-qty-selector">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Giảm số lượng">−</button>
                <input type="number" value={qty} min={1} max={10} readOnly aria-label="Số lượng" />
                <button onClick={() => setQty(q => Math.min(10, q + 1))} aria-label="Tăng số lượng">+</button>
              </div>
            </div>

            <div className="mt-detail-actions">
              <button className="mt-btn mt-btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleAddToCart} disabled={!product.in_stock}>
                <i className={added ? 'bi bi-check-circle-fill' : 'bi bi-bag-plus'} /> {added ? 'Đã thêm vào giỏ' : product.in_stock ? 'Thêm vào giỏ' : 'Hết hàng'}
              </button>
              <button className="mt-btn mt-btn-outline" aria-label="Yêu thích sản phẩm"><i className="bi bi-heart" /></button>
            </div>

            <div className="mt-detail-features">
              <div className="mt-detail-feature"><i className="bi bi-patch-check-fill" /> Bảo hành chính hãng 24 tháng</div>
              <div className="mt-detail-feature"><i className="bi bi-credit-card-2-front" /> Trả góp 0% lãi suất</div>
              <div className="mt-detail-feature"><i className="bi bi-truck" /> Giao hàng & lắp đặt toàn quốc 1–3 ngày</div>
            </div>

            <div className="mt-detail-tabs" role="tablist">
              <button className={'mt-detail-tab' + (tab === 'desc' ? ' active' : '')} onClick={() => setTab('desc')} role="tab" aria-selected={tab === 'desc'}>Mô tả</button>
              {specs.length > 0 && <button className={'mt-detail-tab' + (tab === 'spec' ? ' active' : '')} onClick={() => setTab('spec')} role="tab" aria-selected={tab === 'spec'}>Thông số kỹ thuật</button>}
              <button className={'mt-detail-tab' + (tab === 'review' ? ' active' : '')} onClick={() => setTab('review')} role="tab" aria-selected={tab === 'review'}>Đánh giá ({product.review_count})</button>
            </div>
            {tab === 'desc' && (
              <div style={{ padding: '20px 0', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.8 }}>{product.description}</div>
            )}
            {tab === 'spec' && (
              <div style={{ padding: '20px 0', fontSize: 14, color: 'var(--text-2)', lineHeight: 2 }}>
                {specs.map(s => <div key={s.label}>{s.label}: {s.value}</div>)}
              </div>
            )}
            {tab === 'review' && (
              <div style={{ padding: '20px 0', fontSize: 14, color: 'var(--text-2)' }}>
                {product.review_count} đánh giá — trung bình {product.rating}/5 sao.
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div style={{ margin: '64px 0 80px' }}>
            <div className="mt-eyebrow" data-reveal>Gợi ý thêm</div>
            <h2 className="mt-sec-title" data-reveal data-delay="1">Sản phẩm <strong>liên quan</strong></h2>
            <div className="mt-related-grid" style={{ marginTop: 32 }}>
              {related.map(p => (
                <div className="mt-prod-card" data-reveal key={p.id}>
                  <div className="mt-prod-thumb">
                    <Link to={`/san-pham/${p.slug}`}><img src={p.image} alt={p.name} loading="lazy" /></Link>
                    {p.badge && <div className={'mt-prod-badge' + (p.is_new ? ' new' : p.price_sale ? ' sale' : '')}>{p.badge}</div>}
                  </div>
                  <div className="mt-prod-info">
                    <div className="mt-prod-cat">{p.category_name}</div>
                    <h3 className="mt-prod-name"><Link to={`/san-pham/${p.slug}`}>{p.name}</Link></h3>
                    <div className="mt-prod-footer">
                      <span className="mt-prod-price-new">{fmt(p.price_sale || p.price)}</span>
                      <button
                        className="mt-add-cart"
                        aria-label="Thêm vào giỏ"
                        onClick={() => addItem({ product_id: p.id, name: p.name, slug: p.slug, image: p.image, price: p.price_sale || p.price })}
                      ><i className="bi bi-bag-plus" /></button>
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
