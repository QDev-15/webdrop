import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import { useSite, type Product } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { fmt, CATEGORY_LABEL } from '../lib/format'
import ProductCard from '../components/ProductCard'

// Trang Sản phẩm dùng FILTER TOOLBAR NGANG (không phải sidebar dọc 5-block chuẩn rule 22) —
// bám đúng cấu trúc thật của san-pham.html template gốc (category pill + brand/color dropdown
// checkbox + price range slider + sort select, tất cả áp dụng tức thì không nút Apply).
const MAX_PRICE = 50000000
const PER_PAGE = 12

const CATEGORIES_STATIC = [
  { slug: '', label: 'Tất cả' },
  { slug: 'dien-thoai', label: 'Điện thoại' },
  { slug: 'tai-nghe', label: 'Tai nghe' },
  { slug: 'sac-cap', label: 'Sạc & Cáp' },
  { slug: 'op-lung', label: 'Ốp lưng' },
]
const BRAND_OPTIONS = [
  { slug: 'apple', label: 'Apple' },
  { slug: 'samsung', label: 'Samsung' },
  { slug: 'xiaomi', label: 'Xiaomi' },
  { slug: 'oppo', label: 'OPPO' },
  { slug: 'sony', label: 'Sony' },
  { slug: 'jbl', label: 'JBL' },
  { slug: 'anker', label: 'Anker' },
]
const COLOR_OPTIONS = [
  { slug: 'den', label: 'Đen' },
  { slug: 'trang', label: 'Trắng' },
  { slug: 'xanh', label: 'Xanh' },
  { slug: 'tim', label: 'Tím' },
  { slug: 'vang', label: 'Vàng' },
  { slug: 'bac', label: 'Bạc' },
]
const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price-asc', label: 'Giá tăng dần' },
  { value: 'price-desc', label: 'Giá giảm dần' },
  { value: 'bestseller', label: 'Bán chạy nhất' },
  { value: 'rating', label: 'Đánh giá cao' },
]

