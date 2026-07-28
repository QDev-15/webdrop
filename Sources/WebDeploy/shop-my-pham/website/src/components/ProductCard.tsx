import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'
import { fmtPrice, badgeLabel, BADGE_COLORS, onImgError } from '../lib/format'

// Thẻ sản phẩm dùng chung (trang chủ theo section/danh sách/bộ sưu tập/liên quan) — port từ
// mpRenderCard() trong assets/js/products-data.js của template gốc.
export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
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
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div className="mp-card" data-product-id={product.id}>
      <Link to={`/san-pham/${product.slug}`} className="mp-card-img-wrap" aria-label={product.name}>
        <img src={product.image} alt={product.name} className="mp-card-img" loading="lazy" onError={onImgError} />
        {product.badge && (
          <span className="mp-badge" style={{ background: BADGE_COLORS[product.badge] || '#a99a93' }} aria-label={badgeLabel(product.badge)}>
            {badgeLabel(product.badge)}
          </span>
        )}
      </Link>
      <div className="mp-card-body">
        <div className="mp-card-brand">{product.brand}</div>
        <div className="mp-card-name"><Link to={`/san-pham/${product.slug}`}>{product.name}</Link></div>
        <div className="mp-card-price">
          {product.price_sale ? (
            <>
              <span className="mp-price-current mp-price-sale">{fmtPrice(product.price_sale)}</span>
              <span className="mp-price-original">{fmtPrice(product.price)}</span>
            </>
          ) : (
            <span className="mp-price-current">{fmtPrice(product.price)}</span>
          )}
        </div>
        <div className="mp-card-meta">⭐ {product.rating} · Đã bán {product.sold}+</div>
        <div className="mp-card-trust"><span>✓ Chính hãng</span> · Đổi trả 30 ngày</div>
        <button className="mp-btn-cart" type="button" onClick={handleAddToCart} aria-label={`Thêm ${product.name} vào giỏ`}>
          {added ? '✓ Đã thêm' : '+ Thêm vào giỏ'}
        </button>
      </div>
    </div>
  )
}
