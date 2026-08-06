import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import { useSite, type Product } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { fmt } from '../lib/format'
import ProductCard from '../components/ProductCard'
import HeroSlider from '../components/HeroSlider'

// Trang chủ OFFICEHUB = catalog đầy đủ (Biến thể 1 SEARCH-FIRST UNIFIED) — bám đúng cấu trúc thật
// của index.html: Page Header Search Zone (HeroSlider.tsx) + filter toolbar NGANG (category pill +
// brand dropdown checkbox + price range slider + sort select, áp dụng tức thì không nút Apply) +
// active chips row + product grid + pagination cổ điển. KHÔNG có sidebar filter dọc 5-block.
const MAX_PRICE = 2500000
const PER_PAGE = 12

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price-asc', label: 'Giá tăng dần' },
  { value: 'price-desc', label: 'Giá giảm dần' },
  { value: 'bestseller', label: 'Bán chạy' },
  { value: 'rating', label: 'Đánh giá cao' },
]

export default function ProductsPage() {
  const { settings, categories } = useSite()
  const [searchParams, setSearchParams] = useSearchParams()

  const [initialized, setInitialized] = useState(false)
  const [category, setCategory] = useState('')
  const [brands, setBrands] = useState<string[]>([])
  const [priceMax, setPriceMax] = useState(MAX_PRICE)
  const [priceInput, setPriceInput] = useState(MAX_PRICE)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)

  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [allBrands, setAllBrands] = useState<string[]>([])
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  useDocumentMeta({
    title: settings.meta_title || `${settings.site_name || 'OFFICEHUB'} — Văn phòng phẩm chính hãng`,
    description: settings.meta_description || 'Văn phòng phẩm chính hãng: bút viết, sổ tay, file tài liệu, dụng cụ văn phòng, balo laptop. Giao hàng nhanh, giá tốt nhất TP.HCM và toàn quốc.',
  })

  // Lấy toàn bộ brand có trong catalog (1 lần, không phụ thuộc filter) để dựng dropdown "Thương hiệu"
  useEffect(() => {
    api.get<Product[]>('/public/products?per_page=200')
      .then(list => setAllBrands([...new Set(list.map(p => p.brand))].filter(Boolean).sort()))
      .catch(() => {})
  }, [])

  // Đọc state ban đầu từ URL (chỉ 1 lần khi mount)
  useEffect(() => {
    const p = searchParams
    setCategory(p.get('category') || '')
    setBrands(p.get('brand') ? p.get('brand')!.split(',').filter(Boolean) : [])
    const pm = p.get('maxprice') ? Number(p.get('maxprice')) : MAX_PRICE
    setPriceMax(pm); setPriceInput(pm)
    const q = p.get('q') || ''
    setSearchInput(q); setSearch(q)
    setSort(p.get('sort') || 'newest')
    setPage(p.get('page') ? Math.max(1, Number(p.get('page'))) : 1)
    setInitialized(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Đồng bộ khi query `?q=` đổi từ BÊN NGOÀI component (vd tìm kiếm từ ô nav Header khi khách
  // đang đứng sẵn ở trang chủ "/" — route không đổi nên effect đọc URL lúc mount (deps=[]) không
  // chạy lại). So sánh giá trị (không phải reference) để tránh lặp vô hạn với effect fetch bên dưới
  // (effect đó cũng gọi setSearchParams mỗi khi state đổi).
  useEffect(() => {
    if (!initialized) return
    const q = searchParams.get('q') || ''
    if (q !== search) { setSearchInput(q); setSearch(q); setPage(1) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  // Debounce ô tìm kiếm (300ms — khớp template)
  useEffect(() => {
    if (!initialized) return
    const t = setTimeout(() => { setSearch(searchInput); setPage(1) }, 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  // Debounce khoảng giá (250ms — khớp template)
  useEffect(() => {
    if (!initialized) return
    const t = setTimeout(() => { setPriceMax(priceInput); setPage(1) }, 250)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceInput])

  // Fetch + đồng bộ URL mỗi khi filter/trang đổi
  useEffect(() => {
    if (!initialized) return
    setLoading(true)

    const apiParams = new URLSearchParams()
    apiParams.set('per_page', String(PER_PAGE))
    apiParams.set('page', String(page))
    if (category) {
      const catId = categories.find(c => c.slug === category)?.id
      if (catId) apiParams.set('category_ids', String(catId))
    }
    if (brands.length) apiParams.set('brands', brands.join(','))
    if (priceMax < MAX_PRICE) apiParams.set('max_price', String(priceMax))
    if (search) apiParams.set('q', search)
    if (sort !== 'newest') apiParams.set('sort', sort)

    api.getPaged<Product[]>(`/public/products?${apiParams.toString()}`)
      .then(({ data, total }) => { setProducts(data); setTotal(total) })
      .catch(() => { setProducts([]); setTotal(0) })
      .finally(() => setLoading(false))

    const urlParams = new URLSearchParams()
    if (category) urlParams.set('category', category)
    if (brands.length) urlParams.set('brand', brands.join(','))
    if (priceMax < MAX_PRICE) urlParams.set('maxprice', String(priceMax))
    if (search) urlParams.set('q', search)
    if (sort !== 'newest') urlParams.set('sort', sort)
    if (page > 1) urlParams.set('page', String(page))
    setSearchParams(urlParams, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, category, brands.join(','), priceMax, search, sort, page, categories])

  const changeCategory = (slug: string) => { setCategory(c => c === slug ? '' : slug); setPage(1) }
  const toggleBrand = (b: string) => { setBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]); setPage(1) }
  const changeSort = (v: string) => { setSort(v); setPage(1) }

  const clearAllFilters = () => {
    setCategory(''); setBrands([]); setPriceMax(MAX_PRICE); setPriceInput(MAX_PRICE)
    setSearchInput(''); setSearch(''); setSort('newest'); setPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
  const startIdx = (page - 1) * PER_PAGE

  const chips: { key: string; label: string; onRemove: () => void }[] = []
  if (category) {
    const cat = categories.find(c => c.slug === category)
    chips.push({ key: 'category', label: cat ? cat.name : category, onRemove: () => changeCategory('') })
  }
  brands.forEach(b => chips.push({ key: `brand-${b}`, label: b, onRemove: () => toggleBrand(b) }))
  if (priceMax < MAX_PRICE) chips.push({ key: 'price', label: 'Giá ≤ ' + fmt(priceMax), onRemove: () => { setPriceMax(MAX_PRICE); setPriceInput(MAX_PRICE); setPage(1) } })
  if (search) chips.push({ key: 'search', label: `"${search}"`, onRemove: () => { setSearchInput(''); setSearch(''); setPage(1) } })

  const filterBadgeCount = brands.length + (priceMax < MAX_PRICE ? 1 : 0)

  const goToPage = (n: number) => {
    if (n < 1 || n > totalPages) return
    setPage(n)
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <>
      <HeroSlider searchValue={searchInput} onSearchChange={setSearchInput} onSearchSubmit={() => { setSearch(searchInput); setPage(1) }} />

      {/* Filter Toolbar */}
      <div className="vp-toolbar-wrap">
        <div className="vp-container">
          {/* Desktop filter row */}
          <div className="vp-toolbar d-none d-lg-flex">
            <div className="vp-cat-pills" role="group" aria-label="Lọc theo danh mục">
              <button className={'vp-cat-pill' + (category === '' ? ' active' : '')} onClick={() => changeCategory('')}>Tất cả</button>
              {categories.map(c => (
                <button key={c.slug} className={'vp-cat-pill' + (category === c.slug ? ' active' : '')} onClick={() => changeCategory(c.slug)}>{c.name}</button>
              ))}
            </div>

            <div className="vp-toolbar-divider"></div>

            <div className="vp-dropdown">
              <button className={'vp-dropdown-btn' + (brandDropdownOpen ? ' open' : '')} aria-expanded={brandDropdownOpen} onClick={() => setBrandDropdownOpen(o => !o)}>
                Thương hiệu
                {brands.length > 0 && <span className="vp-dd-badge">{brands.length}</span>}
                <svg className="vp-dd-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M6 9l6 6 6-6" /></svg>
              </button>
              <div className={'vp-dropdown-menu' + (brandDropdownOpen ? ' show' : '')} role="listbox" aria-label="Chọn thương hiệu">
                {allBrands.map(b => (
                  <label className="vp-dd-option" key={b}>
                    <input type="checkbox" checked={brands.includes(b)} onChange={() => toggleBrand(b)} /> <span>{b}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="vp-price-range" aria-label="Khoảng giá">
              <span className="vp-price-label">Giá:</span>
              <input type="range" min={0} max={MAX_PRICE} step={50000} value={priceInput} onChange={e => setPriceInput(Number(e.target.value))} aria-label="Giá tối đa" />
              <span className="vp-price-label">{priceInput >= MAX_PRICE ? 'Tất cả' : fmt(priceInput)}</span>
            </div>

            <div className="vp-sort" aria-label="Sắp xếp">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 6h18M7 12h10M11 18h2" /></svg>
              <select aria-label="Sắp xếp theo" value={sort} onChange={e => changeSort(e.target.value)}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <div className="vp-result-count" aria-live="polite">
              {total === 0 ? 'Không tìm thấy sản phẩm' : `Hiển thị ${startIdx + 1}–${startIdx + products.length} trong ${total} sản phẩm`}
            </div>
          </div>

          {/* Mobile filter row */}
          <div className="d-flex d-lg-none align-items-center justify-content-between gap-2" style={{ flexWrap: 'wrap' }}>
            <div className="vp-cat-pills" style={{ flexWrap: 'wrap' }}>
              <button className={'vp-cat-pill' + (category === '' ? ' active' : '')} onClick={() => changeCategory('')}>Tất cả</button>
              {categories.map(c => (
                <button key={c.slug} className={'vp-cat-pill' + (category === c.slug ? ' active' : '')} onClick={() => changeCategory(c.slug)}>{c.name}</button>
              ))}
            </div>
            <div className="d-flex gap-2">
              <button className="vp-filter-mobile-btn" aria-label="Mở bộ lọc" aria-expanded={mobileFilterOpen} onClick={() => setMobileFilterOpen(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></svg>
                Lọc
                {filterBadgeCount > 0 && <span className="vp-filter-badge">{filterBadgeCount}</span>}
              </button>
              <select className="vp-sort" style={{ padding: '0 10px', minWidth: 120 }} aria-label="Sắp xếp" value={sort} onChange={e => changeSort(e.target.value)}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Active chips row */}
          {chips.length > 0 && (
            <div className="vp-chips-row" aria-live="polite">
              {chips.map(c => (
                <span className="vp-chip" key={c.key}>
                  {c.label}
                  <span className="vp-chip-remove" role="button" aria-label={`Xóa bộ lọc ${c.label}`} onClick={c.onRemove}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </span>
                </span>
              ))}
              <span className="vp-chips-clear" role="button" tabIndex={0} onClick={clearAllFilters} onKeyDown={e => { if (e.key === 'Enter') clearAllFilters() }}>Xóa tất cả</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Catalog */}
      <main className="vp-catalog-wrap">
        <div className="vp-container" ref={gridRef}>
          {!loading && products.length === 0 ? (
            <div className="vp-empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /><path d="M11 8v6M8 11h6" /></svg>
              <h3>Không tìm thấy sản phẩm nào</h3>
              <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              <button className="vp-btn vp-btn-outline" onClick={clearAllFilters}>Xóa tất cả bộ lọc</button>
            </div>
          ) : (
            <div className="vp-prod-grid" aria-live="polite" aria-label="Danh sách sản phẩm">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {totalPages > 1 && (
            <nav aria-label="Phân trang">
              <ul className="vp-pagination">
                <li className={'vp-page-item' + (page === 1 ? ' disabled' : '')}>
                  <button className="page-link" aria-label="Trang trước" disabled={page === 1} onClick={() => goToPage(page - 1)}>&lsaquo;</button>
                </li>
                {pageNumbers.map(n => (
                  <li key={n} className={'vp-page-item' + (n === page ? ' active' : '')}>
                    <button className="page-link" aria-label={`Trang ${n}`} aria-current={n === page ? 'page' : undefined} onClick={() => goToPage(n)}>{n}</button>
                  </li>
                ))}
                <li className={'vp-page-item' + (page === totalPages ? ' disabled' : '')}>
                  <button className="page-link" aria-label="Trang sau" disabled={page === totalPages} onClick={() => goToPage(page + 1)}>&rsaquo;</button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </main>

      {/* Mobile Offcanvas Filter */}
      <div className={'vp-offcanvas' + (mobileFilterOpen ? ' show' : '')} role="dialog" aria-modal="true" aria-label="Bộ lọc sản phẩm">
        <div className="vp-offcanvas-backdrop" onClick={() => setMobileFilterOpen(false)}></div>
        <div className="vp-offcanvas-panel">
          <div className="vp-offcanvas-header">
            <span className="vp-offcanvas-title">Bộ lọc</span>
            <button className="vp-offcanvas-close" aria-label="Đóng bộ lọc" onClick={() => setMobileFilterOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="vp-filter-section">
            <div className="vp-filter-section-title">Thương hiệu</div>
            {allBrands.map(b => (
              <label className="vp-dd-option" key={b}>
                <input type="checkbox" checked={brands.includes(b)} onChange={() => toggleBrand(b)} /> <span>{b}</span>
              </label>
            ))}
          </div>

          <div className="vp-filter-section">
            <div className="vp-filter-section-title">Khoảng giá</div>
            <input type="range" min={0} max={MAX_PRICE} step={50000} value={priceInput} onChange={e => setPriceInput(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent)' }} aria-label="Giá tối đa" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-2)', marginTop: 6 }}>
              <span>0₫</span>
              <span>{priceInput >= MAX_PRICE ? 'Tất cả' : fmt(priceInput)}</span>
              <span>{fmt(MAX_PRICE)}</span>
            </div>
          </div>

          <div className="d-flex gap-2 mt-3">
            <button className="vp-btn vp-btn-ghost vp-btn-sm" style={{ flex: 1 }} onClick={clearAllFilters}>Xóa bộ lọc</button>
            <button className="vp-btn vp-btn-primary vp-btn-sm" style={{ flex: 2 }} onClick={() => setMobileFilterOpen(false)}>Áp dụng</button>
          </div>
        </div>
      </div>
    </>
  )
}
