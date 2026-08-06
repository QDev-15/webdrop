import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'
import { fmt, stars } from '../lib/format'

function badgeInfo(badge: string, stock: boolean): { text: string; cls: string } | null {
  if (!stock) return { text: 'Hết hàng', cls: 'vp-prod-badge-out' }
  if (badge === 'new') return { text: 'Mới', cls: 'vp-prod-badge-new' }
  if (badge === 'sale') return { text: 'Giảm', cls: 'vp-prod-badge-sale' }
  if (badge === 'hot') return { text: 'Hot', cls: 'vp-prod-badge-hot' }
  return null
}

// Thẻ sản phẩm dùng chung (trang chủ/khuyến mãi/sản phẩm liên quan) — port từ hàm renderGrid()
// trong products-data.js gốc (badgeHtml/renderStars/formatPrice).
export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const stock = product.in_stock === 1
  const badge = badgeInfo(product.badge, stock)
  const effectivePrice = product.price_sale ? product.price_sale : product.price

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!stock) return
    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: effectivePrice,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <article className="vp-prod-card" data-id={product.id}>
      <Link to={`/san-pham/${product.slug}`} className="vp-prod-img" aria-label={product.name}>
        <img src={product.image} alt={product.name} loading="lazy" />
        {badge && <span className={`vp-prod-badge ${badge.cls}`}>{badge.text}</span>}
        <span className="vp-prod-fav" aria-label="Yêu thích">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
        </span>
      </Link>
      <div className="vp-prod-body">
        <div className="vp-prod-brand">{product.brand}</div>
        <h3 className="vp-prod-name"><Link to={`/san-pham/${product.slug}`}>{product.name}</Link></h3>
        <div className="vp-prod-rating">
          <span className="vp-rating-stars" aria-label={`${product.rating} sao`}>{stars(product.rating)}</span>
          <span>{product.rating} ({product.sold.toLocaleString('vi-VN')})</span>
        </div>
        <div className="vp-prod-price">
          <span className={product.price_sale ? 'vp-price-main vp-price-sale' : 'vp-price-main'}>{fmt(effectivePrice)}</span>
          {!!product.price_sale && <span className="vp-price-old">{fmt(product.price)}</span>}
        </div>
        <div className="vp-prod-actions">
          <button className="vp-btn-add" disabled={!stock} onClick={handleAddToCart}>
            {!stock ? 'Hết hàng' : added ? '✓ Đã thêm' : '+ Thêm vào giỏ'}
          </button>
          <Link to={`/san-pham/${product.slug}`} className="vp-btn-detail" aria-label={`Xem chi tiết ${product.name}`}>Chi tiết</Link>
        </div>
      </div>
    </article>
  )
}
