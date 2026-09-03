import { Link } from 'react-router-dom'
import type { Product } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'
import { fmtVND } from '../data/filters'

const BADGE_LABEL: Record<string, string> = { new: 'Mới', sale: 'Giảm giá', hot: 'Hot' }

// Card khớp .dh-card trong template gốc (san-pham.html/index.html). Nút "Yêu thích" (.dh-card-wish)
// hiện diện nhưng KHÔNG có JS handler trong template gốc — giữ nguyên hành vi decorative, không wire.
export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()

  const sale = product.price_sale != null && product.price_sale > 0 && product.price_sale < product.price
  const badgeLabel = BADGE_LABEL[product.badge] || ''
  const price = sale ? product.price_sale! : product.price

  const handleAdd = () => {
    if (!product.in_stock) return
    addItem({ product_id: product.id, name: product.name, slug: product.slug, image: product.image, price })
  }

  return (
    <div className={'dh-card' + (!product.in_stock ? ' dh-card-stock-out' : '')}>
      <div className="dh-card-thumb">
        {badgeLabel && <span className={`dh-card-badge ${product.badge}`}>{badgeLabel}</span>}
        <button className="dh-card-wish" aria-label="Yêu thích">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" /></svg>
        </button>
        <Link to={`/san-pham/${product.slug}`}>
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>
      </div>
      <div className="dh-card-body">
        <div className="dh-card-brand">{product.brand}</div>
        <h3 className="dh-card-name"><Link to={`/san-pham/${product.slug}`}>{product.name}</Link></h3>
        <div className="dh-card-meta">
          <span className="dh-card-rating">★ {product.rating}</span><span>·</span><span>Đã bán {product.sold}</span>
        </div>
        <div className="dh-card-price-row">
          <span className="dh-card-price">{fmtVND(price)}</span>
          {sale && <span className="dh-card-price-old">{fmtVND(product.price)}</span>}
        </div>
        <button className="dh-card-add" disabled={!product.in_stock} onClick={handleAdd}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /></svg>
          {product.in_stock ? 'Thêm vào giỏ' : 'Hết hàng'}
        </button>
      </div>
    </div>
  )
}
