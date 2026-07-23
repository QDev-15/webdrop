import { Link } from 'react-router-dom'
import type { Product } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'
import { fmt, stars, BADGE_LABEL } from '../lib/format'
import { showCartToast } from '../lib/toast'

// Thẻ sản phẩm dùng chung (trang chủ theo section/danh sách/khuyến mãi/sản phẩm liên quan) —
// port từ hàm cardHtml() trong template gốc, tương đương addToCartById/quickAddToCart.
export default function ProductCard({ product, wrapClass = '' }: { product: Product; wrapClass?: string }) {
  const { addItem } = useCart()
  const effectivePrice = product.price_sale ?? product.price

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: effectivePrice,
    })
    showCartToast(`Đã thêm "${product.name}" vào giỏ hàng`)
    const btn = e.currentTarget as HTMLElement
    btn.classList.add('is-added')
    setTimeout(() => btn.classList.remove('is-added'), 900)
  }

  return (
    <div className={`mb-prod-card ${wrapClass}`.trim()}>
      <div className="mb-prod-thumb">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.badge && BADGE_LABEL[product.badge] && (
          <span className={`mb-prod-badge ${product.badge}`}>{BADGE_LABEL[product.badge]}</span>
        )}
      </div>
      <div className="mb-prod-body">
        <div className="mb-prod-brand">{product.brand}</div>
        <div className="mb-prod-name">{product.name}</div>
        <div className="mb-prod-rating">
          <span className="stars">{stars(product.rating)}</span>
          <span className="count">({product.sold})</span>
        </div>
        <div className="mb-prod-price">
          <span className="mb-prod-price-now">{fmt(effectivePrice)}</span>
          {product.price_sale != null && <span className="mb-prod-price-was">{fmt(product.price)}</span>}
        </div>
      </div>
      <div className="mb-prod-foot">
        <span className="mb-prod-sold">Đã bán {product.sold}</span>
        <div className="mb-prod-actions">
          <Link to={`/san-pham/${product.slug}`} className="mb-prod-btn">Xem</Link>
          <button type="button" className="mb-prod-cart-btn" aria-label="Thêm vào giỏ hàng" onClick={handleAddToCart}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
