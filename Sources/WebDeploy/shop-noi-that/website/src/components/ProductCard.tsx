import { Link } from 'react-router-dom'
import type { Product } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../hooks/useWishlist'
import { fmtVND } from '../data/filters'
import { useState } from 'react'

const BADGE_LABEL: Record<string, string> = { sale: 'Giảm giá', new: 'Mới về', hot: 'Bán chạy' }

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { isWished, toggle } = useWishlist()
  const [added, setAdded] = useState(false)

  const sale = product.price_sale != null && product.price_sale > 0 && product.price_sale < product.price
  const badgeLabel = BADGE_LABEL[product.badge] || ''

  const handleAddCart = () => {
    addItem({ product_id: product.id, name: product.name, slug: product.slug, image: product.image, price: sale ? product.price_sale! : product.price })
    setAdded(true)
    setTimeout(() => setAdded(false), 1300)
  }

  return (
    <article className="nt-prod-card">
      <Link to={`/san-pham/${product.slug}`} className="nt-prod-thumb" aria-label={product.name}>
        {badgeLabel && <span className={`nt-prod-badge ${product.badge}`}>{badgeLabel}</span>}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={e => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500'%3E%3Crect width='400' height='500' fill='%23f3e9de'/%3E%3C/svg%3E" }}
        />
      </Link>
      <button className={'nt-prod-wish' + (isWished(product.id) ? ' active' : '')} aria-label="Yêu thích" onClick={() => toggle(product.id)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 000-7.6z" /></svg>
      </button>
      <Link to={`/san-pham/${product.slug}`}>
        <div className="nt-prod-cat">{product.category_name}</div>
        <h3 className="nt-prod-name">{product.name}</h3>
      </Link>
      <div className="nt-prod-meta">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7L5.8 21l1.6-7-5.4-4.7 7.1-.6z" /></svg>
        {product.rating} · Đã bán {product.sold}
      </div>
      <div className="nt-prod-price-row">
        {sale ? (
          <>
            <span className="nt-prod-price sale">{fmtVND(product.price_sale!)}</span>
            <span className="nt-prod-price-old">{fmtVND(product.price)}</span>
          </>
        ) : (
          <span className="nt-prod-price">{fmtVND(product.price)}</span>
        )}
      </div>
      <button className={'nt-prod-add' + (added ? ' added' : '')} onClick={handleAddCart}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
        <span className="label">{added ? 'Đã thêm' : 'Thêm vào giỏ'}</span>
      </button>
    </article>
  )
}
