import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useCart } from '../contexts/CartContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import type { Product } from '../contexts/SiteContext'

const ORIGIN_LABEL: Record<string, string> = {
  phap: 'Pháp', y: 'Ý', chile: 'Chile', 'tay-ban-nha': 'Tây Ban Nha',
  argentina: 'Argentina', uc: 'Úc', my: 'Mỹ', duc: 'Đức', 'nam-phi': 'Nam Phi',
}
const OCCASION_LABEL: Record<string, string> = {
  'qua-tang': 'Quà tặng', 'tiec-tung': 'Tiệc tùng', 'suu-tam': 'Sưu tầm', 'khai-vi': 'Khai vị', 'hang-ngay': 'Dùng hàng ngày',
}
const CATEGORY_LABEL: Record<string, string> = {
  'vang-do': 'Vang đỏ', 'vang-trang': 'Vang trắng', 'vang-sui': 'Vang sủi', 'vang-hong': 'Vang hồng', 'qua-tang-set': 'Set quà tặng',
}

function volumeLabel(p: Product) { return p.category_slug === 'qua-tang-set' ? `Bộ ${p.volume / 750} chai` : `${p.volume}ml` }
function formatVND(n: number) { return n.toLocaleString('vi-VN') + '₫' }

function RelatedCard({ p }: { p: Product }) {
  return (
    <div className="rv-card" data-reveal>
      <div className="rv-card-thumb">
        <div className="rv-card-badges"></div>
        <Link to={`/san-pham/${p.slug}`} aria-label={`Xem chi tiết ${p.name}`}><img src={p.image} alt={p.name} loading="lazy" /></Link>
      </div>
      <Link to={`/san-pham/${p.slug}`} className="rv-card-body-link">
        <div className="rv-card-body">
          <span className="rv-card-origin">{ORIGIN_LABEL[p.origin] ?? p.origin} · {volumeLabel(p)}</span>
          <h3 className="rv-card-name">{p.name}</h3>
          <div className="rv-card-meta"><span className="rv-star">★</span> {p.rating.toFixed(1)} · Đã bán {p.sold}</div>
          <div className="rv-card-price">
            <span className="rv-price-now">{formatVND(p.price_sale ?? p.price)}</span>
            {p.price_sale ? <span className="rv-price-old">{formatVND(p.price)}</span> : null}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default function ProductDetailPage() {
  const { slug } = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState<'mota' | 'baoquan' | 'danhgia'>('mota')
  const [mainImg, setMainImg] = useState('')
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useDocumentMeta({
    title: product ? `${product.name} — Mộc Vang` : 'Chi tiết sản phẩm — Mộc Vang',
    description: product?.description?.slice(0, 155) || 'Chi tiết sản phẩm rượu vang tại Mộc Vang — nguồn gốc, nồng độ cồn, dung tích, hướng dẫn bảo quản & thưởng thức.',
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
        setTab('mota')
        return api.getPaged<Product[]>(`/public/products?category_slugs=${p.category_slug}&per_page=8`)
      })
      .then(({ data }) => setRelated(data.filter(r => r.slug !== slug).slice(0, 4)))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="wd-container" style={{ padding: '160px 0 80px' }}>Đang tải...</div>
  if (notFound || !product) {
    return (
      <div className="wd-container" style={{ padding: '160px 0 80px', textAlign: 'center' }}>
        <h1>Không tìm thấy sản phẩm</h1>
        <Link to="/" className="rv-btn rv-btn-solid" style={{ marginTop: 20 }}>Về trang chủ</Link>
      </div>
    )
  }

  const occasions = product.occasion ? product.occasion.split(',').filter(Boolean) : []
  const thumbs = [product.image]

  return (
    <div className="wd-container">
      <div className="rv-breadcrumb">
        <Link to="/">Trang chủ</Link> / <Link to={`/?category=${product.category_slug}`}>{CATEGORY_LABEL[product.category_slug] ?? product.category_name}</Link> / <span>{product.name}</span>
      </div>

      <div className="rv-pd-grid">
        <div>
          <div className="rv-pd-main-img"><img src={mainImg} alt={product.name} /></div>
          {thumbs.length > 1 && (
            <div className="rv-pd-thumbs">
              {thumbs.map((src, i) => (
                <button key={i} className={mainImg === src ? 'active' : ''} onClick={() => setMainImg(src)}>
                  <img src={src} alt={`Ảnh ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <span className="rv-card-origin">{ORIGIN_LABEL[product.origin] ?? product.origin} · {volumeLabel(product)}</span>
          <h1 className="rv-pd-title">{product.name}</h1>
          <div className="rv-pd-meta-row">
            <span><span className="rv-star">★</span> {product.rating.toFixed(1)} / 5</span>
            <span>Đã bán {product.sold}</span>
            <span>{product.in_stock ? 'Còn hàng' : 'Tạm hết hàng'}</span>
          </div>
          <div className="rv-pd-price-row">
            <span className="rv-pd-price-now">{formatVND(product.price_sale ?? product.price)}</span>
            {product.price_sale ? <span className="rv-pd-price-old">{formatVND(product.price)}</span> : null}
          </div>
          <div className="rv-pd-tags">
            <span className="rv-pd-tag">{product.abv}% vol</span>
            {occasions.map(o => <span className="rv-pd-tag" key={o}>{OCCASION_LABEL[o] ?? o}</span>)}
          </div>
          <div className="rv-pd-facts">
            <div className="rv-pd-fact"><strong>Xuất xứ</strong><span>{ORIGIN_LABEL[product.origin] ?? product.origin}</span></div>
            <div className="rv-pd-fact"><strong>Dung tích</strong><span>{volumeLabel(product)}</span></div>
            <div className="rv-pd-fact"><strong>Nồng độ cồn</strong><span>{product.abv}%</span></div>
            <div className="rv-pd-fact"><strong>Loại rượu</strong><span>{CATEGORY_LABEL[product.category_slug] ?? product.category_name}</span></div>
          </div>
          <div className="rv-pd-buy">
            <div className="rv-cart-qty">
              <button aria-label="Giảm số lượng" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button aria-label="Tăng số lượng" onClick={() => setQty(q => Math.min(20, q + 1))}>+</button>
            </div>
            {product.in_stock ? (
              <button className="rv-btn rv-btn-solid" onClick={() => addItem({ product_id: product.id, name: product.name, slug: product.slug, image: product.image, price: product.price_sale ?? product.price }, qty)}>Thêm vào giỏ hàng</button>
            ) : (
              <button className="rv-btn rv-btn-solid" disabled>Hết hàng</button>
            )}
          </div>

          <div className="rv-pd-tabs">
            <button className={'rv-pd-tab' + (tab === 'mota' ? ' active' : '')} onClick={() => setTab('mota')}>Mô tả chi tiết</button>
            <button className={'rv-pd-tab' + (tab === 'baoquan' ? ' active' : '')} onClick={() => setTab('baoquan')}>Bảo quản &amp; vận chuyển</button>
            <button className={'rv-pd-tab' + (tab === 'danhgia' ? ' active' : '')} onClick={() => setTab('danhgia')}>Đánh giá</button>
          </div>
          <div className={'rv-pd-tabpanel' + (tab === 'mota' ? ' active' : '')}>
            <p>{product.description}</p>
            {occasions.length > 0 && <p>Phù hợp dùng trong các dịp: <strong>{occasions.map(o => OCCASION_LABEL[o] ?? o).join(', ')}</strong>.</p>}
          </div>
          <div className={'rv-pd-tabpanel' + (tab === 'baoquan' ? ' active' : '')}>
            <p>Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp, nhiệt độ lý tưởng 14–16°C. Đặt chai nằm ngang nếu có nút bần để giữ ẩm nút, tránh oxy hóa sớm.</p>
            <p>Giao hàng nội thành Hà Nội &amp; TP.HCM trong 2 giờ (đặt trước 17h), các tỉnh thành khác 2–4 ngày làm việc bằng xe chuyên dụng chống sốc, chống nóng.</p>
            <p>Đổi trả miễn phí trong 24h nếu sản phẩm bị vỡ, sai mẫu hoặc lỗi do vận chuyển — vui lòng giữ nguyên bao bì và liên hệ hotline ngay khi nhận hàng.</p>
          </div>
          <div className={'rv-pd-tabpanel' + (tab === 'danhgia' ? ' active' : '')}>
            <p>Đánh giá trung bình <strong>{product.rating.toFixed(1)}</strong>/5 từ khách hàng đã mua sản phẩm. Chức năng gửi đánh giá minh họa — số liệu hiển thị mang tính demo.</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="sec-pad" style={{ paddingTop: 0 }}>
          <div className="rv-sec-head" data-reveal>
            <div className="rv-eyebrow">Có thể bạn thích</div>
            <h2 className="rv-sec-title">Sản phẩm <span>tương tự</span></h2>
          </div>
          <div className="rv-related-grid">
            {related.map(p => <RelatedCard key={p.id} p={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
