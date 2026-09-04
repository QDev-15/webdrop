import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useCart } from '../contexts/CartContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import type { Product } from '../contexts/SiteContext'

const CATEGORY_LABEL: Record<string, string> = {
  'nhan': 'Nhẫn', 'day-chuyen': 'Dây chuyền', 'bong-tai': 'Bông tai', 'lac-tay': 'Lắc tay', 'bo-trang-suc': 'Bộ trang sức',
}
const MATERIAL_LABEL: Record<string, string> = {
  'bac-925': 'Bạc 925', 'vang-18k': 'Vàng 18K', 'vang-24k': 'Vàng 24K', 'da-quy': 'Đá quý tự nhiên', 'dinh-da': 'Đính đá CZ',
}
const TONE_LABEL: Record<string, string> = { 'vang': 'Vàng', 'bac': 'Bạc', 'hong-vang': 'Vàng hồng' }
const OCCASION_LABEL: Record<string, string> = {
  'hang-ngay': 'Hàng ngày', 'du-tiec': 'Dự tiệc', 'cuoi-hoi': 'Cưới hỏi', 'qua-tang': 'Quà tặng',
}

// Ảnh phụ dùng cho gallery — không gắn cố định vào 1 sản phẩm, chọn theo id % length
// (khớp nguyên lý getProductGallery() trong assets/js/common.js gốc).
const EXTRA_IMAGES = [
  'https://images.unsplash.com/photo-1620656798579-1984d9e87df7?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1631982686092-e6561a853187?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1705326455036-0fab8ecba04d?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1614606140245-2c33ece9e2cf?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1722410180670-b6d5a2e704fa?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1671644730555-916aa8d8157f?w=900&auto=format&fit=crop&q=80',
]

function formatVND(n: number) { return n.toLocaleString('vi-VN') + '₫' }
function renderStars(rating: number) { const full = Math.round(rating); return '★'.repeat(full) + '☆'.repeat(5 - full) }
function getGallery(p: Product) {
  const start = p.id % EXTRA_IMAGES.length
  return [p.image, EXTRA_IMAGES[start], EXTRA_IMAGES[(start + 1) % EXTRA_IMAGES.length]]
}

function RelatedCard({ p }: { p: Product }) {
  const matLabel = MATERIAL_LABEL[p.material] ?? p.material
  return (
    <article className="tr-prod-card" data-reveal>
      <Link to={`/san-pham/${p.slug}`} className="tr-prod-img" aria-label={p.name}>
        <img src={p.image} alt={p.name} loading="lazy" />
      </Link>
      <div className="tr-prod-body">
        <div className="tr-prod-material">{matLabel}</div>
        <h3 className="tr-prod-name"><Link to={`/san-pham/${p.slug}`}>{p.name}</Link></h3>
        <div className="tr-prod-price">
          <span className={'tr-price-main' + (p.price_sale ? ' tr-price-sale' : '')}>{formatVND(p.price_sale || p.price)}</span>
          {p.price_sale ? <span className="tr-price-old">{formatVND(p.price)}</span> : null}
        </div>
      </div>
    </article>
  )
}

