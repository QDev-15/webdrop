import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import { useCart } from '../contexts/CartContext'
import { useSite, type Product } from '../contexts/SiteContext'

const PER_PAGE = 12

// Phải khớp 100% với COLOR_SWATCHES ở admin/src/pages/products/ProductForm.tsx
const COLOR_SWATCHES = [
  { name: 'Đen', hex: '#0f1029' },
  { name: 'Trắng bạc', hex: '#e8e9f2' },
  { name: 'Indigo', hex: '#6d5ef8' },
  { name: 'Cyan', hex: '#22d3ee' },
  { name: 'Xám titan', hex: '#9295b3' },
]

// Token filter "Cấu hình RAM / Ổ cứng" — đúng theo san-pham.html gốc (mỗi token so khớp substring
// với cột config_options của sản phẩm, xem ShopPublicController::products()).
const CONFIG_FILTER_OPTIONS = ['8GB', '16GB', '32GB', '512GB', '1TB']

const MAX_PRICE = 40000000

export default function ProductsPage() {
  const { categories } = useSite()
  const { addItem } = useCart()
  const [searchParams] = useSearchParams()

  const [tab, setTab] = useState<'all' | 'sale' | number>('all')

  const [searchInput, setSearchInput] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')

  const [minPrice, setMinPrice] = useState('0')
  const [maxPrice, setMaxPrice] = useState(String(MAX_PRICE))
  const [categoryIds, setCategoryIds] = useState<number[]>([])
  const [selectedConfigs, setSelectedConfigs] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [saleOnly, setSaleOnly] = useState(false)
  const [newOnly, setNewOnly] = useState(false)
  const [sort, setSort] = useState('default')
  const [page, setPage] = useState(1)

  const [appliedMinPrice, setAppliedMinPrice] = useState('')
  const [appliedMaxPrice, setAppliedMaxPrice] = useState('')
  const [appliedCategoryIds, setAppliedCategoryIds] = useState<number[]>([])
  const [appliedConfigs, setAppliedConfigs] = useState<string[]>([])
  const [appliedColors, setAppliedColors] = useState<string[]>([])
  const [appliedInStock, setAppliedInStock] = useState(false)
  const [appliedSale, setAppliedSale] = useState(false)
  const [appliedNew, setAppliedNew] = useState(false)

  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  // Đọc ?cat=slug hoặc ?new=1/?q= từ URL khi vào trang lần đầu (link từ Header/Footer/HomePage)
  useEffect(() => {
    const catSlug = searchParams.get('cat')
    const newParam = searchParams.get('new')
    const qParam = searchParams.get('q')
    if (qParam) { setSearchInput(qParam); setAppliedSearch(qParam) }
    if (catSlug && categories.length > 0) {
      const cat = categories.find(c => c.slug === catSlug)
      if (cat) { setTab(cat.id); setCategoryIds([cat.id]); setAppliedCategoryIds([cat.id]) }
    } else if (newParam === '1') {
      setNewOnly(true); setAppliedNew(true)
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
    if (appliedMinPrice) params.set('min_price', appliedMinPrice)
    if (appliedMaxPrice) params.set('max_price', appliedMaxPrice)
    if (appliedConfigs.length) params.set('config', appliedConfigs.join(','))
    if (appliedColors.length) params.set('colors', appliedColors.join(','))
    if (appliedInStock) params.set('in_stock', '1')
    if (appliedSale) params.set('sale', '1')
    if (appliedNew) params.set('is_new', '1')
    params.set('sort', sort)
    params.set('page', String(page))
    params.set('per_page', String(PER_PAGE))
    return params.toString()
  }, [appliedSearch, appliedCategoryIds, appliedMinPrice, appliedMaxPrice, appliedConfigs, appliedColors, appliedInStock, appliedSale, appliedNew, sort, page])

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
  const toggleConfig = (t: string) => setSelectedConfigs(prev => prev.includes(t) ? prev.filter(c => c !== t) : [...prev, t])
  const toggleColor = (name: string) => setSelectedColors(prev => prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name])

  const applyFilters = () => {
    setAppliedMinPrice(minPrice)
    setAppliedMaxPrice(maxPrice)
    setAppliedCategoryIds(categoryIds)
    setAppliedConfigs(selectedConfigs)
    setAppliedColors(selectedColors)
    setAppliedInStock(inStockOnly)
    setAppliedSale(saleOnly)
    setAppliedNew(newOnly)
    setPage(1)
    setTab(categoryIds.length === 1 ? categoryIds[0] : saleOnly ? 'sale' : 'all')
  }

  const clearFilters = () => {
    setSearchInput(''); setAppliedSearch('')
    setMinPrice('0'); setAppliedMinPrice('')
    setMaxPrice(String(MAX_PRICE)); setAppliedMaxPrice('')
    setCategoryIds([]); setAppliedCategoryIds([])
    setSelectedConfigs([]); setAppliedConfigs([])
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
      <div className="mt-page-header">
        <div className="mt-container">
          <nav className="mt-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Trang chủ</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span><span>Sản phẩm</span>
          </nav>
          <h1 className="mt-page-title">Tất cả sản phẩm</h1>
          <p className="mt-page-count">Hiển thị <strong>{rangeStart}–{rangeEnd}</strong> trong số <strong>{total}</strong> sản phẩm</p>
        </div>
      </div>

      <div className="mt-tab-bar">
        <div className="mt-container mt-tab-bar-inner">
          <button className={'mt-tab-btn' + (tab === 'all' ? ' active' : '')} onClick={() => selectTab('all')}>Tất cả</button>
          {categories.map(c => (
            <button key={c.id} className={'mt-tab-btn' + (tab === c.id ? ' active' : '')} onClick={() => selectTab(c.id)}>{c.name}</button>
          ))}
          <button className={'mt-tab-btn' + (tab === 'sale' ? ' active' : '')} onClick={() => selectTab('sale')}>Đang giảm giá</button>
        </div>
      </div>

      <main>
        <div className="mt-container">
          <div className="mt-shop-layout">
            <aside className="mt-filter-sidebar">
              <div className="mt-filter-block">
                <div className="mt-filter-title">Tìm kiếm</div>
                <div className="mt-search-box">
                  <i className="bi bi-search" aria-hidden="true" />
                  <input
                    type="search"
                    className="mt-search-input"
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    placeholder="Tìm theo tên sản phẩm..."
                    aria-label="Tìm kiếm sản phẩm"
                  />
                </div>
              </div>

              <div className="mt-filter-block">
                <div className="mt-filter-title">Mức giá</div>
                <div className="mt-filter-price-range">
                  <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} min={0} aria-label="Giá thấp nhất" />
                  <span>—</span>
                  <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} min={0} aria-label="Giá cao nhất" />
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>đ</span>
                </div>
              </div>

              <div className="mt-filter-block">
                <div className="mt-filter-title">Danh mục</div>
                <div className="mt-filter-options">
                  {categories.map(c => (
                    <label className="mt-filter-opt" key={c.id}>
                      <input type="checkbox" checked={categoryIds.includes(c.id)} onChange={() => toggleCategory(c.id)} /> {c.name} ({c.product_count})
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-filter-block">
                <div className="mt-filter-title">Cấu hình RAM / Ổ cứng</div>
                <div className="mt-config-swatches">
                  {CONFIG_FILTER_OPTIONS.map(t => (
                    <div
                      key={t}
                      className={'mt-config-swatch' + (selectedConfigs.includes(t) ? ' selected' : '')}
                      tabIndex={0}
                      role="button"
                      aria-pressed={selectedConfigs.includes(t)}
                      onClick={() => toggleConfig(t)}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleConfig(t) } }}
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-filter-block">
                <div className="mt-filter-title">Màu sắc / Vỏ case</div>
                <div className="mt-color-swatches">
                  {COLOR_SWATCHES.map(c => (
                    <div
                      key={c.name}
                      className={'mt-color-swatch' + (selectedColors.includes(c.name) ? ' selected' : '')}
                      style={{ background: c.hex }}
                      title={c.name}
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

              <div className="mt-filter-block">
                <div className="mt-filter-title">Tình trạng</div>
                <div className="mt-filter-options">
                  <label className="mt-filter-opt"><input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} /> Còn hàng</label>
                  <label className="mt-filter-opt"><input type="checkbox" checked={saleOnly} onChange={e => setSaleOnly(e.target.checked)} /> Đang giảm giá</label>
                  <label className="mt-filter-opt"><input type="checkbox" checked={newOnly} onChange={e => setNewOnly(e.target.checked)} /> Hàng mới về</label>
                </div>
              </div>

              <button type="button" className="mt-btn mt-btn-outline w-100" style={{ marginTop: 8, justifyContent: 'center' }} onClick={applyFilters}>Áp dụng bộ lọc</button>
              <button type="button" className="mt-btn mt-btn-ghost w-100" style={{ marginTop: 8, justifyContent: 'center' }} onClick={clearFilters}>Xóa bộ lọc</button>
            </aside>

            <div>
              <div className="mt-shop-top">
                <div style={{ fontSize: 14, color: 'var(--text-2)' }}>Tìm thấy <strong style={{ color: 'var(--text)' }}>{total}</strong> sản phẩm</div>
                <div className="d-flex align-items-center gap-2">
                  <label htmlFor="sort-select" style={{ fontSize: 14, color: 'var(--text-2)' }}>Sắp xếp:</label>
                  <select id="sort-select" className="mt-sort-select" value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}>
                    <option value="default">Nổi bật nhất</option>
                    <option value="new">Mới nhất</option>
                    <option value="price-asc">Giá: Thấp đến cao</option>
                    <option value="price-desc">Giá: Cao đến thấp</option>
                    <option value="rating">Đánh giá cao nhất</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)' }}>Đang tải sản phẩm...</div>
              ) : products.length === 0 ? (
                <div className="mt-search-empty" style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)' }}>
                  {appliedSearch ? `Không tìm thấy sản phẩm nào khớp với "${appliedSearch}"` : 'Không tìm thấy sản phẩm nào khớp bộ lọc'}
                </div>
              ) : (
                <div className="mt-prod-grid">
                  {products.map(p => (
                    <div className="mt-prod-card" data-reveal key={p.id}>
                      <div className="mt-prod-thumb">
                        <Link to={`/san-pham/${p.slug}`}><img src={p.image} alt={p.name} loading="lazy" /></Link>
                        {p.badge && <div className={'mt-prod-badge' + (p.price_sale ? ' sale' : p.is_new ? ' new' : '')}>{p.badge}</div>}
                        <div className="mt-prod-actions">
                          <button className="mt-prod-action-btn" aria-label="Yêu thích"><i className="bi bi-heart" /></button>
                          <Link to={`/san-pham/${p.slug}`} className="mt-prod-action-btn" aria-label="Xem chi tiết"><i className="bi bi-eye" /></Link>
                        </div>
                      </div>
                      <div className="mt-prod-info">
                        <div className="mt-prod-cat">{p.category_name}{!p.in_stock ? ' · Hết hàng' : ''}</div>
                        <h3 className="mt-prod-name"><Link to={`/san-pham/${p.slug}`}>{p.name}</Link></h3>
                        <div className="mt-prod-footer">
                          <div>
                            <span className="mt-prod-price-new">{fmt(p.price_sale || p.price)}</span>
                            {!!p.price_sale && <span className="mt-prod-price-old">{fmt(p.price)}</span>}
                          </div>
                          <button
                            className="mt-add-cart"
                            aria-label="Thêm vào giỏ"
                            disabled={!p.in_stock}
                            onClick={() => addItem({ product_id: p.id, name: p.name, slug: p.slug, image: p.image, price: p.price_sale || p.price })}
                          >
                            <i className="bi bi-bag-plus" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <nav className="mt-pagination" aria-label="Phân trang">
                  <span
                    role="button" tabIndex={0} className="mt-page-btn" aria-label="Trang trước"
                    style={page === 1 ? { opacity: 0.4, pointerEvents: 'none' } : undefined}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                  ><i className="bi bi-chevron-left" /></span>
                  {pageNumbers().map((n, i) => n === '…' ? (
                    <span key={`e${i}`} className="mt-page-btn" style={{ pointerEvents: 'none', border: 'none', color: 'var(--text-3)' }}>…</span>
                  ) : (
                    <span
                      key={n}
                      role="button" tabIndex={0}
                      className={'mt-page-btn' + (page === n ? ' active' : '')}
                      aria-current={page === n ? 'page' : undefined}
                      onClick={() => setPage(n as number)}
                    >{n}</span>
                  ))}
                  <span
                    role="button" tabIndex={0} className="mt-page-btn" aria-label="Trang tiếp"
                    style={page === totalPages ? { opacity: 0.4, pointerEvents: 'none' } : undefined}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  ><i className="bi bi-chevron-right" /></span>
                </nav>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
