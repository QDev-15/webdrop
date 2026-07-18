import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import { useSite, type Product } from '../contexts/SiteContext'

const PER_PAGE = 8

// Phải khớp 100% với COLOR_SWATCHES ở admin/src/pages/products/ProductForm.tsx
const COLOR_SWATCHES = [
  { name: 'Nâu da bò', hex: '#3b2a1e' },
  { name: 'Đen', hex: '#0e0c0a' },
  { name: 'Burgundy', hex: '#7a2e3a' },
  { name: 'Vàng đồng', hex: '#c9a24d' },
  { name: 'Kem', hex: '#e8ded0' },
]

const SIZE_OPTIONS = ['S', 'M', 'L', 'XL']
const MAX_PRICE = 10000000

export default function ProductsPage() {
  const { categories } = useSite()
  const [searchParams] = useSearchParams()

  const [tab, setTab] = useState<'all' | 'sale' | number>('all')

  const [searchInput, setSearchInput] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')

  const [maxPrice, setMaxPrice] = useState(String(MAX_PRICE))
  const [categoryIds, setCategoryIds] = useState<number[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [saleOnly, setSaleOnly] = useState(false)
  const [newOnly, setNewOnly] = useState(false)
  const [sort, setSort] = useState('default')
  const [page, setPage] = useState(1)

  const [appliedMaxPrice, setAppliedMaxPrice] = useState('')
  const [appliedCategoryIds, setAppliedCategoryIds] = useState<number[]>([])
  const [appliedSizes, setAppliedSizes] = useState<string[]>([])
  const [appliedColors, setAppliedColors] = useState<string[]>([])
  const [appliedInStock, setAppliedInStock] = useState(false)
  const [appliedSale, setAppliedSale] = useState(false)
  const [appliedNew, setAppliedNew] = useState(false)

  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  // Đọc ?cat=slug hoặc ?sale=1/?q= từ URL khi vào trang lần đầu (link từ Header/Footer/HomePage)
  useEffect(() => {
    const catSlug = searchParams.get('cat')
    const saleParam = searchParams.get('sale')
    const qParam = searchParams.get('q')
    if (qParam) { setSearchInput(qParam); setAppliedSearch(qParam) }
    if (catSlug && categories.length > 0) {
      const cat = categories.find(c => c.slug === catSlug)
      if (cat) { setTab(cat.id); setCategoryIds([cat.id]); setAppliedCategoryIds([cat.id]) }
    } else if (saleParam === '1') {
      setTab('sale'); setSaleOnly(true); setAppliedSale(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories.length])

  // Debounce ô tìm kiếm 400ms trước khi áp dụng vào query
  useEffect(() => {
    const t = setTimeout(() => {
      setAppliedSearch(searchInput.trim())
      setPage(1)
    }, 400)
    return () => clearTimeout(t)
  }, [searchInput])

  const query = useMemo(() => {
    const params = new URLSearchParams()
    if (appliedSearch) params.set('q', appliedSearch)
    if (appliedCategoryIds.length) params.set('category_ids', appliedCategoryIds.join(','))
    if (appliedMaxPrice) params.set('max_price', appliedMaxPrice)
    if (appliedSizes.length) params.set('sizes', appliedSizes.join(','))
    if (appliedColors.length) params.set('colors', appliedColors.join(','))
    if (appliedInStock) params.set('in_stock', '1')
    if (appliedSale) params.set('sale', '1')
    if (appliedNew) params.set('is_new', '1')
    params.set('sort', sort)
    params.set('page', String(page))
    params.set('per_page', String(PER_PAGE))
    return params.toString()
  }, [appliedSearch, appliedCategoryIds, appliedMaxPrice, appliedSizes, appliedColors, appliedInStock, appliedSale, appliedNew, sort, page])

  useEffect(() => {
    setLoading(true)
    api.getPaged<Product[]>(`/public/products?${query}`)
      .then(({ data, total }) => { setProducts(data); setTotal(total) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [query])

  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))

  const selectTab = (t: 'all' | 'sale' | number) => {
    setTab(t); setPage(1)
    if (t === 'all') {
      setCategoryIds([]); setAppliedCategoryIds([]); setSaleOnly(false); setAppliedSale(false)
    } else if (t === 'sale') {
      setSaleOnly(true); setAppliedSale(true); setCategoryIds([]); setAppliedCategoryIds([])
    } else {
      setCategoryIds([t]); setAppliedCategoryIds([t]); setSaleOnly(false); setAppliedSale(false)
    }
  }

  const toggleCategory = (id: number) => setCategoryIds(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
  const toggleSize = (s: string) => setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  const toggleColor = (name: string) => setSelectedColors(prev => prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name])

  const applyFilters = () => {
    setAppliedMaxPrice(maxPrice)
    setAppliedCategoryIds(categoryIds)
    setAppliedSizes(selectedSizes)
    setAppliedColors(selectedColors)
    setAppliedInStock(inStockOnly)
    setAppliedSale(saleOnly)
    setAppliedNew(newOnly)
    setPage(1)
    setTab(categoryIds.length === 1 ? categoryIds[0] : saleOnly ? 'sale' : 'all')
  }

  const clearFilters = () => {
    setSearchInput(''); setAppliedSearch('')
    setMaxPrice(String(MAX_PRICE)); setAppliedMaxPrice('')
    setCategoryIds([]); setAppliedCategoryIds([])
    setSelectedSizes([]); setAppliedSizes([])
    setSelectedColors([]); setAppliedColors([])
    setInStockOnly(false); setAppliedInStock(false)
    setSaleOnly(false); setAppliedSale(false)
    setNewOnly(false); setAppliedNew(false)
    setSort('default'); setTab('all'); setPage(1)
  }

  const pageNumbers = (): (number | '…')[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (page <= 3) return [1, 2, 3, 4, '…', totalPages]
    if (page >= totalPages - 2) return [1, '…', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [1, '…', page, '…', totalPages]
  }

  const rangeStart = total === 0 ? 0 : (page - 1) * PER_PAGE + 1
  const rangeEnd = Math.min(page * PER_PAGE, total)

  return (
    <>
      <section className="ts-page-header">
        <div className="ts-container">
          <h1>Bộ sưu tập sản phẩm</h1>
          <div className="ts-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>/</span>
            <span className="current">Sản phẩm</span>
          </div>
        </div>
      </section>

      <div className="ts-container">
        <div className="ts-cat-tabs">
          <button className={`ts-cat-tab${tab === 'all' ? ' active' : ''}`} onClick={() => selectTab('all')}>Tất cả</button>
          {categories.map(c => (
            <button key={c.id} className={`ts-cat-tab${tab === c.id ? ' active' : ''}`} onClick={() => selectTab(c.id)}>{c.name}</button>
          ))}
          <button className={`ts-cat-tab${tab === 'sale' ? ' active' : ''}`} onClick={() => selectTab('sale')}>Đang giảm giá</button>
        </div>
      </div>

      <section className="sec-pad" style={{ paddingTop: 32 }}>
        <div className="ts-container">
          <div className="ts-shop-layout">

            <aside>
              <div className="ts-filter-box">
                <h2>Tìm kiếm</h2>
                <div className="ts-search-box">
                  <i className="bi bi-search" aria-hidden="true" />
                  <input
                    type="search"
                    className="ts-search-input"
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    placeholder="Tìm theo tên sản phẩm..."
                    aria-label="Tìm kiếm sản phẩm"
                  />
                </div>
              </div>

              <div className="ts-filter-box">
                <h2>Khoảng giá</h2>
                <div className="ts-price-range">
                  <label htmlFor="ts-price-input" className="visually-hidden">Khoảng giá tối đa</label>
                  <input
                    type="range" id="ts-price-input" min={0} max={MAX_PRICE} step={100000}
                    value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                  />
                  <div className="ts-price-vals">
                    <span>0đ</span>
                    <span>{fmt(Number(maxPrice))}</span>
                  </div>
                </div>
              </div>

              <div className="ts-filter-box">
                <h2>Danh mục</h2>
                {categories.map(cat => (
                  <label className="ts-check-item" key={cat.id}>
                    <input type="checkbox" checked={categoryIds.includes(cat.id)} onChange={() => toggleCategory(cat.id)} />
                    {cat.name} <span style={{ marginLeft: 'auto', color: 'var(--text-3)' }}>({cat.product_count})</span>
                  </label>
                ))}
              </div>

              <div className="ts-filter-box">
                <h2>Kích thước</h2>
                <div className="ts-swatch-row">
                  {SIZE_OPTIONS.map(s => (
                    <div
                      key={s}
                      className={`ts-size-swatch${selectedSizes.includes(s) ? ' active' : ''}`}
                      tabIndex={0}
                      role="button"
                      aria-pressed={selectedSizes.includes(s)}
                      onClick={() => toggleSize(s)}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSize(s) } }}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              <div className="ts-filter-box">
                <h2>Màu sắc</h2>
                <div className="ts-swatch-row">
                  {COLOR_SWATCHES.map(c => (
                    <div
                      key={c.name}
                      className={`ts-color-swatch${selectedColors.includes(c.name) ? ' active' : ''}`}
                      style={{ background: c.hex }}
                      tabIndex={0}
                      role="button"
                      aria-pressed={selectedColors.includes(c.name)}
                      aria-label={`Màu ${c.name}`}
                      onClick={() => toggleColor(c.name)}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleColor(c.name) } }}
                    />
                  ))}
                </div>
              </div>

              <div className="ts-filter-box" style={{ borderBottom: 'none' }}>
                <h2>Tình trạng</h2>
                <label className="ts-check-item"><input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} /> Còn hàng</label>
                <label className="ts-check-item"><input type="checkbox" checked={newOnly} onChange={e => setNewOnly(e.target.checked)} /> Hàng mới về</label>
                <label className="ts-check-item"><input type="checkbox" checked={saleOnly} onChange={e => setSaleOnly(e.target.checked)} /> Đang giảm giá</label>
              </div>

              <button type="button" className="ts-btn solid block" style={{ marginTop: 8 }} onClick={applyFilters}>Áp dụng bộ lọc</button>
              <button type="button" className="ts-btn block" style={{ marginTop: 10 }} onClick={clearFilters}>Xóa bộ lọc</button>
            </aside>

            <div>
              <div className="ts-shop-toolbar">
                <span>Hiển thị {rangeStart}–{rangeEnd} trong tổng số {total} sản phẩm</span>
                <div>
                  <label htmlFor="ts-sort-select" className="visually-hidden">Sắp xếp sản phẩm</label>
                  <select id="ts-sort-select" value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}>
                    <option value="default">Bán chạy nhất</option>
                    <option value="new">Mới nhất</option>
                    <option value="price-asc">Giá: Thấp đến cao</option>
                    <option value="price-desc">Giá: Cao đến thấp</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)' }}>Đang tải sản phẩm...</div>
              ) : products.length === 0 ? (
                <div className="ts-search-empty" style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)' }}>
                  {appliedSearch ? `Không tìm thấy sản phẩm nào khớp với "${appliedSearch}"` : 'Không tìm thấy sản phẩm nào khớp bộ lọc'}
                </div>
              ) : (
                <div className="ts-products-grid">
                  {products.map(p => (
                    <Link to={`/san-pham/${p.slug}`} className="ts-card" data-reveal key={p.id}>
                      <div className="ts-card-media">
                        {p.badge && <span className={`ts-card-tag${p.price_sale ? ' sale' : ''}`}>{p.badge}</span>}
                        <button
                          type="button"
                          className="ts-card-wish"
                          aria-label="Thêm vào yêu thích"
                          onClick={e => e.preventDefault()}
                        ><i className="bi bi-heart" /></button>
                        <img src={p.image} alt={p.name} loading="lazy" />
                      </div>
                      <span className="ts-card-cat">{p.category_name}</span>
                      <h3 className="ts-card-name">{p.name}</h3>
                      <div className="ts-card-price">
                        {fmt(p.price_sale || p.price)}
                        {!!p.price_sale && <del>{fmt(p.price)}</del>}
                        {!p.in_stock && <span style={{ fontSize: 12, color: 'var(--text-3)' }}>· Hết hàng</span>}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <nav className="ts-pagination" aria-label="Điều hướng phân trang">
                  <span
                    role="button" tabIndex={0} aria-label="Trang trước" aria-disabled={page === 1}
                    style={page === 1 ? { opacity: 0.4, pointerEvents: 'none' } : undefined}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && page > 1) setPage(p => Math.max(1, p - 1)) }}
                  >
                    <i className="bi bi-chevron-left" />
                  </span>
                  {pageNumbers().map((n, i) => n === '…' ? (
                    <span key={`e${i}`} style={{ pointerEvents: 'none' }}>…</span>
                  ) : (
                    <span
                      key={n}
                      className={page === n ? 'active' : undefined}
                      role="button"
                      tabIndex={0}
                      onClick={() => setPage(n as number)}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setPage(n as number) }}
                    >{n}</span>
                  ))}
                  <span
                    role="button" tabIndex={0} aria-label="Trang sau" aria-disabled={page === totalPages}
                    style={page === totalPages ? { opacity: 0.4, pointerEvents: 'none' } : undefined}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && page < totalPages) setPage(p => Math.min(totalPages, p + 1)) }}
                  >
                    <i className="bi bi-chevron-right" />
                  </span>
                </nav>
              )}
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