export default function ProductDetailPage() {
  const { slug } = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState<'desc' | 'spec' | 'care'>('desc')
  const [mainImg, setMainImg] = useState('')
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useDocumentMeta({
    title: product ? `${product.name} — VIOLETTE Fine Jewelry` : 'Chi tiết sản phẩm — VIOLETTE Fine Jewelry',
    description: product?.description?.slice(0, 155) || 'Chi tiết sản phẩm trang sức VIOLETTE — thông số chất liệu, đá quý, chính sách bảo hành và đổi trả.',
  })

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setNotFound(false)
    api.get<Product>(`/public/products/${slug}`)
      .then(p => {
        setProduct(p)
        setMainImg(getGallery(p)[0])
        setQty(1)
        setTab('desc')
        return api.getPaged<Product[]>(`/public/products?category_slugs=${p.category_slug}&per_page=8`)
      })
      .then(({ data }) => setRelated(data.filter(r => r.slug !== slug).slice(0, 4)))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="tr-container" style={{ padding: '180px 0 90px' }}>Đang tải...</div>
  if (notFound || !product) {
    return (
      <div className="tr-container" style={{ padding: '180px 0 90px', textAlign: 'center' }}>
        <h1>Không tìm thấy sản phẩm</h1>
        <Link to="/san-pham" className="tr-btn tr-btn-fill" style={{ marginTop: 20 }}>Về trang sản phẩm</Link>
      </div>
    )
  }

  const catLabel = CATEGORY_LABEL[product.category_slug] ?? product.category_name
  const matLabel = MATERIAL_LABEL[product.material] ?? product.material
  const toneLabel = TONE_LABEL[product.tone] ?? product.tone
  const occLabel = OCCASION_LABEL[product.occasion] ?? product.occasion
  const gallery = getGallery(product)

  return (
    <main className="tr-pd-wrap">
      <div className="tr-container">
        <div className="tr-breadcrumb" style={{ marginBottom: 26 }}>
          <Link to="/">Trang chủ</Link> / <Link to="/san-pham">Sản phẩm</Link> / <span>{product.name}</span>
        </div>

        <div className="tr-pd-grid">
          <div>
            <div className="tr-pd-gallery-main"><img src={mainImg} alt={product.name} /></div>
            <div className="tr-pd-gallery-thumbs">
              {gallery.map((src, i) => (
                <div key={i} className={'tr-pd-thumb' + (mainImg === src ? ' active' : '')} onClick={() => setMainImg(src)}>
                  <img src={src} alt={`${product.name} - ảnh ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>
          <div data-reveal>
            <div className="tr-pd-material">{catLabel} · {matLabel}</div>
            <h1 className="tr-pd-title">{product.name}</h1>
            <div className="tr-pd-rating">
              <span className="tr-rating-stars">{renderStars(product.rating)}</span>
              <span>{product.rating} / 5 · Đã bán {product.sold.toLocaleString('vi-VN')}</span>
            </div>
            <div className="tr-pd-price">
              <span className={'tr-price-main' + (product.price_sale ? ' tr-price-sale' : '')}>{formatVND(product.price_sale || product.price)}</span>
              {product.price_sale ? <span className="tr-price-old">{formatVND(product.price)}</span> : null}
            </div>
            <p className="tr-pd-desc">
              {product.name} thuộc dòng {catLabel.toLowerCase()} chất liệu {matLabel.toLowerCase()}, tông màu {toneLabel.toLowerCase()}, phù hợp cho dịp {occLabel.toLowerCase()}. Sản phẩm được chế tác thủ công tỉ mỉ, đánh bóng hoàn thiện đạt tiêu chuẩn cao cấp, đi kèm hộp quà sang trọng và giấy kiểm định.
            </p>

            <div className="tr-pd-quickfacts">
              <div><div className="tr-pd-fact-label">Chất liệu</div><div className="tr-pd-fact-value">{matLabel}</div></div>
              <div><div className="tr-pd-fact-label">Tông màu</div><div className="tr-pd-fact-value">{toneLabel}</div></div>
              <div><div className="tr-pd-fact-label">Dịp sử dụng</div><div className="tr-pd-fact-value">{occLabel}</div></div>
              <div><div className="tr-pd-fact-label">Tình trạng</div><div className="tr-pd-fact-value">{product.in_stock ? 'Còn hàng' : 'Hết hàng'}</div></div>
            </div>

            <div className="d-flex align-items-center gap-3 mb-3">
              <span style={{ fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-3)' }}>Số lượng</span>
              <div className="tr-qty-selector">
                <button type="button" aria-label="Giảm số lượng" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <input type="text" value={qty} readOnly aria-label="Số lượng" />
                <button type="button" aria-label="Tăng số lượng" onClick={() => setQty(q => Math.min(99, q + 1))}>+</button>
              </div>
            </div>

            <div className="tr-pd-actions">
              {product.in_stock ? (
                <button className="tr-btn tr-btn-fill" onClick={() => addItem({ product_id: product.id, name: product.name, slug: product.slug, image: product.image, price: product.price_sale || product.price }, qty)}>Thêm vào giỏ hàng</button>
              ) : (
                <button className="tr-btn tr-btn-fill" disabled>Hết hàng</button>
              )}
              <button className="tr-pd-fav-btn" aria-label="Yêu thích">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
              </button>
            </div>

            <div className="tr-pd-trust">
              <div className="tr-pd-trust-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M12 22s8-4.5 8-11V5l-8-3-8 3v6c0 6.5 8 11 8 11z" /></svg>Bảo hành trọn đời khung trang sức</div>
              <div className="tr-pd-trust-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>Đổi size miễn phí trong 30 ngày</div>
              <div className="tr-pd-trust-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a4 4 0 018 0v2" /></svg>Kèm giấy kiểm định &amp; hóa đơn VAT</div>
            </div>
          </div>
        </div>

        <div className="tr-tabs">
          <button className={'tr-tab-btn' + (tab === 'desc' ? ' active' : '')} onClick={() => setTab('desc')}>Mô tả</button>
          <button className={'tr-tab-btn' + (tab === 'spec' ? ' active' : '')} onClick={() => setTab('spec')}>Thông số</button>
          <button className={'tr-tab-btn' + (tab === 'care' ? ' active' : '')} onClick={() => setTab('care')}>Bảo quản &amp; Bảo hành</button>
        </div>
        <div className={'tr-tab-panel' + (tab === 'desc' ? ' active' : '')}>
          <p>Mỗi sản phẩm VIOLETTE trải qua quy trình chế tác hơn 12 công đoạn thủ công — từ tạo phôi, gắn đá, đánh bóng đến kiểm tra chất lượng cuối cùng. {product.name} là lựa chọn lý tưởng cho dịp {occLabel.toLowerCase()}, phù hợp phối cùng nhiều trang phục khác nhau nhờ thiết kế tinh tế, không lỗi mốt theo thời gian.</p>
          <p>Sản phẩm đi kèm hộp đựng cao cấp, túi vải bảo quản, giấy kiểm định (đối với sản phẩm đá quý tự nhiên) và hóa đơn VAT đầy đủ.</p>
        </div>
        <div className={'tr-tab-panel' + (tab === 'spec' ? ' active' : '')}>
          <table className="tr-spec-table">
            <tbody>
              <tr><td>Danh mục</td><td>{catLabel}</td></tr>
              <tr><td>Chất liệu chính</td><td>{matLabel}</td></tr>
              <tr><td>Tông màu</td><td>{toneLabel}</td></tr>
              <tr><td>Dịp sử dụng phù hợp</td><td>{occLabel}</td></tr>
              <tr><td>Xuất xứ</td><td>Chế tác tại Việt Nam</td></tr>
              <tr><td>Bảo hành</td><td>Trọn đời khung trang sức</td></tr>
              <tr><td>Đóng gói</td><td>Hộp quà VIOLETTE + túi vải bảo quản</td></tr>
            </tbody>
          </table>
        </div>
        <div className={'tr-tab-panel' + (tab === 'care' ? ' active' : '')}>
          <p>Trang sức VIOLETTE nên được cất giữ riêng trong hộp/túi vải mềm đi kèm, tránh va chạm với bề mặt cứng hoặc trang sức khác. Hạn chế tiếp xúc trực tiếp với nước hoa, mỹ phẩm và mồ hôi trong thời gian dài. Vệ sinh định kỳ bằng khăn mềm chuyên dụng cho bạc/vàng.</p>
          <p>Chính sách bảo hành: bảo hành trọn đời cho khung trang sức (không áp dụng cho đá quý bị vỡ do va đập ngoại lực), đánh bóng và làm mới miễn phí 1 lần/năm tại toàn bộ cửa hàng VIOLETTE. Vui lòng giữ hóa đơn mua hàng để được hỗ trợ bảo hành nhanh chóng.</p>
        </div>

        {related.length > 0 && (
          <section className="tr-pad" style={{ paddingLeft: 0, paddingRight: 0 }}>
            <div className="tr-sec-head" data-reveal>
              <div className="tr-eyebrow">Có thể bạn cũng thích</div>
              <h2 className="tr-sec-title">Sản phẩm <em>tương tự</em></h2>
            </div>
            <div className="tr-prod-grid" data-reveal>
              {related.map(p => <RelatedCard key={p.id} p={p} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
