import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useSite, type Product } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { fmt, stars, CATEGORY_LABEL } from '../lib/format'
import ProductCard from '../components/ProductCard'

type Tab = 'mo-ta' | 'thong-so' | 'bao-hanh'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { settings } = useSite()
  const { addItem } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState<Tab>('mo-ta')
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setNotFound(false)
    api.get<Product>(`/public/products/${slug}`)
      .then(p => {
        setProduct(p)
        setQty(1)
        setTab('mo-ta')
        if (!p.category_id) return []
        return api.get<Product[]>(`/public/products?category_ids=${p.category_id}&per_page=5`)
      })
      .then(list => setRelated((list || []).filter(r => r.slug !== slug).slice(0, 4)))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  useDocumentMeta({
    title: product ? `${product.name} — ${settings.site_name || 'OFFICEHUB'}` : `Chi tiết sản phẩm — ${settings.site_name || 'OFFICEHUB'}`,
    description: product ? `${product.name} chính hãng tại ${settings.site_name || 'OFFICEHUB'}. ${product.price_sale ? 'Giá: ' + fmt(product.price_sale) : ''}`.trim() : undefined,
  })

  const handleAddToCart = () => {
    if (!product || product.in_stock !== 1) return
    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: product.price_sale ? product.price_sale : product.price,
    }, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleBuyNow = () => {
    if (!product || product.in_stock !== 1) return
    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: product.price_sale ? product.price_sale : product.price,
    }, qty)
    navigate('/gio-hang')
  }

  if (loading) {
    return <div className="vp-detail-wrap"><div className="vp-container"><div className="vp-empty-state"><p>Đang tải...</p></div></div></div>
  }

  if (notFound || !product) {
    return (
      <div className="vp-detail-wrap">
        <div className="vp-container">
          <div className="vp-empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            <h3>Không tìm thấy sản phẩm</h3>
            <p>Sản phẩm không tồn tại hoặc đã bị xóa.</p>
            <Link to="/" className="vp-btn vp-btn-primary">Về trang chủ</Link>
          </div>
        </div>
      </div>
    )
  }

  const categoryLabel = product.category_name || CATEGORY_LABEL[product.category_slug] || 'Sản phẩm'
  const stock = product.in_stock === 1

  const specs: [string, string][] = [
    ['Thương hiệu', product.brand],
    ['Danh mục', categoryLabel],
    ['Tình trạng', stock ? 'Còn hàng' : 'Hết hàng'],
    ['Đánh giá', `${product.rating}/5`],
    ['Đã bán', `${product.sold.toLocaleString('vi-VN')} sản phẩm`],
    ['Bảo hành', '12 tháng chính hãng'],
  ]

  return (
    <>
      <div className="vp-detail-wrap">
        <div className="vp-container">
          <nav className="vp-breadcrumb" aria-label="Đường dẫn">
            <Link to="/">Trang chủ</Link>
            <span className="vp-breadcrumb-sep" aria-hidden="true">/</span>
            <span>{categoryLabel}</span>
            <span className="vp-breadcrumb-sep" aria-hidden="true">/</span>
            <span>{product.name}</span>
          </nav>

          <div className="vp-detail-grid">
            <div className="vp-detail-gallery">
              <div className="vp-gallery-main">
                <img src={product.image} alt={product.name} />
              </div>
            </div>

            <div className="vp-detail-info">
              <div className="vp-detail-brand">{product.brand}</div>
              <h1 className="vp-detail-name">{product.name}</h1>
              <div className="vp-detail-rating">
                <span className="vp-rating-stars" style={{ color: '#f59e0b' }}>{stars(product.rating)}</span>
                <span>{product.rating}/5 ({product.sold.toLocaleString('vi-VN')} đã bán)</span>
              </div>
              <div className="vp-detail-price">
                <span className={product.price_sale ? 'vp-detail-price-main vp-price-sale' : 'vp-detail-price-main'}>
                  {fmt(product.price_sale ? product.price_sale : product.price)}
                </span>
                {!!product.price_sale && <span className="vp-detail-price-old">{fmt(product.price)}</span>}
              </div>
              <p className="vp-detail-desc">
                Sản phẩm {product.name} chính hãng {product.brand}, được phân phối bởi {settings.site_name || 'OFFICEHUB'} với cam kết chất lượng. Phù hợp cho văn phòng, học sinh, sinh viên và nhu cầu sử dụng hàng ngày.
              </p>

              <div className="vp-detail-option-label">Số lượng</div>
              <div className="vp-qty-wrap">
                <button className="vp-qty-btn" aria-label="Giảm số lượng" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <input type="number" value={qty} min={1} max={99} aria-label="Số lượng" onChange={e => setQty(Math.min(99, Math.max(1, parseInt(e.target.value) || 1)))} />
                <button className="vp-qty-btn" aria-label="Tăng số lượng" onClick={() => setQty(q => Math.min(99, q + 1))}>+</button>
              </div>

              <div className="vp-trust-strip">
                <span>Hàng chính hãng</span>
                <span className="vp-trust-sep">·</span>
                <span>Bảo hành 12 tháng</span>
                <span className="vp-trust-sep">·</span>
                <span>Đổi trả 30 ngày</span>
              </div>

              <div className="vp-detail-actions" style={{ marginTop: 16 }}>
                <button className="vp-btn vp-btn-primary vp-btn-lg" disabled={!stock} onClick={handleAddToCart}>
                  {!stock ? 'Hết hàng' : added ? '✓ Đã thêm vào giỏ' : '+ Thêm vào giỏ hàng'}
                </button>
                <button className="vp-btn vp-btn-dark vp-btn-lg" disabled={!stock} onClick={handleBuyNow}>Mua ngay</button>
              </div>

              <div className="vp-detail-trust">
                <div className="vp-detail-trust-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  <span>Giao hàng miễn phí cho đơn từ {fmt(Number(settings.free_shipping_threshold || 500000))}</span>
                </div>
                <div className="vp-detail-trust-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  <span>Giao hàng trong ngày tại TP.HCM (đặt trước 14:00)</span>
                </div>
                <div className="vp-detail-trust-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>Cam kết hàng chính hãng 100% — hoàn tiền nếu giả</span>
                </div>
              </div>
            </div>
          </div>

          <div className="vp-detail-tabs">
            <div className="vp-tab-list" role="tablist">
              <button className={'vp-tab-btn' + (tab === 'mo-ta' ? ' active' : '')} role="tab" aria-selected={tab === 'mo-ta'} onClick={() => setTab('mo-ta')}>Mô tả</button>
              <button className={'vp-tab-btn' + (tab === 'thong-so' ? ' active' : '')} role="tab" aria-selected={tab === 'thong-so'} onClick={() => setTab('thong-so')}>Thông số kỹ thuật</button>
              <button className={'vp-tab-btn' + (tab === 'bao-hanh' ? ' active' : '')} role="tab" aria-selected={tab === 'bao-hanh'} onClick={() => setTab('bao-hanh')}>Bảo hành & đổi trả</button>
            </div>
            <div className={'vp-tab-panel' + (tab === 'mo-ta' ? ' active' : '')} role="tabpanel">
              <p>{product.description}</p>
            </div>
            <div className={'vp-tab-panel' + (tab === 'thong-so' ? ' active' : '')} role="tabpanel">
              <table className="vp-specs-table">
                <tbody>
                  {specs.map(([k, v]) => <tr key={k}><td>{k}</td><td>{v}</td></tr>)}
                </tbody>
              </table>
            </div>
            <div className={'vp-tab-panel' + (tab === 'bao-hanh' ? ' active' : '')} role="tabpanel">
              <h4 style={{ fontWeight: 700, marginBottom: 10 }}>Chính sách bảo hành</h4>
              <p>Tất cả sản phẩm tại {settings.site_name || 'OFFICEHUB'} được bảo hành <strong>12 tháng</strong> kể từ ngày mua. Trong thời gian bảo hành, chúng tôi hỗ trợ đổi sản phẩm mới cùng loại nếu lỗi do nhà sản xuất.</p>
              <h4 style={{ fontWeight: 700, margin: '16px 0 10px' }}>Chính sách đổi trả</h4>
              <ul style={{ paddingLeft: 18, lineHeight: 1.9 }}>
                <li>Đổi trả trong vòng 30 ngày nếu sản phẩm lỗi hoặc không đúng mô tả</li>
                <li>Sản phẩm phải còn nguyên tem, nhãn, hộp đầy đủ</li>
                <li>Liên hệ hotline hoặc Zalo để được hỗ trợ đổi trả nhanh nhất</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="vp-related" aria-label="Sản phẩm liên quan">
          <div className="vp-container">
            <div className="vp-eyebrow">Cùng danh mục</div>
            <h2 className="vp-sec-title" style={{ marginBottom: 24 }}>Sản phẩm liên quan</h2>
            <div className="vp-prod-grid">
              {related.map(r => <ProductCard key={r.id} product={r} />)}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
