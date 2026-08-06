import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSite, parseColorPairs } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { products, categories } = useSite()
  const { addItem } = useCart()

  const product = products.find((p: typeof products[0]) => p.slug === slug)
  const productColors = parseColorPairs(product?.colors)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [qty, setQty] = useState(1)
  const [mainImg, setMainImg] = useState(product?.image || '')
  const [added, setAdded] = useState(false)

  // Mặc định chọn màu đầu tiên khi dữ liệu sản phẩm tải xong (products fetch async trong SiteContext)
  useEffect(() => {
    if (productColors.length && !selectedColor) {
      setSelectedColor(productColors[0].name)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.slug, productColors.length])

  useDocumentMeta({
    title: product?.name || 'Chi tiết sản phẩm',
    description: product?.name || 'Sản phẩm chất lượng cao'
  })

  if (!product) {
    return (
      <div className="tt-page-wrap">
        <div className="tt-container" style={{ padding: '80px 0', textAlign: 'center' }}>
          <h1>Không tìm thấy sản phẩm</h1>
          <p style={{ marginBottom: 20 }}>Sản phẩm bạn tìm kiếm không tồn tại</p>
          <Link to="/" className="tt-btn-primary">Quay lại trang chủ</Link>
        </div>
      </div>
    )
  }

  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'
  const price = product.price_sale || product.price
  const discount = product.price_sale ? Math.round((1 - product.price_sale / product.price) * 100) : 0

  const handleAddCart = () => {
    if (product.sizes && !selectedSize) {
      alert('Vui lòng chọn size')
      return
    }
    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: price,
      color: selectedColor || undefined,
      size: selectedSize || undefined,
    }, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="tt-page-wrap">
      {/* Breadcrumb */}
      <div className="tt-breadcrumb">
        <div className="tt-container">
          <Link to="/">Trang chủ</Link>
          <span className="tt-bc-sep">/</span>
          <span>{product.name}</span>
        </div>
      </div>

      <main className="tt-sec-sm">
        <div className="tt-container">
          <div className="tt-pd-grid">
            {/* Gallery column */}
            <div className="tt-pd-gallery">
              <div className="tt-pd-main-img">
                <img src={mainImg || product.image} alt={product.name} onError={(e) => (e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22600%22%3E%3Crect width=%22800%22 height=%22600%22 fill=%22%231c1c22%22/%3E%3C/svg%3E')} />
                {product.price_sale && <span className="tt-badge tt-badge-sale">Sale</span>}
              </div>
              <div className="tt-pd-thumbs">
                <button
                  className="tt-thumb active"
                  onClick={() => setMainImg(product.image)}
                  style={{ borderRadius: 6, border: '2px solid var(--accent)', overflow: 'hidden' }}
                >
                  <img src={product.image} alt="Ảnh 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              </div>
            </div>

            {/* Info column */}
            <div className="tt-pd-info">
              {product.category_slug && (
                <div className="tt-prod-cat" style={{ marginBottom: 8 }}>
                  {categories.find(c => c.slug === product.category_slug)?.name || product.category_slug}{product.brand ? ` · ${product.brand}` : ''}
                </div>
              )}

              <h1 className="tt-pd-title">{product.name}</h1>

              <div className="tt-pd-rating-row">
                <span className="tt-stars">{'★'.repeat(Math.round(product.rating || 0))}</span>
                <span style={{ color: 'var(--text-2)', fontSize: 13 }}>{(product.rating || 0).toFixed(1)} · {product.sold || 0} đã bán</span>
              </div>

              <div className="tt-pd-price-row">
                <span className="tt-price sale" style={{ fontSize: 28 }}>
                  {fmt(price)}
                </span>
                {product.price_sale && (
                  <>
                    <span className="tt-price-orig" style={{ fontSize: 18 }}>
                      {fmt(product.price)}
                    </span>
                    <span className="tt-badge tt-badge-sale" style={{ position: 'static', display: 'inline-flex' }}>
                      -{discount}%
                    </span>
                  </>
                )}
              </div>

              {/* Size selector */}
              {product.sizes && (
                <div className="tt-pd-option-group">
                  <div className="tt-pd-option-label">
                    Size <span style={{ color: 'var(--accent)', fontSize: 13 }} id="ttSelectedSize">— Chưa chọn</span>
                  </div>
                  <div className="tt-pd-size-row" id="ttSizeRow">
                    {product.sizes.split('|').filter(Boolean).map((size: string) => (
                      <button
                        key={size}
                        className={`tt-size-btn${selectedSize === size ? ' active' : ''}`}
                        data-size={size}
                        onClick={() => {
                          setSelectedSize(size)
                          document.getElementById('ttSelectedSize')!.textContent = '— Size ' + size
                        }}
                        style={{
                          padding: '8px 14px',
                          border: `1px solid ${selectedSize === size ? 'var(--accent)' : 'var(--border)'}`,
                          background: selectedSize === size ? 'var(--accent-light)' : 'white',
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontSize: 13,
                          fontWeight: 500,
                          transition: 'all .2s',
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color selector */}
              {productColors.length > 0 && (
                <div className="tt-pd-option-group">
                  <div className="tt-pd-option-label">
                    Màu sắc <span style={{ color: 'var(--accent)', fontSize: 13 }}>{selectedColor ? `— ${selectedColor}` : '— Chưa chọn'}</span>
                  </div>
                  <div className="tt-pd-color-row">
                    {productColors.map(c => (
                      <button
                        key={c.name}
                        className={`tt-color-dot${selectedColor === c.name ? ' active' : ''}`}
                        data-color={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        style={{ background: c.hex }}
                        title={c.name}
                        aria-label={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Qty and buttons */}
              <div className="tt-pd-qty-row">
                <div className="tt-qty-ctrl" style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
                  <button
                    id="ttQtyMinus"
                    aria-label="Giảm số lượng"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid var(--border)',
                      background: 'white',
                      borderRadius: 6,
                      cursor: 'pointer',
                    }}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    id="ttQtyInput"
                    value={qty}
                    onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max="99"
                    readOnly
                    style={{
                      width: 60,
                      padding: '8px',
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      textAlign: 'center',
                    }}
                  />
                  <button
                    id="ttQtyPlus"
                    aria-label="Tăng số lượng"
                    onClick={() => setQty(qty + 1)}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid var(--border)',
                      background: 'white',
                      borderRadius: 6,
                      cursor: 'pointer',
                    }}
                  >
                    +
                  </button>
                </div>
                <button
                  className="tt-btn-add-main"
                  id="ttAddToCartBtn"
                  onClick={handleAddCart}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    background: 'var(--accent)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginBottom: 12,
                    transition: 'all .2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {added ? '✓ Đã thêm vào giỏ' : `Thêm vào giỏ`}
                </button>
                <Link
                  to="/gio-hang"
                  className="tt-btn-buy-now"
                  id="ttBuyNowBtn"
                  style={{
                    width: '100%',
                    display: 'block',
                    padding: '14px 20px',
                    background: 'transparent',
                    color: 'var(--accent)',
                    border: '2px solid var(--accent)',
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'center',
                    textDecoration: 'none',
                    transition: 'all .2s',
                  }}
                  onClick={handleAddCart}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-light)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  Mua ngay →
                </Link>
              </div>

              {/* Trust badges */}
              <div className="tt-pd-trust" style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="tt-trust-item" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18"><path d="M12 2L3 7l9 5 9-5-9-5z" /><path d="M3 17l9 5 9-5" /><path d="M3 12l9 5 9-5" /></svg>
                  <span>Hàng chính hãng 100%</span>
                </div>
                <div className="tt-trust-item" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
                  <span>Đổi size miễn phí 30 ngày</span>
                </div>
                <div className="tt-trust-item" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  <span>Bảo hành 12 tháng</span>
                </div>
                <div className="tt-trust-item" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18"><path d="M5 12h14" /><path d="m12 5l7 7-7 7" /></svg>
                  <span>Giao nhanh 2–4 giờ nội thành</span>
                </div>
              </div>

              {/* Short description */}
              <div className="tt-pd-short-desc" style={{ marginTop: 20, padding: '20px', background: 'var(--warm)', borderRadius: 8 }}>
                <p>Sản phẩm chất lượng cao từ nhà sản xuất chính hãng, được kiểm định kỹ lưỡng trước khi gửi đến tay bạn.</p>
              </div>
            </div>
          </div>

          {/* Tabs section */}
          <div className="tt-pd-tabs" style={{ marginTop: 60, paddingTop: 40, borderTop: '1px solid var(--border)' }} data-reveal>
            <div className="tt-pd-tab-nav" style={{ display: 'flex', gap: 20, marginBottom: 32, borderBottom: '1px solid var(--border)' }}>
              <button
                className="tt-pd-tab-btn active"
                data-tab="mo-ta"
                onClick={(e) => {
                  document.querySelectorAll('.tt-pd-tab-btn').forEach(b => b.classList.remove('active'))
                  document.querySelectorAll('.tt-pd-tab-content').forEach(c => ((c as HTMLElement).style.display = 'none'))
                  e.currentTarget.classList.add('active')
                  document.getElementById('tab-mo-ta')!.style.display = 'block'
                }}
                style={{
                  padding: '12px 0',
                  border: 'none',
                  background: 'transparent',
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderBottom: '2px solid var(--accent)',
                  color: 'var(--accent)',
                }}
              >
                Mô tả sản phẩm
              </button>
              <button
                className="tt-pd-tab-btn"
                data-tab="thong-so"
                onClick={(e) => {
                  document.querySelectorAll('.tt-pd-tab-btn').forEach(b => b.classList.remove('active'))
                  document.querySelectorAll('.tt-pd-tab-content').forEach(c => ((c as HTMLElement).style.display = 'none'))
                  e.currentTarget.classList.add('active')
                  document.getElementById('tab-thong-so')!.style.display = 'block'
                }}
                style={{
                  padding: '12px 0',
                  border: 'none',
                  background: 'transparent',
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: 'var(--text-2)',
                }}
              >
                Thông số kỹ thuật
              </button>
              <button
                className="tt-pd-tab-btn"
                data-tab="danh-gia"
                onClick={(e) => {
                  document.querySelectorAll('.tt-pd-tab-btn').forEach(b => b.classList.remove('active'))
                  document.querySelectorAll('.tt-pd-tab-content').forEach(c => ((c as HTMLElement).style.display = 'none'))
                  e.currentTarget.classList.add('active')
                  document.getElementById('tab-danh-gia')!.style.display = 'block'
                }}
                style={{
                  padding: '12px 0',
                  border: 'none',
                  background: 'transparent',
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: 'var(--text-2)',
                }}
              >
                Đánh giá (12)
              </button>
            </div>
            <div id="tab-mo-ta" className="tt-pd-tab-content" style={{ paddingTop: 20 }}>
              <h3>{product.name} — Chi tiết sản phẩm</h3>
              <p style={{ marginTop: 12 }}>Sản phẩm này có các tính năng nổi bật và được thiết kế để đáp ứng nhu cầu của bạn. Được kiểm định kỹ lưỡng trước khi gửi tới tay bạn.</p>
            </div>
            <div id="tab-thong-so" className="tt-pd-tab-content" style={{ paddingTop: 20, display: 'none' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 0', fontWeight: 600 }}>Danh mục</td>
                    <td style={{ padding: '12px 0' }}>{categories.find(c => c.slug === product.category_slug)?.name || 'Thể thao'}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 0', fontWeight: 600 }}>Kích thước</td>
                    <td style={{ padding: '12px 0' }}>{product.sizes?.split('|').filter(Boolean).join(', ') || 'Đa dạng'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div id="tab-danh-gia" className="tt-pd-tab-content" style={{ paddingTop: 20, display: 'none' }}>
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-2)' }}>
                Chưa có đánh giá. Hãy là người đầu tiên đánh giá sản phẩm này!
              </div>
            </div>
          </div>

          {/* Related products */}
          <div className="tt-pd-related" style={{ marginTop: 60, paddingTop: 40 }} data-reveal>
            <div className="tt-sec-header" style={{ marginBottom: 32 }}>
              <div className="tt-eyebrow">Có thể bạn thích</div>
              <h2 className="tt-sec-title">Sản phẩm liên quan</h2>
            </div>
            <div className="tt-related-grid" id="ttRelatedGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 24 }}>
              {products
                .filter((p: typeof products[0]) => p.category_id === product.category_id && p.id !== product.id)
                .slice(0, 4)
                .map((p: typeof products[0]) => (
                  <Link
                    key={p.id}
                    to={`/san-pham/${p.slug}`}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      borderRadius: 8,
                      overflow: 'hidden',
                      transition: 'all .2s',
                      transform: 'scale(1)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    <div style={{ position: 'relative', paddingBottom: '100%', overflow: 'hidden', borderRadius: 8 }}>
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                    <div style={{ padding: 12 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, lineHeight: 1.4 }}>{p.name}</h3>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>
                        {fmt(p.price_sale || p.price)}
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
