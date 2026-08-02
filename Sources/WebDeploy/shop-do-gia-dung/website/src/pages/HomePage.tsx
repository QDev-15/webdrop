import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSite, Product } from '../contexts/SiteContext'
import HeroSlider from '../components/HeroSlider'
import { useCart } from '../contexts/CartContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f5ede0' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23a89282' font-size='14'%3E%F0%9F%8F%A0%3C/text%3E%3C/svg%3E"

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      product_id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image || '',
      price: product.salePrice ?? product.price,
      color: '',
      size: '',
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const badgeClass = product.badge === 'sale' ? 'dg-badge--sale'
    : product.badge === 'new' ? 'dg-badge--new'
    : 'dg-badge--hot'

  const badgeLabel = product.badge === 'sale' ? 'Sale'
    : product.badge === 'new' ? 'Mới'
    : product.badge || ''

  return (
    <div className="dg-card" data-reveal>
      <Link to={`/san-pham/${product.slug}`} className="dg-card__img-wrap">
        <img
          className="dg-card__img"
          src={product.image || ''}
          alt={product.name}
          loading="lazy"
          onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG }}
        />
        {badgeLabel && <span className={`dg-badge ${badgeClass}`}>{badgeLabel}</span>}
      </Link>
      <div className="dg-card__body">
        {product.categoryName && <p className="dg-card__cat">{product.categoryName}</p>}
        <h3 className="dg-card__name">
          <Link to={`/san-pham/${product.slug}`}>{product.name}</Link>
        </h3>
        {product.rating != null && (
          <div className="dg-card__meta">
            <span className="dg-card__stars">{'★'.repeat(Math.round(product.rating ?? 5))}</span>
            {product.sold != null && <span className="dg-card__sold">Đã bán {product.sold}</span>}
          </div>
        )}
        <div className="dg-card__footer">
          <div className="dg-card__prices">
            {product.salePrice ? (
              <>
                <span className="dg-price dg-price--sale">{product.salePrice.toLocaleString('vi-VN')}đ</span>
                <span className="dg-price dg-price--old">{product.price.toLocaleString('vi-VN')}đ</span>
              </>
            ) : (
              <span className="dg-price">{product.price.toLocaleString('vi-VN')}đ</span>
            )}
          </div>
          <button
            className={`dg-btn--cart${added ? ' dg-btn--added' : ''}`}
            onClick={handleAdd}
            title={added ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ'}
          >
            {added ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M5 13l4 4L19 7"/></svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

interface SectionProps {
  title: string
  theme: string
  products: Product[]
  seeAllHref: string
}

function ProductSection({ title, theme: sectionTheme, products: allProducts, seeAllHref }: SectionProps) {
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const base = allProducts.filter(p => p.theme && p.theme.includes(sectionTheme))
    if (!q.trim()) return base
    const ql = q.toLowerCase()
    return base.filter(p => p.name.toLowerCase().includes(ql) || (p.categoryName || '').toLowerCase().includes(ql))
  }, [allProducts, sectionTheme, q])

  if (filtered.length === 0 && !q) return null

  return (
    <section className="dg-section">
      <div className="dg-container">
        <div className="dg-section__head">
          <div>
            <p className="dg-section__label">{sectionTheme === 'ban-chay' ? '🔥 Nổi bật' : sectionTheme === 'moi-ve' ? '✨ Hàng mới' : '💰 Tiết kiệm'}</p>
            <h2 className="dg-section__title">{title}</h2>
          </div>

          <div className="dg-section__search">
            <input
              className="dg-section__search-input"
              type="text"
              placeholder="Tìm trong mục này..."
              value={q}
              onChange={e => setQ(e.target.value)}
            />
            <span className="dg-section__search-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </span>
          </div>

          <Link to={seeAllHref} className="dg-section__see-all">
            Xem tất cả
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>

        {filtered.length > 0 ? (
          <div className="dg-grid dg-grid--4">
            {filtered.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="dg-section__empty">Không tìm thấy sản phẩm phù hợp.</div>
        )}
      </div>
    </section>
  )
}

export default function HomePage() {
  const { products, categories, settings } = useSite()

  useDocumentMeta({
    title: `${String(settings.site_name || 'Shop Đồ Gia Dụng')} – Chất Lượng & Giá Tốt`,
    description: 'Khám phá bộ sưu tập đồ gia dụng, nội thất nhỏ, đèn chiếu sáng và trang trí nhà với chất lượng cao và giá cạnh tranh.',
  })

  return (
    <>
      <HeroSlider categories={categories} />

      <ProductSection
        title="Sản phẩm bán chạy"
        theme="ban-chay"
        products={products}
        seeAllHref="/san-pham?theme=ban-chay"
      />

      <ProductSection
        title="Hàng mới về"
        theme="moi-ve"
        products={products}
        seeAllHref="/san-pham?theme=moi-ve"
      />

      <ProductSection
        title="Đang giảm giá"
        theme="giam-gia"
        products={products}
        seeAllHref="/san-pham?theme=giam-gia"
      />

      {/* Policy strip */}
      <section className="dg-section dg-section--alt" style={{ padding: 'clamp(32px,5vw,52px) 0' }}>
        <div className="dg-container">
          <div className="dg-policy-row" data-reveal>
            {[
              { icon: '🚚', title: 'Miễn phí vận chuyển', desc: 'Đơn hàng từ 500.000đ được miễn phí giao hàng toàn quốc' },
              { icon: '🔄', title: 'Đổi trả dễ dàng', desc: 'Đổi trả trong vòng 30 ngày nếu sản phẩm lỗi hoặc không vừa ý' },
              { icon: '✅', title: 'Hàng chính hãng', desc: 'Cam kết 100% sản phẩm chính hãng, nguồn gốc rõ ràng' },
              { icon: '💬', title: 'Hỗ trợ 24/7', desc: 'Đội ngũ tư vấn sẵn sàng giải đáp mọi thắc mắc của bạn' },
            ].map((p, i) => (
              <div className="dg-policy-item" key={i}>
                <div className="dg-policy-icon" style={{ fontSize: 22 }}>{p.icon}</div>
                <div>
                  <p className="dg-policy-title">{p.title}</p>
                  <p className="dg-policy-desc">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
