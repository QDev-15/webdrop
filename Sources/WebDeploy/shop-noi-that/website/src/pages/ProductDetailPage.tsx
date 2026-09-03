import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import type { Product } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../hooks/useWishlist'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { fmtVND, materialName, roomName } from '../data/filters'
import ProductCard from '../components/ProductCard'

const ACCORDION_ITEMS = [
  {
    q: 'Mô tả chi tiết',
    a: 'Sản phẩm được sản xuất tại xưởng MỘC AN với quy trình kiểm định 3 vòng trước khi đóng gói. Đường nét thiết kế tối giản, dễ phối hợp với nhiều phong cách nội thất khác nhau — từ Bắc Âu, Nhật Bản Zen đến hiện đại. Màu sắc thực tế có thể chênh lệch nhẹ tùy điều kiện ánh sáng khi chụp ảnh.',
  },
  {
    q: 'Vận chuyển & lắp đặt',
    a: 'Miễn phí giao hàng nội thành cho đơn từ 5.000.000₫. Khu vực tỉnh/thành khác áp dụng phí vận chuyển theo bảng giá đối tác vận chuyển. Đội kỹ thuật lắp đặt tận nơi miễn phí đối với sản phẩm cần lắp ráp (tủ, giường, bàn ăn lớn).',
  },
  {
    q: 'Chính sách bảo hành & đổi trả',
    a: 'Bảo hành 24 tháng đối với lỗi khung, bản lề, cơ chế vận hành. Đổi trả miễn phí trong 15 ngày nếu sản phẩm còn nguyên trạng, chưa qua sử dụng và còn đầy đủ bao bì gốc.',
  },
]

