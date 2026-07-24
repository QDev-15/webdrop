import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useSite, type Product } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { fmtPrice, catLabel, parseColor, parsePadded, onImgError } from '../lib/format'
import ProductCard from '../components/ProductCard'

type TabKey = 'desc' | 'care' | 'size-guide'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const { products, settings } = useSite()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [selectedSize, setSelectedSize] = useState('')
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState<TabKey>('desc')
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!slug) return
    setProduct(null)
    setNotFound(false)
    setSelectedSize('')
    setQty(1)
    setActiveTab('desc')
    api.get<Product>(`/public/products/${slug}`)
      .then(p => {
        setProduct(p)
        const sizes = parsePadded(p.sizes)
        setSelectedSize(sizes.includes('M') ? 'M' : sizes[0] || '')
      })
      .catch(() => setNotFound(true))
  }, [slug])

  useDocumentMeta({
    title: product ? `${product.name} — ${settings.site_name || 'AMI Fashion'}` : `Chi tiết sản phẩm — ${settings.site_name || 'AMI Fashion'}`,
    description: product?.description?.slice(0, 155),
  })

  const related = useMemo(
    () => (product ? products.filter(p => p.id !== product.id && p.category_slug === product.category_slug).slice(0, 4) : []),
    [product, products]
  )

  if (notFound) {
    return (
      <main className="am-page-body">
        <div className="am-container" style={{ padding: '120px 0', textAlign: 'center' }}>
          <h1 style={{ marginBottom: 12 }}>Không tìm thấy sản phẩm</h1>
          <Link to="/san-pham" className="am-link-btn">Về trang Sản phẩm →</Link>
        </div>
      </main>
    )
  }

  if (!product) {
    return <main className="am-page-body"><div className="am-container" style={{ padding: '120px 0', textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div></main>
  }

  const color = parseColor(product.colors)
  const sizes = parsePadded(product.sizes)
  const effectivePrice = product.price_sale ?? product.price

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: effectivePrice,
      color: color?.name,
      size: selectedSize,
    }, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    window.location.href = '/gio-hang'
  }

  return (
    <main className="am-page-body">
      <div className="am-container">
        <nav aria-label="Breadcrumb" style={{ padding: '20px 0 0' }}>
          <ol style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--text-3)', listStyle: 'none', padding: 0, margin: 0 }} role="list">
            <li><Link to="/" style={{ color: 'var(--text-3)' }}>Trang chủ</Link></li>
            <li style={{ color: 'var(--border)' }}>/</li>
            <li><Link to="/san-pham" style={{ color: 'var(--text-3)' }}>Sản phẩm</Link></li>
            <li style={{ color: 'var(--border)' }}>/</li>
            <li style={{ color: 'var(--text-2)' }}>{product.name}</li>
          </ol>
        </nav>

        <div className="am-detail-wrap">
          <div className="row g-5">
            <div className="col-lg-6">
              <div className="am-detail-gallery">
                <div className="am-thumb-list">
                  <div className="am-thumb active">
                    <img src={product.image} alt={product.name} onError={onImgError} />
                  </div>
                </div>
                <div className="am-main-img-wrap">
                  <img src={product.image} alt={product.name} onError={onImgError} />
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="am-detail-info">
                <p className="am-detail-cat">{catLabel(product.category_slug)}</p>
                <h1 className="am-detail-name">{product.name}</h1>

                <div className="am-detail-price">
                  {product.price_sale ? (
                    <>
                      <span className="am-price am-price-sale">{fmtPrice(product.price_sale)}</span>
                      <span className="am-price-orig">{fmtPrice(product.price)}</span>
                    </>
                  ) : (
                    <span className="am-price">{fmtPrice(product.price)}</span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <span style={{ color: '#f59e0b', fontSize: 13 }}>{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{product.rating} · {product.sold} đã bán</span>
                </div>

                <hr className="am-detail-divider" />

                {color && (
                  <>
                    <span className="am-option-label">Màu sắc: <span style={{ color: 'var(--text)', textTransform: 'none', letterSpacing: 0 }}>{color.name}</span></span>
                    <div className="am-color-opts">
                      <button className="am-color-opt active" type="button" style={{ background: color.hex }} title={color.name}></button>
                    </div>
                  </>
                )}

                {sizes.length > 0 && (
                  <>
                    <span className="am-option-label">Size: <span style={{ color: 'var(--text)', textTransform: 'none', letterSpacing: 0 }}>{selectedSize}</span></span>
                    <div className="am-size-opts">
                      {sizes.map(s => (
                        <button
                          key={s}
                          className={'am-size-opt' + (s === selectedSize ? ' active' : '')}
                          type="button"
                          onClick={() => setSelectedSize(s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <span className="am-option-label" style={{ marginBottom: 10 }}>Số lượng</span>
                <div className="am-qty-wrap mb-4">
                  <button className="am-qty-btn" type="button" aria-label="Giảm số lượng" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <input type="number" className="am-qty-val" value={qty} min={1} max={99} aria-label="Số lượng" onChange={e => setQty(Math.max(1, Math.min(99, Number(e.target.value) || 1)))} />
                  <button className="am-qty-btn" type="button" aria-label="Tăng số lượng" onClick={() => setQty(q => Math.min(99, q + 1))}>+</button>
                </div>

                <button className="am-btn-primary" type="button" onClick={handleAddToCart}>
                  {added ? 'Đã thêm vào giỏ ✓' : 'Thêm vào giỏ hàng'}
                </button>
                <button className="am-btn-outline" type="button" onClick={handleBuyNow}>Mua ngay</button>

                <p className="am-trust-inline">Hàng chính hãng AMI</p>
                <p className="am-trust-inline">Đổi trả trong {settings.return_days || '30'} ngày</p>
                <p className="am-trust-inline">Bảo hành chất liệu {settings.warranty_months || '6'} tháng</p>
              </div>
            </div>
          </div>

          <div className="am-detail-tabs" data-reveal>
            <div className="am-tab-btns" role="tablist">
              <button className={'am-tab-btn' + (activeTab === 'desc' ? ' active' : '')} role="tab" aria-selected={activeTab === 'desc'} type="button" onClick={() => setActiveTab('desc')}>Mô tả</button>
              <button className={'am-tab-btn' + (activeTab === 'care' ? ' active' : '')} role="tab" aria-selected={activeTab === 'care'} type="button" onClick={() => setActiveTab('care')}>Hướng dẫn bảo quản</button>
              <button className={'am-tab-btn' + (activeTab === 'size-guide' ? ' active' : '')} role="tab" aria-selected={activeTab === 'size-guide'} type="button" onClick={() => setActiveTab('size-guide')}>Bảng size</button>
            </div>
            <div className={'am-tab-panel' + (activeTab === 'desc' ? ' active' : '')} role="tabpanel">
              <p>{product.description}</p>
            </div>
            <div className={'am-tab-panel' + (activeTab === 'care' ? ' active' : '')} role="tabpanel">
              <p>Giặt máy ở chế độ nhẹ, nhiệt độ không quá 30°C. Không dùng thuốc tẩy. Phơi nơi thoáng mát, tránh ánh nắng trực tiếp. Ủi ở nhiệt độ thấp.</p>
            </div>
            <div className={'am-tab-panel' + (activeTab === 'size-guide' ? ' active' : '')} role="tabpanel">
              <table className="table table-sm" style={{ fontSize: 13, fontWeight: 300, maxWidth: 480 }}>
                <thead>
                  <tr style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--text-3)' }}>
                    <th style={{ fontWeight: 400, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>Size</th>
                    <th style={{ fontWeight: 400, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>Ngực (cm)</th>
                    <th style={{ fontWeight: 400, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>Eo (cm)</th>
                    <th style={{ fontWeight: 400, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>Hông (cm)</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'var(--text-2)' }}>
                  <tr><td>XS</td><td>80–84</td><td>62–66</td><td>86–90</td></tr>
                  <tr><td>S</td><td>84–88</td><td>66–70</td><td>90–94</td></tr>
                  <tr><td>M</td><td>88–92</td><td>70–74</td><td>94–98</td></tr>
                  <tr><td>L</td><td>92–96</td><td>74–78</td><td>98–102</td></tr>
                  <tr><td>XL</td><td>96–100</td><td>78–82</td><td>102–106</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="am-sec" aria-labelledby="related-heading" data-reveal>
            <div className="am-sec-head" style={{ marginBottom: 24 }}>
              <div>
                <span className="am-eyebrow">Có thể bạn thích</span>
                <h2 className="am-sec-title" id="related-heading"><em>Sản phẩm liên quan</em></h2>
              </div>
            </div>
            <div className="am-prod-grid am-prod-grid-4" role="list">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