export default function ProductsPage() {
  const { settings, categories } = useSite()
  const [searchParams, setSearchParams] = useSearchParams()

  const [initialized, setInitialized] = useState(false)
  const [category, setCategory] = useState('')
  const [brands, setBrands] = useState<string[]>([])
  const [colors, setColors] = useState<string[]>([])
  const [priceMax, setPriceMax] = useState(MAX_PRICE)
  const [priceInput, setPriceInput] = useState(MAX_PRICE)
  const [theme, setTheme] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)

  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState<'' | 'brand' | 'price' | 'color'>('')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  useDocumentMeta({
    title: `Sản phẩm — ${settings.site_name || 'AMI Mobile'}`,
    description: `Toàn bộ sản phẩm ${settings.site_name || 'AMI Mobile'}: điện thoại, tai nghe, sạc & cáp, ốp lưng — lọc nhanh, giá tốt, chính hãng.`,
  })

  // ── Đọc state ban đầu từ URL (chỉ 1 lần khi mount) ──
  useEffect(() => {
    const p = searchParams
    setCategory(p.get('category') || '')
    setBrands(p.get('brand') ? p.get('brand')!.split(',').filter(Boolean) : [])
    setColors(p.get('color') ? p.get('color')!.split(',').filter(Boolean) : [])
    const pm = p.get('priceMax') ? Number(p.get('priceMax')) : MAX_PRICE
    setPriceMax(pm); setPriceInput(pm)
    setTheme(p.get('theme') || '')
    const q = p.get('q') || ''
    setSearchInput(q); setSearch(q)
    setSort(p.get('sort') || 'newest')
    setPage(p.get('page') ? Math.max(1, Number(p.get('page'))) : 1)
    setInitialized(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Debounce ô tìm kiếm (400ms) ──
  useEffect(() => {
    if (!initialized) return
    const t = setTimeout(() => { setSearch(searchInput); setPage(1) }, 400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  // ── Debounce khoảng giá (250ms) ──
  useEffect(() => {
    if (!initialized) return
    const t = setTimeout(() => { setPriceMax(priceInput); setPage(1) }, 250)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceInput])

  // ── Fetch + đồng bộ URL mỗi khi filter/trang đổi ──
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
    if (colors.length) apiParams.set('colors', colors.join(','))
    if (priceMax < MAX_PRICE) apiParams.set('max_price', String(priceMax))
    if (theme) apiParams.set('theme', theme)
    if (search) apiParams.set('q', search)
    if (sort !== 'newest') apiParams.set('sort', sort)

    api.getPaged<Product[]>(`/public/products?${apiParams.toString()}`)
      .then(({ data, total }) => { setProducts(data); setTotal(total) })
      .catch(() => { setProducts([]); setTotal(0) })
      .finally(() => setLoading(false))

    const urlParams = new URLSearchParams()
    if (category) urlParams.set('category', category)
    if (brands.length) urlParams.set('brand', brands.join(','))
    if (colors.length) urlParams.set('color', colors.join(','))
    if (priceMax < MAX_PRICE) urlParams.set('priceMax', String(priceMax))
    if (theme) urlParams.set('theme', theme)
    if (search) urlParams.set('q', search)
    if (sort !== 'newest') urlParams.set('sort', sort)
    if (page > 1) urlParams.set('page', String(page))
    setSearchParams(urlParams, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, category, brands.join(','), colors.join(','), priceMax, theme, search, sort, page, categories])

  const toggleBrand = (slug: string) => {
    setBrands(b => b.includes(slug) ? b.filter(x => x !== slug) : [...b, slug])
    setPage(1)
  }
  const toggleColor = (slug: string) => {
    setColors(c => c.includes(slug) ? c.filter(x => x !== slug) : [...c, slug])
    setPage(1)
  }
  const changeCategory = (slug: string) => { setCategory(slug); setPage(1) }
  const changeSort = (v: string) => { setSort(v); setPage(1) }

  const clearAllFilters = () => {
    setCategory(''); setBrands([]); setColors([])
    setPriceMax(MAX_PRICE); setPriceInput(MAX_PRICE)
    setTheme(''); setSearchInput(''); setSearch(''); setSort('newest'); setPage(1)
  }

  const activeCount = (category ? 1 : 0) + brands.length + colors.length + (priceMax < MAX_PRICE ? 1 : 0) + (theme ? 1 : 0) + (search ? 1 : 0)
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
  const startIdx = (page - 1) * PER_PAGE

  const chips: { key: string; label: string; onRemove: () => void }[] = []
  if (category) chips.push({ key: 'category', label: CATEGORY_LABEL[category] || category, onRemove: () => changeCategory('') })
  brands.forEach(b => chips.push({ key: `brand-${b}`, label: BRAND_OPTIONS.find(o => o.slug === b)?.label || b, onRemove: () => toggleBrand(b) }))
  colors.forEach(c => chips.push({ key: `color-${c}`, label: COLOR_OPTIONS.find(o => o.slug === c)?.label || c, onRemove: () => toggleColor(c) }))
  if (priceMax < MAX_PRICE) chips.push({ key: 'price', label: `Đến ${fmt(priceMax)}`, onRemove: () => { setPriceMax(MAX_PRICE); setPriceInput(MAX_PRICE); setPage(1) } })
  if (theme) chips.push({ key: 'theme', label: `Theme: ${theme}`, onRemove: () => { setTheme(''); setPage(1) } })
  if (search) chips.push({ key: 'search', label: `Tìm: ${search}`, onRemove: () => { setSearchInput(''); setSearch(''); setPage(1) } })

  const chipsRow = chips.length > 0 && (
    <div className="mb-chips-row show">
      {chips.map(c => (
        <button key={c.key} className="mb-chip" onClick={c.onRemove} aria-label={`Xóa lọc ${c.label}`}>
          {c.label} <span className="mb-chip-x">&times;</span>
        </button>
      ))}
      <button className="mb-chip-clear" onClick={clearAllFilters}>Xóa tất cả</button>
    </div>
  )

  const goToPage = (n: number) => {
    setPage(n)
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <div className="mb-page-hero">
        <div className="mb-container">
          <div className="mb-breadcrumb">
            <a href="/">Trang chủ</a><span>/</span><span>Sản phẩm</span>
          </div>
          <div className="mb-label mb-page-hero-label">Danh mục</div>
          <h1>Tất cả sản phẩm</h1>
          <p>Điện thoại, tai nghe, sạc & cáp, ốp lưng — chính hãng, bảo hành đầy đủ</p>
        </div>
      </div>

      <div className="mb-container" style={{ paddingTop: 28 }}>
        {/* Desktop filter bar */}
        <div className="mb-filter-bar d-none d-lg-block">
          <div className="mb-filter-row1">
            <div className="mb-filter-cat">
              {CATEGORIES_STATIC.map(c => (
                <button key={c.slug || 'all'} className={'mb-filter-cat-btn' + (category === c.slug ? ' active' : '')} onClick={() => changeCategory(c.slug)}>
                  {c.label}
                </button>
              ))}
            </div>

            <div className="mb-filter-dropdown">
              <button className={'mb-filter-dropdown-btn' + (brands.length ? ' has-active' : '')} onClick={() => setDropdownOpen(o => o === 'brand' ? '' : 'brand')}>
                Thương hiệu <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg>
              </button>
              <div className={'mb-filter-dropdown-menu' + (dropdownOpen === 'brand' ? ' open' : '')}>
                {BRAND_OPTIONS.map(b => (
                  <label className="mb-filter-check-item" key={b.slug}>
                    <input type="checkbox" checked={brands.includes(b.slug)} onChange={() => toggleBrand(b.slug)} /> <span>{b.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-filter-dropdown">
              <button className={'mb-filter-dropdown-btn' + (priceMax < MAX_PRICE ? ' has-active' : '')} onClick={() => setDropdownOpen(o => o === 'price' ? '' : 'price')}>
                Khoảng giá <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg>
              </button>
              <div className={'mb-filter-dropdown-menu' + (dropdownOpen === 'price' ? ' open' : '')} style={{ minWidth: 220, padding: 16 }}>
                <div className="mb-filter-price-wrap">
                  <label className="mb-filter-price-label">Giá tối đa: <span>{fmt(priceInput)}</span></label>
                  <input type="range" className="mb-filter-price-range" min={0} max={MAX_PRICE} step={500000} value={priceInput} onChange={e => setPriceInput(Number(e.target.value))} />
                  <div className="mb-filter-price-vals"><span>0đ</span><span>{fmt(MAX_PRICE)}</span></div>
                </div>
              </div>
            </div>

            <div className="mb-filter-dropdown">
              <button className={'mb-filter-dropdown-btn' + (colors.length ? ' has-active' : '')} onClick={() => setDropdownOpen(o => o === 'color' ? '' : 'color')}>
                Màu sắc <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg>
              </button>
              <div className={'mb-filter-dropdown-menu' + (dropdownOpen === 'color' ? ' open' : '')}>
                {COLOR_OPTIONS.map(c => (
                  <label className="mb-filter-check-item" key={c.slug}>
                    <input type="checkbox" checked={colors.includes(c.slug)} onChange={() => toggleColor(c.slug)} /> <span>{c.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-filter-sort-row">
              <span className="mb-filter-count" aria-live="polite">
                {total === 0 ? '0 sản phẩm' : `Hiển thị ${startIdx + 1}–${startIdx + products.length} trong ${total} sản phẩm`}
              </span>
              <select className="mb-filter-sort" aria-label="Sắp xếp" value={sort} onChange={e => changeSort(e.target.value)}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {chipsRow}
        </div>

        {/* Mobile filter button */}
        <div className="d-lg-none mb-3">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <button className="mb-filter-mobile-btn" onClick={() => setMobileFilterOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" /></svg>
              Bộ lọc
              <span className={'mb-filter-badge' + (activeCount > 0 ? ' show' : '')}>{activeCount}</span>
            </button>
            <select className="mb-filter-sort" style={{ marginLeft: 'auto' }} aria-label="Sắp xếp" value={sort} onChange={e => changeSort(e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          {chipsRow}
        </div>
      </div>

      {/* Mobile Offcanvas Filter (React-controlled, không phụ thuộc Bootstrap JS bundle) */}
      <div
        className={'offcanvas offcanvas-start mb-offcanvas' + (mobileFilterOpen ? ' show' : '')}
        style={{ visibility: mobileFilterOpen ? 'visible' : 'hidden' }}
        tabIndex={-1}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Bộ lọc</h5>
          <button type="button" className="btn-close" aria-label="Đóng" onClick={() => setMobileFilterOpen(false)}></button>
        </div>
        <div className="offcanvas-body">
          <div className="mb-offcanvas-section">
            <span className="mb-offcanvas-label">Danh mục</span>
            <div className="mb-filter-cat" style={{ flexWrap: 'wrap' }}>
              {CATEGORIES_STATIC.map(c => (
                <button key={c.slug || 'all'} className={'mb-filter-cat-btn' + (category === c.slug ? ' active' : '')} style={{ marginBottom: 6 }} onClick={() => changeCategory(c.slug)}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-offcanvas-section">
            <span className="mb-offcanvas-label">Thương hiệu</span>
            {BRAND_OPTIONS.map(b => (
              <label className="mb-filter-check-item" key={b.slug}>
                <input type="checkbox" checked={brands.includes(b.slug)} onChange={() => toggleBrand(b.slug)} /><span>{b.label}</span>
              </label>
            ))}
          </div>
          <div className="mb-offcanvas-section">
            <span className="mb-offcanvas-label">Khoảng giá</span>
            <div className="mb-filter-price-wrap">
              <label className="mb-filter-price-label">Giá tối đa: <span>{fmt(priceInput)}</span></label>
              <input type="range" className="mb-filter-price-range" min={0} max={MAX_PRICE} step={500000} value={priceInput} onChange={e => setPriceInput(Number(e.target.value))} />
              <div className="mb-filter-price-vals"><span>0đ</span><span>{fmt(MAX_PRICE)}</span></div>
            </div>
          </div>
          <div className="mb-offcanvas-section">
            <span className="mb-offcanvas-label">Màu sắc</span>
            {COLOR_OPTIONS.map(c => (
              <label className="mb-filter-check-item" key={c.slug}>
                <input type="checkbox" checked={colors.includes(c.slug)} onChange={() => toggleColor(c.slug)} /><span>{c.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      {mobileFilterOpen && <div className="offcanvas-backdrop fade show" onClick={() => setMobileFilterOpen(false)}></div>}

      {/* Product Grid */}
      <div className="mb-container" style={{ paddingBottom: 60 }} ref={gridRef}>
        {!loading && products.length === 0 ? (
          <div className="mb-empty-state show">
            <div className="mb-empty-icon">📱</div>
            <div className="mb-empty-title">Không tìm thấy sản phẩm</div>
            <p className="mb-empty-sub">Thử xóa bộ lọc hoặc tìm kiếm với từ khóa khác.</p>
            <button className="mb-btn mb-btn-outline" onClick={clearAllFilters}>Xóa tất cả bộ lọc</button>
          </div>
        ) : (
          <div className="mb-prod-grid">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {totalPages > 1 && (
          <nav aria-label="Phân trang sản phẩm">
            <ul className="mb-pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <li key={n} className={'page-item' + (n === page ? ' active' : '')}>
                  <button className="page-link" onClick={() => goToPage(n)}>{n}</button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </>
  )
}
