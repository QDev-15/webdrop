import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import { useSite, type Product } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'

const PER_PAGE = 12

const COLOR_SWATCHES = [
  { name: 'Trắng',      hex: '#ffffff' },
  { name: 'Đen',        hex: '#0a0a0a' },
  { name: 'Xanh dương', hex: '#0052ff' },
  { name: 'Đỏ hồng',    hex: '#e11d48' },
  { name: 'Vàng bơ',    hex: '#d4a027' },
  { name: 'Xanh lá',    hex: '#16a34a' },
  { name: 'Tím',        hex: '#7c3aed' },
  { name: 'Cam',        hex: '#ea580c' },
]

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const PRICE_RANGES: { label: string; min: number; max: number | null }[] = [
  { label: 'Dưới 200.000đ', min: 0, max: 200000 },
  { label: '200.000đ – 500.000đ', min: 200000, max: 500000 },
  { label: '500.000đ – 1.000.000đ', min: 500000, max: 1000000 },
  { label: 'Trên 1.000.000đ', min: 1000000, max: null },
]

export default function ProductsPage() {
  const { categories } = useSite()
  const { addItem } = useCart()
  const [searchParams] = useSearchParams()

  const [tab, setTab] = useState<'all' | 'sale' | number>('all')
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '')
  const [appliedSearch, setAppliedSearch] = useState(searchParams.get('q') || '')
  const [categoryIds, setCategoryIds] = useState<number[]>([])
  const [priceRangeIdx, setPriceRangeIdx] = useState<number | null>(null)
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [newOnly, setNewOnly] = useState(false)
  const [saleOnly, setSaleOnly] = useState(false)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sort, setSort] = useState('default')
  const [page, setPage] = useState(1)

  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const [appliedCategoryIds, setAppliedCategoryIds] = useState<number[]>([])
  const [appliedPriceRangeIdx, setAppliedPriceRangeIdx] = useState<number | null>(null)
  const [appliedSizes, setAppliedSizes] = useState<string[]>([])
  const [appliedColors, setAppliedColors] = useState<string[]>([])
  const [appliedNew, setAppliedNew] = useState(false)
  const [appliedSale, setAppliedSale] = useState(false)
  const [appliedInStock, setAppliedInStock] = useState(false)

  // Đọc ?cat=slug hoặc ?sale=1 từ URL khi vào trang lần đầu (link từ Header/Footer)
  useEffect(() => {
    const catSlug = searchParams.get('cat')
    const saleParam = searchParams.get('sale')
    if (catSlug && categories.length > 0) {
      const cat = categories.find(c => c.slug === catSlug)
      if (cat) { setTab(cat.id); setCategoryIds([cat.id]); setAppliedCategoryIds([cat.id]) }
    } else if (saleParam === '1') {
      setTab('sale'); setSaleOnly(true); setAppliedSale(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories.length])

  // Search gõ-là-tự-tìm (debounce 400ms)
  useEffect(() => {
    const t = setTimeout(() => { setAppliedSearch(searchInput.trim()); setPage(1) }, 400)
    return () => clearTimeout(t)
  }, [searchInput])

  const query = useMemo(() => {
    const params = new URLSearchParams()
    if (appliedSearch) params.set('q', appliedSearch)
    if (appliedCategoryIds.length) params.set('category_ids', appliedCategoryIds.join(','))
    if (appliedPriceRangeIdx !== null) {
      const r = PRICE_RANGES[appliedPriceRangeIdx]
      params.set('min_price', String(r.min))
      if (r.max !== null) params.set('max_price', String(r.max))
    }
    if (appliedSizes.length) params.set('sizes', appliedSizes.join(','))
    if (appliedColors.length) params.set('colors', appliedColors.join(','))
    if (appliedNew) params.set('is_new', '1')
    if (appliedSale) params.set('sale', '1')
    if (appliedInStock) params.set('in_stock', '1')
    params.set('sort', sort)
    params.set('page', String(page))
    params.set('per_page', String(PER_PAGE))
    return params.toString()
  }, [appliedSearch, appliedCategoryIds, appliedPriceRangeIdx, appliedSizes, appliedColors, appliedNew, appliedSale, appliedInStock, sort, page])

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
    setAppliedCategoryIds(categoryIds)
    setAppliedPriceRangeIdx(priceRangeIdx)
    setAppliedSizes(selectedSizes)
    setAppliedColors(selectedColors)
    setAppliedNew(newOnly)
    setAppliedSale(saleOnly)
    setAppliedInStock(inStockOnly)
    setPage(1)
    setTab(categoryIds.length === 1 ? categoryIds[0] : saleOnly ? 'sale' : 'all')
  }

  const clearFilters = () => {
    setSearchInput(''); setAppliedSearch('')
    setCategoryIds([]); setAppliedCategoryIds([])
    setPriceRangeIdx(null); setAppliedPriceRangeIdx(null)
    setSelectedSizes([]); setAppliedSizes([])
    setSelectedColors([]); setAppliedColors([])
    setNewOnly(false); setAppliedNew(false)
    setSaleOnly(false); setAppliedSale(false)
    setInStockOnly(false); setAppliedInStock(false)
    setSort('default'); setTab('all'); setPage(1)
  }

  const pageNumbers = (): (number | '…')[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (page <= 3) return [1, 2, 3, 4, '…', totalPages]
    if (page >= totalPages - 2) return [1, '…', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [1, '…', page, '…', totalPages]
  }

  return (
    <>
      <section className="st-page-hero" aria-label="Tiêu đề trang">
        <div className="st-container">
          <nav className="st-breadcrumb mb-3" aria-label="Điều hướng">
            <Link to="/">Trang chủ</Link>
            <span className="st-breadcrumb-sep">/</span>
            <span>Bộ sưu tập</span>
          </nav>
          <h1 className="st-page-title">Bộ Sưu Tập</h1>
        </div>
      </section>

      <section className="st-sec" aria-label="Danh sách sản phẩm">
        <div className="st-container">
          <div className="d-flex gap-2 flex-wrap mb-4" role="group" aria-label="Lọc theo danh mục">
            <button className={`st-btn st-btn-sm ${tab === 'all' ? 'st-btn-dark' : 'st-btn-outline'}`} onClick={() => selectTab('all')}>Tất cả</button>
            {categories.map(c => (
              <button key={c.id} className={`st-btn st-btn-sm ${tab === c.id ? 'st-btn-dark' : 'st-btn-outline'}`} onClick={() => selectTab(c.id)}>{c.name}</button>
            ))}
            <button
              className="st-btn st-btn-sm"
              style={tab === 'sale'
                ? { background: 'var(--sale)', borderColor: 'var(--sale)', color: '#fff' }
                : { borderColor: 'var(--sale)', color: 'var(--sale)' }}
              onClick={() => selectTab('sale')}
            >
              Sale
            </button>
          </div>

          <div className="st-shop-layout">
            <aside className="st-filter-sidebar" aria-label="Bộ lọc">
              <div className="st-filter-hd">
                Bộ lọc
                <button type="button" className="st-filter-clear" onClick={clearFilters}>Xóa tất cả</button>
              </div>

              <div className="st-filter-group">
                <div className="st-filter-group-title">Tìm kiếm</div>
                <input
                  type="search"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Tìm sản phẩm..."
                  aria-label="Tìm kiếm sản phẩm"
                  style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', fontFamily: 'var(--sans)', fontSize: 13, outline: 'none' }}
                />
              </div>

              <div className="st-filter-group">
                <div className="st-filter-group-title">Danh mục</div>
                <div className="d-flex flex-column gap-1">
                  {categories.map(cat => (
                    <label key={cat.id} className="st-filter-opt">
                      <input type="checkbox" checked={categoryIds.includes(cat.id)} onChange={() => toggleCategory(cat.id)} />
                      {cat.name} ({cat.product_count})
                    </label>
                  ))}
                </div>
              </div>

              <div className="st-filter-group">
                <div className="st-filter-group-title">Khoảng giá</div>
                <div className="d-flex flex-column gap-1">
                  {PRICE_RANGES.map((r, i) => (
                    <label key={r.label} className="st-filter-opt">
                      <input type="radio" name="price" checked={priceRangeIdx === i} onChange={() => setPriceRangeIdx(priceRangeIdx === i ? null : i)} />
                      {r.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="st-filter-group">
                <div className="st-filter-group-title">Size</div>
                <div className="d-flex gap-2 flex-wrap">
                  {SIZE_OPTIONS.map(s => (
                    <button key={s} type="button" className={`st-size-btn ${selectedSizes.includes(s) ? 'active' : ''}`} onClick={() => toggleSize(s)}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="st-filter-group">
                <div className="st-filter-group-title">Màu sắc</div>
                <div className="st-filter-colors">
                  {COLOR_SWATCHES.map(c => (
                    <span
                      key={c.name}
                      className={`st-filter-swatch ${selectedColors.includes(c.name) ? 'active' : ''}`}
                      style={{ background: c.hex, outline: c.hex === '#ffffff' && !selectedColors.includes(c.name) ? '1px solid #ccc' : undefined }}
                      title={c.name}
                      role="button"
                      tabIndex={0}
                      aria-label={`Lọc màu ${c.name}`}
                      onClick={() => toggleColor(c.name)}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') toggleColor(c.name) }}
                    />
                  ))}
                </div>
              </div>

              <div className="st-filter-group">
                <div className="st-filter-group-title">Trạng thái</div>
                <div className="d-flex flex-column gap-1">
                  <label className="st-filter-opt"><input type="checkbox" checked={newOnly} onChange={e => setNewOnly(e.target.checked)} /> Hàng mới về</label>
                  <label className="st-filter-opt"><input type="checkbox" checked={saleOnly} onChange={e => setSaleOnly(e.target.checked)} /> Đang giảm giá</label>
                  <label className="st-filter-opt"><input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} /> Còn hàng</label>
                </div>
              </div>

              <button className="st-btn st-btn-primary w-100 justify-content-center mt-2" type="button" onClick={applyFilters}>
                <i className="bi bi-funnel" /> Áp dụng bộ lọc
              </button>
            </aside>

            <div className="st-shop-main">
              <div className="st-shop-bar">
                <span className="st-result-count">Tìm thấy <strong>{total}</strong> sản phẩm</span>
                <div className="st-bar-right">
                  <select className="st-sort-sel" aria-label="Sắp xếp" value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}>
                    <option value="default">Phổ biến nhất</option>
                    <option value="new">Mới nhất</option>
                    <option value="price-asc">Giá: Thấp đến Cao</option>
                    <option value="price-desc">Giá: Cao đến Thấp</option>
                    <option value="rating">Đánh giá tốt nhất</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-3)' }}>Đang tải sản phẩm...</div>
              ) : products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-3)' }}>
                  {appliedSearch ? `Không tìm thấy sản phẩm nào khớp với "${appliedSearch}"` : 'Không có sản phẩm nào khớp bộ lọc'}
                </div>
              ) : (
                <div className="st-prods-grid">
                  {products.map(p => (
                    <div className="st-prod-card" data-reveal key={p.id}>
                      <div className="st-prod-thumb">
                        <Link to={`/san-pham/${p.slug}`}>
                          <img src={p.image} alt={p.name} loading="lazy" />
                        </Link>
                        {p.badge && <span className={`st-prod-badge ${p.is_new ? 'st-prod-badge-new' : p.price_sale ? 'st-prod-badge-sale' : 'st-prod-badge-hot'}`}>{p.badge}</span>}
                        <div className="st-prod-actions">
                          <button
                            aria-label="Thêm vào giỏ hàng"
                            disabled={!p.in_stock}
                            onClick={() => addItem({ product_id: p.id, name: p.name, slug: p.slug, image: p.image, price: p.price_sale || p.price })}
                          >
                            Thêm giỏ
                          </button>
                          <Link to={`/san-pham/${p.slug}`} aria-label="Xem chi tiết">Chi tiết</Link>
                        </div>
                      </div>
                      <div className="st-prod-info">
                        <div className="st-prod-brand">{p.brand}</div>
                        <div className="st-prod-name"><Link to={`/san-pham/${p.slug}`}>{p.name}</Link></div>
                        <div className="st-prod-price">
                          <span className="st-price-current">{fmt(p.price_sale || p.price)}</span>
                          {!!p.price_sale && p.price_sale < p.price && <span className="st-price-original">{fmt(p.price)}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <nav className="st-pagination" aria-label="Phân trang">
                  <button className="st-page-btn st-wide" aria-label="Trang trước" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
                    <i className="bi bi-chevron-left" />
                  </button>
                  {pageNumbers().map((n, i) => n === '…' ? (
                    <span key={`e${i}`} className="st-page-btn" style={{ cursor: 'default', border: 'none', color: 'var(--text-3)' }}>…</span>
                  ) : (
                    <button key={n} className={`st-page-btn ${page === n ? 'st-active' : ''}`} aria-current={page === n ? 'page' : undefined} onClick={() => setPage(n as number)}>{n}</button>
                  ))}
                  <button className="st-page-btn st-wide" aria-label="Trang tiếp theo" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
                    <i className="bi bi-chevron-right" />
                  </button>
                </nav>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
