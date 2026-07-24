import { Link } from 'react-router-dom'
import type { Product } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'
import { fmtPrice, catLabel, badgeLabel, parseColor, onImgError } from '../lib/format'

// Thẻ sản phẩm dùng chung (trang chủ theo section/danh sách/bộ sưu tập/liên quan) — port từ
// productCardHTML()/prodCardHTML() trong template gốc (index.html/san-pham.html).
export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const effectivePrice = product.price_sale ?? product.price
  const color = parseColor(product.colors)

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
  }

  return (
    <article className="am-prod-card" role="listitem">
      <Link to={`/san-pham/${product.slug}`} className="am-prod-img-link">
        <img src={product.image} alt={product.name} className="am-prod-img" loading="lazy" onError={onImgError} />
        {product.badge && (
          <span className={`am-prod-badge ${product.badge}`}>{badgeLabel(product.badge)}</span>
        )}
        <button className="am-quick-add" type="button" onClick={handleAddToCart}>Thêm vào giỏ</button>
      </Link>
      <div className="am-prod-body">
        <span className="am-prod-cat">{catLabel(product.category_slug)}</span>
        <h3 className="am-prod-name">
          <Link to={`/san-pham/${product.slug}`}>{product.name}</Link>
        </h3>
        <div className="am-prod-foot">
          <div className="am-prod-price">
            {product.price_sale ? (
              <>
                <span className="am-price am-price-sale">{fmtPrice(product.price_sale)}</span>
                <span className="am-price-orig">{fmtPrice(product.price)}</span>
              </>
            ) : (
              <span className="am-price">{fmtPrice(product.price)}</span>
            )}
          </div>
          {color && (
            <div className="am-color-dots">
              <span className="am-cdot" style={{ background: color.hex }} title={color.name}></span>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