export default function ProductDetailPage() {
  const { slug } = useParams()
  const { addItem } = useCart()
  const { isWished, toggle } = useWishlist()

  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [gallery, setGallery] = useState<string[]>([])
  const [activeThumb, setActiveThumb] = useState(0)
  const [qty, setQty] = useState(1)
  const [openAccordion, setOpenAccordion] = useState(0)
  const [notFound, setNotFound] = useState(false)
  const [added, setAdded] = useState(false)

  useDocumentMeta({
    title: product ? `${product.name} — MỘC AN` : 'Chi tiết sản phẩm — MỘC AN',
    description: product?.description?.slice(0, 155) || 'Chi tiết sản phẩm nội thất MỘC AN — thông số, chất liệu, chính sách bảo hành và vận chuyển.',
  })

  useEffect(() => {
    if (!slug) return
    setProduct(null); setNotFound(false); setActiveThumb(0); setQty(1)
    api.get<Product>(`/public/products/${slug}`)
      .then(async p => {
        setProduct(p)
        const same = await api.get<Product[]>(`/public/products?category_ids=${p.category_id ?? ''}&per_page=8`).catch(() => [])
        const sameOthers = same.filter(x => x.id !== p.id)
        setGallery([p.image, ...sameOthers.slice(0, 3).map(x => x.image)])

        let rel = sameOthers.slice(0, 4)
        if (rel.length < 4) {
          const fill = await api.get<Product[]>(`/public/products?per_page=8&sort=newest`).catch(() => [])
          const usedIds = new Set([p.id, ...rel.map(x => x.id)])
          for (const f of fill) {
            if (rel.length >= 4) break
            if (!usedIds.has(f.id)) { rel.push(f); usedIds.add(f.id) }
          }
        }
        setRelated(rel.slice(0, 4))
      })
      .catch(() => setNotFound(true))
  }, [slug])

  if (notFound) {
    return (
      <div className="nt-container" style={{ padding: '120px 0', textAlign: 'center' }}>
        <h1>Không tìm thấy sản phẩm</h1>
        <p style={{ color: 'var(--text-2)', marginBottom: 24 }}>Sản phẩm này có thể đã ngừng kinh doanh hoặc đường dẫn không đúng.</p>
        <Link to="/" className="nt-btn">Về trang chủ</Link>
      </div>
    )
  }

  if (!product) return <div className="nt-container" style={{ padding: '160px 0', textAlign: 'center' }}>Đang tải...</div>

  const sale = product.price_sale != null && product.price_sale > 0 && product.price_sale < product.price
  const colorInfo = (product.colors || '').split('|')[0]?.split(':') || []
  const colorName = colorInfo[0] || '—'

  const handleAddCart = () => {
    addItem(
      { product_id: product.id, name: product.name, slug: product.slug, image: product.image, price: sale ? product.price_sale! : product.price },
      qty
    )
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div>
      <nav className="nt-breadcrumb">
        <div className="nt-container">
          <Link to="/">Trang chủ</Link> / <Link to={`/?category=${product.category_slug}`}>{product.category_name}</Link> / <span style={{ color: 'var(--text-2)' }}>{product.name}</span>
        </div>
      </nav>

      <section className="nt-container">
        <div className="nt-pd-grid">
          <div>
            <div className="nt-pd-main-img"><img src={gallery[activeThumb] || product.image} alt={product.name} /></div>
            <div className="nt-pd-thumbs">
              {gallery.map((src, i) => (
                <div key={i} className={'nt-pd-thumb' + (i === activeThumb ? ' active' : '')} onClick={() => setActiveThumb(i)}>
                  <img src={src} alt={`Ảnh ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="nt-pd-cat">{product.category_name}</div>
            <h1 className="nt-pd-title">{product.name}</h1>
            <div className="nt-pd-meta">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7L5.8 21l1.6-7-5.4-4.7 7.1-.6z" /></svg>
              {product.rating}/5 · Đã bán {product.sold} sản phẩm
            </div>

            <div className="nt-pd-price-row">
              {sale ? (
                <>
                  <span className="nt-pd-price sale">{fmtVND(product.price_sale!)}</span>
                  <span className="nt-pd-price-old">{fmtVND(product.price)}</span>
                  <span className="nt-pd-save">Tiết kiệm {fmtVND(product.price - product.price_sale!)}</span>
                </>
              ) : (
                <span className="nt-pd-price">{fmtVND(product.price)}</span>
              )}
            </div>

            <div className="nt-pd-specs">
              <div className="nt-pd-spec-row"><span className="k">Chất liệu</span><span className="v">{materialName(product.material)}</span></div>
              <div className="nt-pd-spec-row"><span className="k">Màu sắc</span><span className="v">{colorName}</span></div>
              <div className="nt-pd-spec-row"><span className="k">Phù hợp không gian</span><span className="v">{roomName(product.room)}</span></div>
              <div className="nt-pd-spec-row"><span className="k">Mã sản phẩm</span><span className="v">MA-{String(product.id).padStart(4, '0')}</span></div>
            </div>

            <div className="nt-pd-qty">
              <div className="nt-qty-box">
                <button type="button" aria-label="Giảm số lượng" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <input type="text" value={qty} readOnly aria-label="Số lượng" />
                <button type="button" aria-label="Tăng số lượng" onClick={() => setQty(q => q + 1)}>+</button>
              </div>
              <div className="nt-pd-stock"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 6L9 17l-5-5" /></svg> Còn hàng — giao trong 2–8 ngày</div>
            </div>

            <div className="nt-pd-actions">
              <button className={'nt-btn' + (added ? ' added' : '')} onClick={handleAddCart}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={15} height={15}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
                <span className="label">{added ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ hàng'}</span>
              </button>
              <button className={'nt-pd-wish-btn' + (isWished(product.id) ? ' active' : '')} aria-label="Yêu thích" onClick={() => toggle(product.id)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 000-7.6z" /></svg>
              </button>
            </div>

            <div className="nt-pd-trust">
              <div className="nt-pd-trust-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M12 2l8 4v6c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-4z" /></svg> Bảo hành 24 tháng chính hãng</div>
              <div className="nt-pd-trust-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><rect x="1" y="6" width="15" height="12" rx="1" /><path d="M16 10h4l3 4v4h-7" /><circle cx="6" cy="19" r="2" /><circle cx="18" cy="19" r="2" /></svg> Giao hàng &amp; lắp đặt tận nơi</div>
              <div className="nt-pd-trust-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M21 12a9 9 0 11-9-9M21 3v6h-6" /></svg> Đổi trả miễn phí trong 15 ngày</div>
            </div>

            <div>
              {ACCORDION_ITEMS.map((item, i) => (
                <div className={'nt-accordion-item' + (openAccordion === i ? ' open' : '')} key={i}>
                  <button className="nt-accordion-q" onClick={() => setOpenAccordion(o => o === i ? -1 : i)}>
                    {item.q}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M12 5v14M5 12h14" /></svg>
                  </button>
                  <div className="nt-accordion-a"><div className="nt-accordion-a-inner">{item.a}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="nt-review-summary">
          <div className="nt-review-score">{product.rating}</div>
          <div>
            <div className="nt-review-stars">
              {[0, 1, 2, 3, 4].map(i => (
                <svg key={i} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7L5.8 21l1.6-7-5.4-4.7 7.1-.6z" /></svg>
              ))}
            </div>
            <div className="nt-review-count">Dựa trên đánh giá thực tế từ khách hàng đã mua sản phẩm</div>
          </div>
        </div>

        <div className="nt-sec-head">
          <div className="nt-eyebrow">Có thể bạn cũng thích</div>
          <h2 className="nt-sec-title">Sản phẩm <em>liên quan</em></h2>
        </div>
        <div className="nt-prod-grid" style={{ marginBottom: 60 }}>
          {related.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  )
}
