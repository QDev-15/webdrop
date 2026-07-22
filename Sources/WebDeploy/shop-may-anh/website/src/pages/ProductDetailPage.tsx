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

function parseList(v: string): string[] {
  return v.split('|').map(s => s.trim()).filter(Boolean)
}

function parseSpecs(specs: string): { label: string; value: string }[] {
  return specs.split('|').filter(Boolean).map(s => {
    const [label, ...rest] = s.split(':')
    return { label: label?.trim() ?? '', value: rest.join(':').trim() }
  })
}

export default function ProductDetailPage() {
  const { slug } = useParams()
  const { products, settings } = useSite()
  const { addItem } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedBundle, setSelectedBundle] = useState('')
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState<'mota' | 'thongso' | 'danhgia'>('mota')
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    api.get<Product>(`/public/products/${slug}`)
      .then(p => {
        setProduct(p)
        setMainImage(p.image)
        const colors = parseColors(p.colors)
        setSelectedColor(colors[0]?.name ?? '')
        const bundles = parseList(p.bundle_options)
        setSelectedBundle(bundles[0] ?? '')
        setQty(1)
        setTab('mota')
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [slug])

  useDocumentMeta({
    title: product ? `${product.name} — PhotoPro` : 'PhotoPro',
    description: product?.description ? product.description.slice(0, 155) : undefined,
  })

  if (loading) {
    return <div style={{ padding: '180px 0 80px', textAlign: 'center', color: 'var(--text-3)' }}>Đang tải sản phẩm...</div>
  }
  if (!product) {
    return (
      <div style={{ padding: '180px 0 80px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-3)', marginBottom: 20 }}>Không tìm thấy sản phẩm.</p>
        <Link to="/san-pham" className="ma-btn ma-btn-primary">Quay lại danh sách sản phẩm</Link>
      </div>
    )
  }

  const gallery = [product.image, ...parseList(product.gallery)]
  const colors = parseColors(product.colors)
  const bundles = parseList(product.bundle_options)
  const specs = parseSpecs(product.specs)
  const returnDays = settings['return_days'] || '7'
  const related = products.filter(p => p.id !== product.id && p.category_id === product.category_id).slice(0, 4)

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: product.price_sale || product.price,
      color: selectedColor || undefined,
      size: selectedBundle || undefined,
    }, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <>
      <div className="ma-container ma-detail-wrap">
        <div className="ma-breadcrumb ma-on-light" style={{ marginBottom: 32 }}>
          <Link to="/">Trang chủ</Link><i className="bi bi-chevron-right" style={{ fontSize: 10 }} />
          <Link to="/san-pham">Sản phẩm</Link><i className="bi bi-chevron-right" style={{ fontSize: 10 }} />
          <span>{product.name}</span>
        </div>

        <div className="ma-detail-grid">
          <div>
            <div className="ma-gallery-main">
              <img src={mainImage} alt={`${product.name} — ảnh chính`} loading="eager" />
            </div>
            {gallery.length > 1 && (
              <div className="ma-gallery-thumbs">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    className={'ma-thumb' + (img === mainImage ? ' ma-active' : '')}
                    aria-label={`Xem ảnh ${i + 1}`}
                    onClick={() => setMainImage(img)}
                  >
                    <img src={img} alt={`${product.name} — ảnh góc ${i + 1}`} loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="ma-detail-info">
            <div className="ma-detail-badges">
              <span className="ma-detail-badge"><i className="bi bi-patch-check-fill" /> Chính hãng</span>
              <span className="ma-detail-badge"><i className="bi bi-shield-check" /> Bảo hành {settings['warranty_months'] || '24'} tháng</span>
            </div>
            <h1 className="ma-detail-name">{product.name}</h1>
            <div className="ma-detail-rating">
              <span className="ma-stars">
                {Array.from({ length: 5 }).map((_, idx) => <i key={idx} className={idx < Math.round(product.rating) ? 'bi bi-star-fill' : 'bi bi-star'} />)}
              </span>
              <span>{product.rating} ({product.review_count} đánh giá)</span>
              {product.sold_count > 0 && <><span>·</span><span>Đã bán {product.sold_count}+</span></>}
            </div>
            <div className="ma-detail-price">
              <span className="ma-d-price-now">{fmt(product.price_sale || product.price)}</span>
              {!!product.price_sale && <span className="ma-d-price-old">{fmt(product.price)}</span>}
            </div>
            <p className="ma-detail-desc">{product.description}</p>

            {colors.length > 0 && (
              <>
                <div className="ma-variant-label">Màu thân máy</div>
                <div className="ma-color-swatches" role="group" aria-label="Chọn màu thân máy">
                  {colors.map(c => (
                    <button
                      key={c.name}
                      type="button"
                      className={'ma-color-swatch' + (selectedColor === c.name ? ' ma-selected' : '')}
                      style={{ background: c.hex }}
                      aria-label={`Màu ${c.name}`}
                      aria-pressed={selectedColor === c.name}
                      onClick={() => setSelectedColor(c.name)}
                    />
                  ))}
                </div>
              </>
            )}

            {bundles.length > 0 && (
              <>
                <div className="ma-variant-label">Gói phụ kiện</div>
                <div className="ma-bundle-chips" role="group" aria-label="Chọn gói phụ kiện">
                  {bundles.map(b => (
                    <button
                      key={b}
                      type="button"
                      className={'ma-bundle-chip' + (selectedBundle === b ? ' ma-selected' : '')}
                      aria-pressed={selectedBundle === b}
                      onClick={() => setSelectedBundle(b)}
                    >{b}</button>
                  ))}
                </div>
              </>
            )}

            <div className="ma-qty-add">
              <div className="ma-qty">
                <button type="button" aria-label="Giảm số lượng" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <input type="number" value={qty} min={1} max={10} readOnly aria-label="Số lượng" />
                <button type="button" aria-label="Tăng số lượng" onClick={() => setQty(q => Math.min(10, q + 1))}>+</button>
              </div>
              <button type="button" className="ma-btn ma-btn-primary ma-btn-cart-full" onClick={handleAddToCart} disabled={!product.in_stock}>
                <i className={added ? 'bi bi-check-circle-fill' : 'bi bi-bag-plus'} /> {added ? 'Đã thêm vào giỏ' : product.in_stock ? 'Thêm vào giỏ' : 'Hết hàng'}
              </button>
              <button type="button" className="ma-btn-wishlist" aria-label="Yêu thích"><i className="bi bi-heart" /></button>
            </div>

            <ul className="ma-trust-list">
              <li><i className="bi bi-shield-check" /> Bảo hành chính hãng {settings['warranty_months'] || '24'} tháng tại trung tâm ủy quyền</li>
              <li><i className="bi bi-arrow-counterclockwise" /> Đổi trả trong {returnDays} ngày nếu lỗi nhà sản xuất</li>
              <li><i className="bi bi-truck" /> Giao hàng toàn quốc, kiểm tra máy trước khi thanh toán</li>
            </ul>
          </div>
        </div>

        <div className="ma-tabs">
          <div className="ma-tab-nav" role="tablist" aria-label="Thông tin sản phẩm">
            <button className={'ma-tab-btn' + (tab === 'mota' ? ' ma-active' : '')} role="tab" aria-selected={tab === 'mota'} onClick={() => setTab('mota')}>Mô tả</button>
            {specs.length > 0 && <button className={'ma-tab-btn' + (tab === 'thongso' ? ' ma-active' : '')} role="tab" aria-selected={tab === 'thongso'} onClick={() => setTab('thongso')}>Thông số kỹ thuật</button>}
            <button className={'ma-tab-btn' + (tab === 'danhgia' ? ' ma-active' : '')} role="tab" aria-selected={tab === 'danhgia'} onClick={() => setTab('danhgia')}>Đánh giá ({product.review_count})</button>
          </div>

          {tab === 'mota' && (
            <div className="ma-tab-panel ma-active">
              <p style={{ color: 'var(--text-2)', lineHeight: 1.8, maxWidth: 760 }}>{product.description}</p>
            </div>
          )}
          {tab === 'thongso' && specs.length > 0 && (
            <div className="ma-tab-panel ma-active">
              <table className="ma-specs-table">
                <tbody>
                  {specs.map(s => <tr key={s.label}><td>{s.label}</td><td>{s.value}</td></tr>)}
                </tbody>
              </table>
            </div>
          )}
          {tab === 'danhgia' && (
            <div className="ma-tab-panel ma-active">
              <p style={{ color: 'var(--text-2)', fontSize: 14 }}>
                {product.review_count > 0
                  ? `${product.review_count} đánh giá — trung bình ${product.rating}/5 sao.`
                  : 'Sản phẩm chưa có đánh giá nào.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="ma-related">
          <div className="ma-container">
            <div className="ma-sec-header" data-reveal>
              <div className="ma-eyebrow"><i className="bi bi-grid" /> Có thể bạn thích</div>
              <h2 className="ma-sec-title">Sản phẩm <em>liên quan</em></h2>
            </div>
            <div className="ma-related-grid">
              {related.map(p => (
                <Link to={`/san-pham/${p.slug}`} className="ma-prod-card" key={p.id}>
                  <div className="ma-prod-thumb">
                    {p.badge && <span className={'ma-prod-badge ' + (p.price_sale ? 'ma-prod-badge-sale' : p.is_new ? 'ma-prod-badge-new' : 'ma-prod-badge-hot')}>{p.badge}</span>}
                    <img src={p.image} alt={p.name} loading="lazy" />
                  </div>
                  <div className="ma-prod-info">
                    <div className="ma-prod-cat">{p.category_name}</div>
                    <div className="ma-prod-name">{p.name}</div>
                    <div className="ma-prod-footer"><div className="ma-prod-price"><span className="ma-price-now">{fmt(p.price_sale || p.price)}</span></div></div>
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
