import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useCart } from '../contexts/CartContext'

const CATEGORY_ICONS: Record<string, JSX.Element> = {
  'nha-bep': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  'trang-tri': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  'phong-tam': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 12c0-1.1.9-2 2-2h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8z" /><rect x="7" y="2" width="10" height="4" /></svg>,
  'noi-that-nho': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2" /></svg>,
  'den-anh-sang': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>,
}

interface ProductCardProps {
  product: any
}

function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image || '',
      price: product.salePrice || product.price,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="dg-card" data-slug={product.slug}>
      <Link to={`/san-pham/${product.slug}`} className="dg-card-link">
        <div className="dg-card-image">
          <img src={product.image} alt={product.name} onError={e => {
            const img = e.target as HTMLImageElement
            img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23e8e5df' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='14'%3EHình ảnh không có%3C/text%3E%3C/svg%3E`
          }} />
          {product.badge && <span className="dg-card-badge">{product.badge === 'sale' ? 'Sale' : 'Hot'}</span>}
        </div>
        <h3 className="dg-card-name">{product.name}</h3>
        <p className="dg-card-desc">{product.description}</p>
      </Link>
      <div className="dg-card-footer">
        <div className="dg-card-price">
          {product.salePrice ? (
            <>
              <span className="dg-card-price-sale">{(product.salePrice || 0).toLocaleString('vi-VN')}đ</span>
              <span className="dg-card-price-orig">{(product.price).toLocaleString('vi-VN')}đ</span>
            </>
          ) : (
            <span className="dg-card-price-sale">{(product.price).toLocaleString('vi-VN')}đ</span>
          )}
        </div>
        <div className="dg-card-actions">
          <button className={`dg-card-btn ${added ? 'added' : ''}`} onClick={handleAddToCart} title="Thêm vào giỏ hàng">
            {added ? '✓ Đã thêm' : 'Thêm giỏ'}
          </button>
          <Link to={`/san-pham/${product.slug}`} className="dg-card-btn-secondary" title="Mua ngay">Mua ngay</Link>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { settings, products, categories } = useSite()
  useDocumentMeta({
    title: (settings.meta_title as string) || `${String(settings.site_name || 'Nhà Đẹp Store')} — ${String(settings.site_slogan || 'Đồ Gia Dụng Chất Lượng Cao')}`,
    description: String(settings.meta_description || settings.site_description || ''),
  })

  const [noiBatSearch, setNoiBatSearch] = useState('')
  const [moiVeSearch, setMoiVeSearch] = useState('')

  // Filter products by theme
  const noiBatItems = useMemo(
    () => products.filter(p => p.theme?.includes('ban-chay') || p.theme?.split(',').includes('ban-chay')).slice(0, 12),
    [products]
  )
  const moiVeItems = useMemo(
    () => products.filter(p => p.theme?.includes('moi-ve') || p.theme?.split(',').includes('moi-ve')).slice(0, 12),
    [products]
  )
  const giamGiaItems = useMemo(
    () => products.filter(p => p.theme?.includes('giam-gia') || p.theme?.split(',').includes('giam-gia')).slice(0, 12),
    [products]
  )

  const noiBatFiltered = noiBatItems.filter(p => !noiBatSearch || p.name.toLowerCase().includes(noiBatSearch.toLowerCase()))
  const moiVeFiltered = moiVeItems.filter(p => !moiVeSearch || p.name.toLowerCase().includes(moiVeSearch.toLowerCase()))

  return (
    <>
      {/* Search Zone (Hero) */}
      <section id="dg-search-zone" aria-labelledby="dg-sz-heading">
        <div className="dg-container">
          <div className="dg-search-zone__content">
            <h1 className="dg-search-zone__h1" id="dg-sz-heading">
              Tất cả sản phẩm <em>gia dụng</em>
            </h1>
            <p className="dg-search-zone__sub">Tìm trong hơn 40 sản phẩm đồ gia dụng chất lượng cao</p>
            <form className="dg-search-zone__form" onSubmit={e => {
              e.preventDefault()
              const input = (e.currentTarget.querySelector('input') as HTMLInputElement)
              if (input?.value) window.location.href = `/san-pham?q=${encodeURIComponent(input.value)}`
            }}>
              <input type="text" className="dg-search-zone__input" placeholder="Bạn muốn tìm gì? (nồi, đèn, khung ảnh...)" aria-label="Tìm kiếm sản phẩm" />
              <button type="submit" className="dg-search-zone__submit">Tìm kiếm</button>
            </form>
            <div className="dg-search-zone__cats">
              {categories.map(cat => (
                <Link key={cat.slug} to={`/san-pham?category=${cat.slug}`} className="dg-search-zone__cat">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>{CATEGORY_ICONS[cat.slug as keyof typeof CATEGORY_ICONS]?.props?.children}</svg>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 1 — Bán chạy */}
      {noiBatItems.length > 0 && (
        <section className="dg-section" aria-labelledby="dg-s1-title">
          <div className="dg-container">
            <div className="dg-section__head">
              <div>
                <p className="dg-section__label">Được yêu thích</p>
                <h2 className="dg-section__title" id="dg-s1-title">Bán chạy nhất</h2>
              </div>
              <div className="dg-section__search">
                <input type="text" className="dg-section__search-input" placeholder="Tìm trong mục này..." aria-label="Tìm trong bán chạy" value={noiBatSearch} onChange={e => setNoiBatSearch(e.target.value)} />
                <svg className="dg-section__search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              </div>
              <Link to="/san-pham?theme=ban-chay" className="dg-section__see-all">
                Xem tất cả <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
            <div className="dg-grid dg-grid--4">
              {noiBatFiltered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            {noiBatFiltered.length === 0 && <p className="dg-section__empty">Không tìm thấy sản phẩm phù hợp.</p>}
          </div>
        </section>
      )}

      {/* Section 2 — Hàng mới về */}
      {moiVeItems.length > 0 && (
        <section className="dg-section dg-section--alt" aria-labelledby="dg-s2-title">
          <div className="dg-container">
            <div className="dg-section__head">
              <div>
                <p className="dg-section__label">Mới nhập kho</p>
                <h2 className="dg-section__title" id="dg-s2-title">Hàng mới về</h2>
              </div>
              <div className="dg-section__search">
                <input type="text" className="dg-section__search-input" placeholder="Tìm trong mục này..." aria-label="Tìm trong hàng mới" value={moiVeSearch} onChange={e => setMoiVeSearch(e.target.value)} />
                <svg className="dg-section__search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              </div>
              <Link to="/san-pham?theme=moi-ve" className="dg-section__see-all">
                Xem tất cả <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
            <div className="dg-grid dg-grid--4">
              {moiVeFiltered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            {moiVeFiltered.length === 0 && <p className="dg-section__empty">Không tìm thấy sản phẩm phù hợp.</p>}
          </div>
        </section>
      )}

      {/* Section 3 — Đang giảm */}
      {giamGiaItems.length > 0 && (
        <section className="dg-section" aria-labelledby="dg-s3-title">
          <div className="dg-container">
            <div className="dg-section__head">
              <div>
                <p className="dg-section__label">Khuyến mãi</p>
                <h2 className="dg-section__title" id="dg-s3-title">Đang giảm giá</h2>
              </div>
              <Link to="/san-pham?theme=giam-gia" className="dg-section__see-all">
                Xem tất cả <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
            <div className="dg-grid dg-grid--4">
              {giamGiaItems.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            {giamGiaItems.length === 0 && <p className="dg-section__empty">Không có sản phẩm đang giảm giá.</p>}
          </div>
        </section>
      )}
    </>
  )
}
