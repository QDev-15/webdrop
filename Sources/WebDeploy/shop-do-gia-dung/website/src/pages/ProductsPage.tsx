import { useState, useMemo, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useSite, Product } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f5ede0' width='400' height='300'/%3E%3C/svg%3E"
const PER_PAGE = 12
const MAX_PRICE = 3_000_000

function priceLabel(val: number) {
  return val >= MAX_PRICE ? 'Tất cả mức giá' : `Đến ${(val / 1000).toFixed(0)}K`
}

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      product_id: product.id, slug: product.slug, name: product.name,
      image: product.image || '', price: product.salePrice ?? product.price,
      color: '', size: ''
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const badgeLabel = product.badge === 'sale' ? 'Sale' : product.badge === 'new' ? 'Mới' : (product.badge || '')
  const badgeClass = product.badge === 'sale' ? 'dg-badge--sale' : product.badge === 'new' ? 'dg-badge--new' : 'dg-badge--hot'

  return (
    <div className="dg-card">
      <Link to={`/san-pham/${product.slug}`} className="dg-card__img-wrap">
        <img className="dg-card__img" src={product.image || ''} alt={product.name} loading="lazy"
          onError={e => { (e.target as HTMLImageElement).src = FALLBACK }} />
        {badgeLabel && <span className={`dg-badge ${badgeClass}`}>{badgeLabel}</span>}
      </Link>
      <div className="dg-card__body">
        {product.categoryName && <p className="dg-card__cat">{product.categoryName}</p>}
        <h3 className="dg-card__name"><Link to={`/san-pham/${product.slug}`}>{product.name}</Link></h3>
        {product.rating != null && (
          <div className="dg-card__meta">
            <span className="dg-card__stars">{'★'.repeat(Math.round(product.rating ?? 5))}</span>
            {product.sold != null && <span className="dg-card__sold">Đã bán {product.sold}</span>}
          </div>
        )}
        {/* Color swatches — hiển thị các chấm màu của sản phẩm */}
        {product.colors && (() => {
          const swatches = product.colors.split('|').filter(Boolean).map(p => {
            const [n, h] = p.split(':')
            return { name: n?.trim() ?? '', hex: h?.trim() ?? '#ccc' }
          }).filter(s => s.name)
          if (!swatches.length) return null
          return (
            <div className="dg-card__colors">
              {swatches.slice(0, 5).map(s => (
                <span key={s.name} className="dg-card__color-dot" style={{ background: s.hex }} title={s.name} />
              ))}
              {swatches.length > 5 && <span className="dg-card__color-more">+{swatches.length - 5}</span>}
            </div>
          )
        })()}
        <div className="dg-card__footer">
          <div className="dg-card__prices">
            {product.salePrice
              ? <>
                  <span className="dg-price dg-price--sale">{product.salePrice.toLocaleString('vi-VN')}đ</span>
                  <span className="dg-price dg-price--old">{product.price.toLocaleString('vi-VN')}đ</span>
                </>
              : <span className="dg-price">{product.price.toLocaleString('vi-VN')}đ</span>}
          </div>
          <button className={`dg-btn--cart${added ? ' dg-btn--added' : ''}`} onClick={handleAdd}
            title={added ? 'Đã thêm' : 'Thêm vào giỏ'}>
            {added
              ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M5 13l4 4L19 7"/></svg>
              : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const { products, categories, settings } = useSite()
  const [searchParams, setSearchParams] = useSearchParams()

  // ── Filter state ──
  const [catFilter, setCatFilter]     = useState(searchParams.get('category') || '')
  const [themeFilter, setThemeFilter] = useState(searchParams.get('theme') || '')
  const [searchQ, setSearchQ]         = useState(searchParams.get('q') || '')
  const [priceMax, setPriceMax]       = useState(MAX_PRICE)
  const [colorFilters, setColorFilters] = useState<string[]>([])
  const [sort, setSort]               = useState('')
  const [page, setPage]               = useState(1)

  // ── Dropdown open state ──
  const [priceOpen, setPriceOpen] = useState(false)
  const [colorOpen, setColorOpen] = useState(false)

  // ── Mobile offcanvas state ──
  const [mobOpen, setMobOpen]         = useState(false)
  const [mobStagedCat, setMobStagedCat] = useState('')
  const [mobSearch, setMobSearch]     = useState('')
  const [mobPriceMax, setMobPriceMax] = useState(MAX_PRICE)
  const [mobColors, setMobColors]     = useState<string[]>([])

  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>()

  useDocumentMeta({
    title: `Sản phẩm – ${String(settings.site_name || 'Nhà Đẹp Store')}`,
    description: 'Khám phá toàn bộ sản phẩm đồ gia dụng: nhà bếp, trang trí, phòng tắm, đèn chiếu sáng và nội thất nhỏ. Lọc theo danh mục, giá, màu sắc.',
  })

  // ── Đọc URL params ──
  useEffect(() => {
    setCatFilter(searchParams.get('category') || '')
    setThemeFilter(searchParams.get('theme') || '')
    setSearchQ(searchParams.get('q') || '')
    setPage(1)
  }, [searchParams])

  // ── Đóng dropdown khi click ra ngoài ──
  useEffect(() => {
    const handler = () => { setPriceOpen(false); setColorOpen(false) }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  // ── Khóa scroll khi mobile offcanvas mở ──
  useEffect(() => {
    document.body.style.overflow = mobOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobOpen])

  // ── Màu sắc unique từ DB ──
  const colorOptions = useMemo(() => {
    const map = new Map<string, string>()
    products.forEach(p => {
      if (p.colors) {
        p.colors.split('|').filter(Boolean).forEach(part => {
          const [name, hex] = part.split(':')
          if (name && hex && !map.has(name.trim())) map.set(name.trim(), hex.trim())
        })
      }
    })
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }))
  }, [products])

  // ── Lọc + sắp xếp client-side ──
  const filtered = useMemo(() => {
    let result = [...products]
    if (catFilter)   result = result.filter(p => p.category === catFilter)
    if (themeFilter) result = result.filter(p => p.theme && p.theme.includes(themeFilter))
    if (searchQ.trim()) {
      const ql = searchQ.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(ql) ||
        (p.description || '').toLowerCase().includes(ql) ||
        (p.categoryName || '').toLowerCase().includes(ql)
      )
    }
    if (priceMax < MAX_PRICE) {
      result = result.filter(p => (p.salePrice ?? p.price) <= priceMax)
    }
    if (colorFilters.length > 0) {
      result = result.filter(p => colorFilters.some(c => p.colors && p.colors.includes(c)))
    }
    switch (sort) {
      case 'price-asc':  result.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price)); break
      case 'price-desc': result.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price)); break
      case 'name-asc':   result.sort((a, b) => a.name.localeCompare(b.name, 'vi')); break
      case 'newest':     result.sort((a, b) => b.id - a.id); break
      case 'bestseller': result.sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0)); break
      case 'sale':
        result = [...result.filter(p => p.salePrice), ...result.filter(p => !p.salePrice)]; break
    }
    return result
  }, [products, catFilter, themeFilter, searchQ, priceMax, colorFilters, sort])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paged      = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  // Số filter đang active (cho badge mobile)
  const activeCount = [catFilter ? 1 : 0, colorFilters.length, priceMax < MAX_PRICE ? 1 : 0].reduce((a, b) => a + b, 0)

  const clearFilters = () => {
    setCatFilter(''); setThemeFilter(''); setSearchQ('')
    setPriceMax(MAX_PRICE); setColorFilters([])
    setSort(''); setPage(1)
    setSearchParams({}, { replace: true })
  }

  const toggleColor = (name: string) => {
    setColorFilters(prev => prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name])
    setPage(1)
  }

  const openMob = () => {
    setMobStagedCat(catFilter)
    setMobSearch(searchQ)
    setMobPriceMax(priceMax)
    setMobColors([...colorFilters])
    setMobOpen(true)
  }

  const applyMob = () => {
    setCatFilter(mobStagedCat)
    setSearchQ(mobSearch)
    setPriceMax(mobPriceMax)
    setColorFilters(mobColors)
    setPage(1)
    setMobOpen(false)
  }

  const resetMob = () => {
    setMobOpen(false)
    clearFilters()
  }

  const goPage = (pg: number) => {
    setPage(pg)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Page hero */}
      <div className="dg-page-hero">
        <div className="dg-container">
          <p className="dg-page-hero__label">Cửa hàng</p>
          <h1 className="dg-page-hero__title">
            {catFilter ? (categories.find(c => c.slug === catFilter)?.name || 'Sản phẩm') : 'Tất cả sản phẩm'}
          </h1>
          <p className="dg-page-hero__sub">Khám phá bộ sưu tập đồ gia dụng chất lượng cao, được tuyển chọn kỹ lưỡng.</p>
        </div>
      </div>

      <main className="dg-container sec-pad" style={{ paddingTop: 32 }}>

        {/* ── Filter bar ── */}
        <div className="dg-filter-bar">

          {/* Row 1: Category pills + mobile filter btn */}
          <div className="dg-filter-bar__row">
            <div className="dg-cat-pills">
              <button className={`dg-cat-pill${catFilter === '' ? ' active' : ''}`}
                onClick={() => { setCatFilter(''); setPage(1) }}>
                Tất cả
              </button>
              {categories.map(cat => (
                <button key={cat.id}
                  className={`dg-cat-pill${catFilter === cat.slug ? ' active' : ''}`}
                  onClick={() => { setCatFilter(cat.slug); setPage(1) }}>
                  {cat.name}
                </button>
              ))}
            </div>
            <button className="dg-filter-mob-btn" onClick={openMob}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
              </svg>
              Bộ lọc
              {activeCount > 0 && <span className="dg-count">{activeCount}</span>}
            </button>
          </div>

          {/* Row 2: Search + dropdowns + sort (desktop) */}
          <div className="dg-filter-bar__row desktop-filters">

            {/* Search */}
            <div style={{ position: 'relative', flex: '0 0 220px' }}>
              <input
                type="text"
                value={searchQ}
                onChange={e => {
                  const v = e.target.value
                  setSearchQ(v)
                  clearTimeout(searchTimerRef.current)
                  searchTimerRef.current = setTimeout(() => setPage(1), 300)
                }}
                placeholder="Tìm theo tên..."
                aria-label="Tìm theo tên"
                style={{ width: '100%', height: 36, border: '1.5px solid var(--border)', borderRadius: 'var(--radius-btn)', padding: '0 36px 0 14px', fontSize: 13.5, background: 'var(--bg)', outline: 'none', fontFamily: 'var(--sans)', color: 'var(--text)' }}
              />
              <svg style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }}
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>

            {/* Price dropdown */}
            <div className="dg-filter-dropdown" onClick={e => e.stopPropagation()}>
              <button
                className={`dg-filter-dropdown__btn${priceOpen ? ' open' : ''}`}
                onClick={() => { setPriceOpen(o => !o); setColorOpen(false) }}>
                Khoảng giá
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              <div className={`dg-filter-dropdown__menu${priceOpen ? ' open' : ''}`}>
                <div className="dg-price-range">
                  <input
                    type="range"
                    min={0}
                    max={MAX_PRICE}
                    step={50000}
                    value={priceMax}
                    onChange={e => { setPriceMax(Number(e.target.value)); setPage(1) }}
                  />
                  <span className="dg-price-range__vals">{priceLabel(priceMax)}</span>
                </div>
              </div>
            </div>

            {/* Color dropdown */}
            {colorOptions.length > 0 && (
              <div className="dg-filter-dropdown" onClick={e => e.stopPropagation()}>
                <button
                  className={`dg-filter-dropdown__btn${colorOpen ? ' open' : ''}`}
                  onClick={() => { setColorOpen(o => !o); setPriceOpen(false) }}>
                  Màu sắc
                  {colorFilters.length > 0 && <span className="dg-count">{colorFilters.length}</span>}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>
                <div className={`dg-filter-dropdown__menu${colorOpen ? ' open' : ''}`}>
                  {colorOptions.map(({ name, hex }) => (
                    <label key={name} className="dg-filter-option">
                      <input
                        type="checkbox"
                        checked={colorFilters.includes(name)}
                        onChange={() => toggleColor(name)}
                      />
                      <span>
                        <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: hex, border: '1px solid rgba(0,0,0,.15)', marginRight: 6, verticalAlign: 'middle' }} />
                        {name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Sort */}
            <select className="dg-sort-select" value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}>
              <option value="">Sắp xếp mặc định</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="name-asc">Tên A–Z</option>
              <option value="newest">Mới nhất</option>
              <option value="sale">Đang giảm giá</option>
              <option value="bestseller">Bán chạy nhất</option>
            </select>

            {/* Result count */}
            <span className="dg-result-count">{filtered.length} sản phẩm</span>
          </div>
        </div>

        {/* Active filter chips */}
        {(catFilter || themeFilter || searchQ || priceMax < MAX_PRICE || colorFilters.length > 0) && (
          <div className="dg-active-chips">
            {catFilter && (
              <span className="dg-chip" onClick={() => { setCatFilter(''); setPage(1) }}>
                📂 {categories.find(c => c.slug === catFilter)?.name || catFilter} <span className="dg-chip__x">×</span>
              </span>
            )}
            {themeFilter && (
              <span className="dg-chip" onClick={() => { setThemeFilter(''); setPage(1) }}>
                🏷 {themeFilter} <span className="dg-chip__x">×</span>
              </span>
            )}
            {searchQ && (
              <span className="dg-chip" onClick={() => { setSearchQ(''); setPage(1) }}>
                🔍 &ldquo;{searchQ}&rdquo; <span className="dg-chip__x">×</span>
              </span>
            )}
            {priceMax < MAX_PRICE && (
              <span className="dg-chip" onClick={() => { setPriceMax(MAX_PRICE); setPage(1) }}>
                💰 Đến {(priceMax / 1000).toFixed(0)}K <span className="dg-chip__x">×</span>
              </span>
            )}
            {colorFilters.map(c => (
              <span key={c} className="dg-chip" onClick={() => { setColorFilters(prev => prev.filter(x => x !== c)); setPage(1) }}>
                🎨 {c} <span className="dg-chip__x">×</span>
              </span>
            ))}
            <button className="dg-clear-all" onClick={clearFilters}>Xóa tất cả</button>
          </div>
        )}

        {/* Product grid */}
        {paged.length > 0 ? (
          <div className="dg-grid dg-grid--4">
            {paged.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="dg-empty-state">
            <div className="dg-empty-state__icon">🏡</div>
            <p className="dg-empty-state__text">Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại.</p>
            <button className="dg-btn dg-btn--outline" onClick={clearFilters}>Xóa bộ lọc</button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="dg-pagination" aria-label="Phân trang">
            <ul>
              <li className={`page-item${page === 1 ? ' disabled' : ''}`}>
                <button className="page-link" onClick={() => goPage(Math.max(1, page - 1))} disabled={page === 1} aria-label="Trang trước">‹</button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                <li key={pg} className={`page-item${pg === page ? ' active' : ''}`}>
                  <button className="page-link" onClick={() => goPage(pg)}>{pg}</button>
                </li>
              ))}
              <li className={`page-item${page === totalPages ? ' disabled' : ''}`}>
                <button className="page-link" onClick={() => goPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} aria-label="Trang sau">›</button>
              </li>
            </ul>
          </nav>
        )}
      </main>

      {/* ── Mobile offcanvas ── */}
      <div
        className={`dg-offcanvas__overlay${mobOpen ? ' open' : ''}`}
        onClick={() => setMobOpen(false)}
      />
      <div className={`dg-offcanvas${mobOpen ? ' open' : ''}`} role="dialog" aria-label="Bộ lọc sản phẩm">
        <div className="dg-offcanvas__header">
          <h2 className="dg-offcanvas__title">Bộ lọc</h2>
          <button className="dg-offcanvas__close" onClick={() => setMobOpen(false)} aria-label="Đóng">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div className="dg-offcanvas__body">
          {/* Tìm kiếm */}
          <div className="dg-offcanvas-group">
            <p className="dg-offcanvas-group__label">Tìm kiếm</p>
            <input
              type="text"
              value={mobSearch}
              onChange={e => setMobSearch(e.target.value)}
              placeholder="Tên sản phẩm..."
              aria-label="Tìm theo tên"
              style={{ width: '100%', height: 40, border: '1.5px solid var(--border)', borderRadius: 'var(--radius-btn)', padding: '0 14px', fontSize: 14, fontFamily: 'var(--sans)', outline: 'none', background: 'var(--bg)' }}
            />
          </div>
          {/* Danh mục */}
          <div className="dg-offcanvas-group">
            <p className="dg-offcanvas-group__label">Danh mục</p>
            <div className="dg-cat-pills" style={{ flexDirection: 'column', gap: 4 }}>
              <button
                className={`dg-cat-pill${mobStagedCat === '' ? ' active' : ''}`}
                style={{ textAlign: 'left', borderRadius: 6 }}
                onClick={() => setMobStagedCat('')}>
                Tất cả
              </button>
              {categories.map(cat => (
                <button key={cat.id}
                  className={`dg-cat-pill${mobStagedCat === cat.slug ? ' active' : ''}`}
                  style={{ textAlign: 'left', borderRadius: 6 }}
                  onClick={() => setMobStagedCat(cat.slug)}>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          {/* Khoảng giá */}
          <div className="dg-offcanvas-group">
            <p className="dg-offcanvas-group__label">Khoảng giá</p>
            <div className="dg-price-range" style={{ paddingBottom: 10 }}>
              <input
                type="range"
                min={0}
                max={MAX_PRICE}
                step={50000}
                value={mobPriceMax}
                onChange={e => setMobPriceMax(Number(e.target.value))}
              />
              <span className="dg-price-range__vals">{priceLabel(mobPriceMax)}</span>
            </div>
          </div>
          {/* Màu sắc */}
          {colorOptions.length > 0 && (
            <div className="dg-offcanvas-group">
              <p className="dg-offcanvas-group__label">Màu sắc</p>
              <div className="dg-offcanvas-options">
                {colorOptions.map(({ name, hex }) => (
                  <label key={name} className="dg-filter-option">
                    <input
                      type="checkbox"
                      checked={mobColors.includes(name)}
                      onChange={() => setMobColors(prev =>
                        prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
                      )}
                    />
                    <span>
                      <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: hex, border: '1px solid rgba(0,0,0,.15)', marginRight: 6, verticalAlign: 'middle' }} />
                      {name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="dg-offcanvas__footer">
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="dg-btn dg-btn--ghost dg-btn--sm" style={{ flex: 1 }} onClick={resetMob}>Xóa lọc</button>
            <button className="dg-btn dg-btn--primary dg-btn--sm" style={{ flex: 2 }} onClick={applyMob}>Xem kết quả</button>
          </div>
        </div>
      </div>
    </>
  )
}
