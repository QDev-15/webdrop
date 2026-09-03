import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client'
import type { Product } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { CATEGORY_LABELS, materialName, styleName, fmtVND } from '../data/filters'
import ProductCard from '../components/ProductCard'

type Tab = 'desc' | 'spec' | 'review'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeImg, setActiveImg] = useState(0)
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState<Tab>('desc')

  useEffect(() => {
    if (!slug) return
    setLoading(true); setError(false)
    api.get<Product>(`/public/products/${slug}`)
      .then(p => {
        setProduct(p)
        setActiveImg(0)
        setQty(1)
        setTab('desc')
        const catId = p.category_id
        const params = new URLSearchParams()
        params.set('per_page', '8')
        if (catId) params.set('category_ids', String(catId))
        if (p.style) params.set('style', p.style)
        return api.get<Product[]>(`/public/products?${params.toString()}`)
      })
      .then(rows => setRelated((rows || []).filter(r => r.slug !== slug).slice(0, 4)))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [slug])

  useDocumentMeta({
    title: product ? `${product.name} — MERIDIAN` : 'Chi tiết sản phẩm — MERIDIAN',
    description: product?.description?.slice(0, 155) || 'Chi tiết đồng hồ chính hãng tại MERIDIAN — thông số kỹ thuật, bảo hành, chính sách đổi trả.',
  })

  if (loading) return <div className="dh-container" style={{ paddingTop: 180, paddingBottom: 100, textAlign: 'center' }}>Đang tải...</div>
  if (error || !product) {
    return (
      <div className="dh-container" style={{ paddingTop: 180, paddingBottom: 100, textAlign: 'center' }}>
        <h1>Không tìm thấy sản phẩm</h1>
        <p style={{ color: 'var(--text-2)', margin: '14px 0 24px' }}>Sản phẩm này có thể đã ngừng kinh doanh hoặc đường dẫn không đúng.</p>
        <Link to="/san-pham" className="dh-btn dh-btn-solid">Xem tất cả sản phẩm</Link>
      </div>
    )
  }

  const images = [product.image, ...product.gallery.split('|').filter(Boolean)]
  const sale = product.price_sale != null && product.price_sale > 0 && product.price_sale < product.price
  const price = sale ? product.price_sale! : product.price
  const savePercent = sale ? Math.round((1 - product.price_sale! / product.price) * 100) : 0

  const quickfacts: [string, string][] = [
    ['Danh mục', CATEGORY_LABELS[product.category_slug] || product.category_name],
    ['Chất liệu dây', materialName(product.material)],
    ['Phong cách', styleName(product.style)],
    ['Đường kính mặt', product.diameter + 'mm'],
    ['Bộ máy', product.movement],
    ['Chống nước', product.water_resist],
  ]

  const handleAddToCart = () => {
    addItem({ product_id: product.id, name: product.name, slug: product.slug, image: product.image, price }, qty)
  }
  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/gio-hang')
  }

  return (
    <section className="dh-sec" style={{ paddingTop: 150 }}>
      <div className="dh-container">
        <div className="dh-breadcrumb"><Link to="/">Trang chủ</Link> / <Link to="/san-pham">Sản phẩm</Link> / <span>{product.name}</span></div>

        <div className="dh-pd-wrap">
          <div>
            <div className="dh-pd-gallery-main"><img src={images[activeImg]} alt={product.name} /></div>
            <div className="dh-pd-thumbs">
              {images.map((img, i) => (
                <button key={i} className={'dh-pd-thumb' + (i === activeImg ? ' active' : '')} onClick={() => setActiveImg(i)}>
                  <img src={img} alt={`${product.name} ảnh ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="dh-pd-brand">{product.brand}</div>
            <h1 className="dh-pd-title">{product.name}</h1>
            <div className="dh-pd-meta-row">
              <span className="dh-card-rating">★ {product.rating}</span>
              <span style={{ color: 'var(--text-3)' }}>·</span>
              <span style={{ color: 'var(--text-2)', fontSize: 13.5 }}>Đã bán {product.sold}</span>
              <span style={{ color: 'var(--text-3)' }}>·</span>
              <span style={{ color: 'var(--text-2)', fontSize: 13.5 }}>{product.in_stock ? 'Còn hàng' : 'Tạm hết hàng'}</span>
            </div>
            <div className="dh-pd-price-row">
              <span className="dh-pd-price">{fmtVND(price)}</span>
              {sale && <span className="dh-pd-price-old">{fmtVND(product.price)}</span>}
              {sale && <span className="dh-pd-save">-{savePercent}%</span>}
            </div>
            <p className="dh-pd-desc">{product.description}</p>

            <div className="dh-quickfacts">
              {quickfacts.map(([lbl, val]) => (
                <div className="dh-quickfact" key={lbl}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                  <div><div className="lbl">{lbl}</div><div className="val">{val}</div></div>
                </div>
              ))}
            </div>

            <div className="dh-pd-actions">
              <div className="dh-qty-box">
                <button type="button" aria-label="Giảm số lượng" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <input type="text" value={qty} readOnly aria-label="Số lượng" />
                <button type="button" aria-label="Tăng số lượng" onClick={() => setQty(q => q + 1)}>+</button>
              </div>
              <button className="dh-btn dh-btn-solid" style={{ flex: 1 }} disabled={!product.in_stock} onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
              <button className="dh-btn dh-btn-outline" disabled={!product.in_stock} onClick={handleBuyNow}>Mua ngay</button>
            </div>

            <div className="dh-pd-badges">
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>100% chính hãng</span>
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 3h15l3 5v10a2 2 0 01-2 2H5a2 2 0 01-2-2V3z" /></svg>Đổi trả 30 ngày</span>
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 8h14M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" /></svg>Giao hàng toàn quốc</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 70 }}>
          <div className="dh-tabs">
            <button className={'dh-tab-btn' + (tab === 'desc' ? ' active' : '')} onClick={() => setTab('desc')}>Mô tả sản phẩm</button>
            <button className={'dh-tab-btn' + (tab === 'spec' ? ' active' : '')} onClick={() => setTab('spec')}>Thông số kỹ thuật</button>
            <button className={'dh-tab-btn' + (tab === 'review' ? ' active' : '')} onClick={() => setTab('review')}>Đánh giá</button>
          </div>
          <div className={'dh-tab-panel' + (tab === 'desc' ? ' active' : '')}>
            <p style={{ maxWidth: 760, color: 'var(--text-2)', fontSize: 15, lineHeight: 1.8 }}>
              {product.description} Sản phẩm được nhập khẩu và phân phối chính hãng bởi MERIDIAN, đi kèm đầy đủ hộp, sách hướng dẫn và phiếu bảo hành điện tử.
            </p>
          </div>
          <div className={'dh-tab-panel' + (tab === 'spec' ? ' active' : '')}>
            <table className="dh-spec-table" style={{ maxWidth: 640 }}>
              <tbody>
                <tr><td>Thương hiệu</td><td>{product.brand}</td></tr>
                <tr><td>Danh mục</td><td>{CATEGORY_LABELS[product.category_slug] || product.category_name}</td></tr>
                <tr><td>Chất liệu dây</td><td>{materialName(product.material)}</td></tr>
                <tr><td>Phong cách</td><td>{styleName(product.style)}</td></tr>
                <tr><td>Đường kính mặt</td><td>{product.diameter}mm</td></tr>
                <tr><td>Bộ máy</td><td>{product.movement}</td></tr>
                <tr><td>Khả năng chống nước</td><td>{product.water_resist}</td></tr>
                <tr><td>Bảo hành</td><td>{product.warranty}</td></tr>
              </tbody>
            </table>
          </div>
          {/* Tab "Đánh giá" hiển thị 2 review TĨNH giống nguyên văn mọi sản phẩm trong template gốc
              (chi-tiet-san-pham.html không data-driven theo từng sản phẩm ở mục này). */}
          <div className={'dh-tab-panel' + (tab === 'review' ? ' active' : '')}>
            <div className="dh-testi-grid">
              <div className="dh-testi-card">
                <div className="dh-testi-stars">★★★★★</div>
                <p>&quot;Đồng hồ chuẩn chính hãng, đóng gói cẩn thận, giao hàng nhanh.&quot;</p>
                <div className="dh-testi-user">
                  <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&auto=format&fit=crop&q=80" alt="Khách hàng" />
                  <div><strong>Anh Tuấn</strong><span>Đã mua hàng</span></div>
                </div>
              </div>
              <div className="dh-testi-card">
                <div className="dh-testi-stars">★★★★★</div>
                <p>&quot;Dây đeo thoải mái, mặt kính không bị trầy sau 2 tháng sử dụng.&quot;</p>
                <div className="dh-testi-user">
                  <img src="https://images.unsplash.com/photo-1484863137850-59afcfe05386?w=100&auto=format&fit=crop&q=80" alt="Khách hàng" />
                  <div><strong>Ngọc Linh</strong><span>Đã mua hàng</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div style={{ marginTop: 90 }}>
            <div className="dh-sec-head"><div><p className="dh-eyebrow">Có thể bạn thích</p><h2 className="dh-sec-title">Sản phẩm <em>tương tự</em></h2></div></div>
            <div className="dh-prod-grid">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
