import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useCart } from '../contexts/CartContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import type { Product } from '../contexts/SiteContext'

const PET_LABELS: Record<string, string> = { cho: 'Chó', meo: 'Mèo', 'ca-hai': 'Chó & Mèo' }

function formatVND(n: number) { return n.toLocaleString('vi-VN') + '₫' }

function RelatedCard({ p }: { p: Product }) {
  const price = p.price_sale ? p.price_sale : p.price
  return (
    <div className="tc-prod-card">
      <Link to={`/san-pham/${p.slug}`} className="tc-prod-img-wrap"><img src={p.image} alt={p.name} loading="lazy" /></Link>
      <div className="tc-prod-body">
        <div className="tc-prod-cat">{p.category_name}</div>
        <h3 className="tc-prod-name"><Link to={`/san-pham/${p.slug}`}>{p.name}</Link></h3>
        <div className="tc-prod-price"><span className={'tc-price' + (p.price_sale ? ' sale' : '')}>{formatVND(price)}</span></div>
        <div className="tc-prod-actions"><Link to={`/san-pham/${p.slug}`} className="tc-btn-detail" style={{ width: '100%', textAlign: 'center' }}>Xem chi tiết</Link></div>
      </div>
    </div>
  )
}

export default function ProductDetailPage() {
  const { slug } = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [qty, setQty] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [tab, setTab] = useState<'mo-ta' | 'thong-so' | 'danh-gia'>('mo-ta')
  const [mainImg, setMainImg] = useState('')
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [added, setAdded] = useState(false)

  useDocumentMeta({
    title: product ? `${product.name} — Pet Haus` : 'Chi tiết sản phẩm — Pet Haus',
    description: product?.description?.slice(0, 155) || 'Chi tiết sản phẩm thú cưng tại Pet Haus — thông số, đánh giá, sản phẩm liên quan.',
  })

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setNotFound(false)
    api.get<Product>(`/public/products/${slug}`)
      .then(p => {
        setProduct(p)
        setMainImg(p.image)
        setQty(1)
        setTab('mo-ta')
        const sizes = p.size ? p.size.split(',').filter(Boolean) : []
        setSelectedSize(sizes[0] || null)
        return api.getPaged<Product[]>(`/public/products?category_ids=${p.category_id ?? ''}&per_page=8`)
      })
      .then(async ({ data }) => {
        const sameCategory = data.filter(r => r.slug !== slug)
        if (sameCategory.length > 0) { setRelated(sameCategory.slice(0, 4)); return }
        // Fallback — không còn sản phẩm nào khác cùng danh mục: lấy bất kỳ 4 sản phẩm khác
        const { data: fallback } = await api.getPaged<Product[]>(`/public/products?per_page=8`)
        setRelated(fallback.filter(r => r.slug !== slug).slice(0, 4))
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="tc-container" style={{ padding: '160px 0 80px' }}>Đang tải...</div>
  if (notFound || !product) {
    return (
      <div className="tc-container" style={{ padding: '160px 0 80px', textAlign: 'center' }}>
        <h1>Không tìm thấy sản phẩm</h1>
        <Link to="/" className="tc-btn tc-btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>Về trang chủ</Link>
      </div>
    )
  }

  const sizes = product.size ? product.size.split(',').filter(Boolean) : []
  const galleryUrls = product.gallery ? product.gallery.split('|').filter(Boolean) : [product.image]
  const price = product.price_sale ? product.price_sale : product.price
  const petLabel = PET_LABELS[product.pet_type] ?? product.pet_type

  const specs: [string, string][] = [
    ['Danh mục', product.category_name],
    ['Loại thú cưng', petLabel],
    ['Thương hiệu', product.brand],
    ['Kích cỡ có sẵn', sizes.length ? sizes.join(', ') : 'Không phân loại size'],
    ['Tình trạng', product.in_stock ? 'Còn hàng' : 'Hết hàng'],
    ['Đánh giá', `${product.rating} / 5 (${product.sold} lượt bán)`],
  ]

  const descText = `${product.description} Đội ngũ Pet Haus khuyến nghị theo dõi phản ứng của bé cưng trong lần đầu sử dụng và liên hệ tư vấn nếu cần hỗ trợ thêm.`

  const handleAddCart = () => {
    addItem({ product_id: product.id, name: product.name, slug: product.slug, image: product.image, price, size: selectedSize || undefined }, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <>
      <div className="tc-breadcrumb">
        <div className="tc-container">
          <Link to="/">Trang chủ</Link><span className="tc-bc-sep">/</span>
          <Link to={`/?category=${product.category_slug}`}>{product.category_name}</Link><span className="tc-bc-sep">/</span>
          <span>{product.name}</span>
        </div>
      </div>

      <main className="tc-sec-sm">
        <div className="tc-container">
          <div className="tc-pd-layout">
            <div>
              <div className="tc-pd-gallery-main"><img src={mainImg} alt={product.name} /></div>
              {galleryUrls.length > 1 && (
                <div className="tc-pd-thumbs">
                  {galleryUrls.map((src, i) => (
                    <div key={i} className={'tc-pd-thumb' + (mainImg === src ? ' active' : '')} onClick={() => setMainImg(src)}>
                      <img src={src} alt={`Ảnh ${i + 1} của ${product.name}`} loading="lazy" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <div className="tc-pd-cat">{product.category_name} · {petLabel} · {product.brand}</div>
              <h1 className="tc-pd-title">{product.name}</h1>
              <div className="tc-pd-rating">
                <span className="tc-stars">{'★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating))}</span>
                <span>{product.rating}</span>
                <span>·</span>
                <span>{product.sold} đã bán</span>
              </div>
              <div className="tc-pd-price-row">
                <span className="tc-pd-price">{formatVND(price)}</span>
                {product.price_sale ? <span className="tc-pd-price-orig" style={{ display: 'inline' }}>{formatVND(product.price)}</span> : null}
              </div>
              <p className="tc-pd-desc">{product.description}</p>

              {sizes.length > 0 && (
                <div className="tc-pd-option-group">
                  <div className="tc-pd-option-label">Kích cỡ</div>
                  <div className="tc-pd-sizes">
                    {sizes.map(s => (
                      <button key={s} type="button" className={'tc-pd-size-btn' + (selectedSize === s ? ' active' : '')} onClick={() => setSelectedSize(s)}>{s}</button>
                    ))}
                  </div>
                </div>
              )}

              <div className="tc-pd-option-group">
                <div className="tc-pd-option-label">Số lượng</div>
                <div className="tc-pd-qty">
                  <button type="button" aria-label="Giảm" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <input type="text" value={qty} readOnly />
                  <button type="button" aria-label="Tăng" onClick={() => setQty(q => q + 1)}>+</button>
                </div>
              </div>

              <div className="tc-pd-actions">
                <button className="tc-btn tc-btn-dark tc-btn-lg tc-btn-block" onClick={handleAddCart}>{added ? '✓ Đã thêm vào giỏ' : 'Thêm vào giỏ hàng'}</button>
                <Link to="/gio-hang" className="tc-btn tc-btn-primary tc-btn-lg tc-btn-block" onClick={handleAddCart}>Mua ngay</Link>
              </div>

              <div className="tc-pd-trust">
                <span>🚚 Miễn phí vận chuyển cho đơn từ 400.000₫</span>
                <span>🩺 Sản phẩm có tem kiểm định nguồn gốc</span>
                <span>↩️ Đổi trả trong 7 ngày nếu bé cưng không hợp</span>
              </div>
            </div>
          </div>

          <div className="tc-tabs-nav">
            <button className={'tc-tab-btn' + (tab === 'mo-ta' ? ' active' : '')} onClick={() => setTab('mo-ta')}>Mô tả</button>
            <button className={'tc-tab-btn' + (tab === 'thong-so' ? ' active' : '')} onClick={() => setTab('thong-so')}>Thông số</button>
            <button className={'tc-tab-btn' + (tab === 'danh-gia' ? ' active' : '')} onClick={() => setTab('danh-gia')}>Đánh giá</button>
          </div>
          <div className={'tc-tab-pane' + (tab === 'mo-ta' ? ' active' : '')}>
            <p style={{ color: 'var(--text-2)', fontSize: 14.5, lineHeight: 1.8, maxWidth: 720 }}>{descText}</p>
          </div>
          <div className={'tc-tab-pane' + (tab === 'thong-so' ? ' active' : '')}>
            <table className="tc-spec-table">
              <tbody>
                {specs.map(([k, v]) => <tr key={k}><td>{k}</td><td>{v}</td></tr>)}
              </tbody>
            </table>
          </div>
          <div className={'tc-tab-pane' + (tab === 'danh-gia' ? ' active' : '')}>
            <div className="tc-list-elegant" style={{ maxWidth: 680 }}>
              <div className="tc-list-item">
                <img className="tc-list-avatar" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80" alt="Chân dung khách hàng" loading="lazy" />
                <div>
                  <p className="tc-list-quote">Sản phẩm đúng như mô tả, bé nhà mình rất thích. Sẽ ủng hộ shop lâu dài.</p>
                  <div className="tc-list-name">Khách hàng đã mua</div>
                </div>
                <div className="tc-list-stars">★★★★★</div>
              </div>
              <div className="tc-list-item">
                <img className="tc-list-avatar" src="https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&auto=format&fit=crop&q=80" alt="Chân dung khách hàng" loading="lazy" />
                <div>
                  <p className="tc-list-quote">Đóng gói cẩn thận, giao hàng nhanh hơn dự kiến. Chất lượng tốt so với giá.</p>
                  <div className="tc-list-name">Khách hàng đã mua</div>
                </div>
                <div className="tc-list-stars">★★★★★</div>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <section className="tc-sec-sm" style={{ paddingLeft: 0, paddingRight: 0 }}>
              <div className="tc-sec-header" data-reveal>
                <h2 className="tc-sec-title" style={{ fontSize: 22 }}>Sản phẩm <em>liên quan</em></h2>
              </div>
              <div className="tc-product-grid">
                {related.map(p => <RelatedCard key={p.id} p={p} />)}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  )
}
