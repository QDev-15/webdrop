import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import { useSite, type Product } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { fmtPrice, SKIN_TYPE_LABELS, THEME_LABELS } from '../lib/format'
import ProductCard from '../components/ProductCard'

// Trang Sản phẩm dùng FILTER TOOLBAR NGANG (không phải sidebar dọc 5-block chuẩn rule 22) —
// bám đúng cấu trúc thật của san-pham.html template gốc: category pill (single-select, không
// multi) + search input + brand/skin-type dropdown checkbox + dual price range slider + sort,
// tất cả áp dụng tức thì không nút "Áp dụng". Cùng ngoại lệ đã áp dụng ở shop-tui-sach/shop-may-tinh/
// shop-ami-mobile/shop-quan-ao-ami.
const MAX_PRICE = 3000000
const PER_PAGE = 12

const CATEGORY_PILLS = [
  { slug: '', label: 'Tất cả' },
  { slug: 'cham-soc-da', label: 'Chăm Sóc Da' },
  { slug: 'trang-diem', label: 'Trang Điểm' },
  { slug: 'cham-soc-toc', label: 'Chăm Sóc Tóc' },
  { slug: 'nuoc-hoa', label: 'Nước Hoa' },
  { slug: 'dung-cu-lam-dep', label: 'Dụng Cụ' },
]
const BRAND_OPTIONS = ['The Ordinary', 'CeraVe', 'Innisfree', 'Anessa', 'Laneige', 'Sulwhasoo', 'MAC', 'Charlotte Tilbury', "L'Occitane", 'Kérastase', 'Chanel', 'Foreo', 'Generic']
const SKIN_TYPE_OPTIONS = ['da-dau', 'da-kho', 'da-hon-hop', 'da-nhay-cam', 'moi-loai-da']
const SORT_OPTIONS = [
  { value: 'default', label: 'Mặc định' },
  { value: 'price-asc', label: 'Giá: Thấp đến cao' },
  { value: 'price-desc', label: 'Giá: Cao đến thấp' },
  { value: 'rating-desc', label: 'Đánh giá cao nhất' },
  { value: 'sold-desc', label: 'Bán chạy nhất' },
  { value: 'newest', label: 'Mới nhất' },
]

export default function ProductsPage() {
  const { settings, categories } = useSite()
  const [searchParams, setSearchParams] = useSearchParams()

  const [initialized, setInitialized] = useState(false)
  const [category, setCategory] = useState('')
  const [theme, setTheme] = useState('')
  const [brands, setBrands] = useState<string[]>([])
  const [skinTypes, setSkinTypes] = useState<string[]>([])
  const [priceMin, setPriceMinState] = useState(0)
  const [priceMax, setPriceMaxState] = useState(MAX_PRICE)
  const [priceMinInput, setPriceMinInput] = useState(0)
  const [priceMaxInput, setPriceMaxInput] = useState(MAX_PRICE)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('default')
  const [page, setPage] = useState(1)

  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState<'' | 'brand' | 'skin' | 'price'>('')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  useDocumentMeta({
    title: `Sản Phẩm — ${settings.site_name || 'LUMIÈRE Beauty'}`,
    description: `Khám phá 36 sản phẩm mỹ phẩm cao cấp tại ${settings.site_name || 'LUMIÈRE'}: chăm sóc da, trang điểm, nước hoa, dụng cụ làm đẹp. Lọc theo loại da, thương hiệu, giá.`,
  })

  // === Đọc URL params 1 lần khi mount ===
  useEffect(() => {
    const p = searchParams
    setCategory(p.get('category') || '')
    setTheme(p.get('theme') || '')
    setBrands(p.get('brand') ? p.get('brand')!.split(',').filter(Boolean) : [])
    setSkinTypes(p.get('skin') ? p.get('skin')!.split(',').filter(Boolean) : [])
    const minP = p.get('minPrice') ? Number(p.get('minPrice')) : 0
    const maxP = p.get('maxPrice') ? Number(p.get('maxPrice')) : MAX_PRICE
    setPriceMinState(minP); setPriceMinInput(minP)
    setPriceMaxState(maxP); setPriceMaxInput(maxP)
    const q = p.get('q') || ''
    setSearchInput(q); setSearch(q)
    setSort(p.get('sort') || 'default')
    setPage(p.get('page') ? Math.max(1, Number(p.get('page'))) : 1)
    setInitialized(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // === Debounce search ===
  useEffect(() => {
    if (!initialized) return
    const t = setTimeout(() => { setSearch(searchInput); setPage(1) }, 280)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  // === Debounce price range ===
  useEffect(() => {
    if (!initialized) return
    const t = setTimeout(() => {
      let minV = priceMinInput, maxV = priceMaxInput
      if (minV > maxV) { const t2 = minV; minV = maxV; maxV = t2 }
      setPriceMinState(minV); setPriceMaxState(maxV); setPage(1)
    }, 250)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceMinInput, priceMaxInput])

  // === Fetch + sync URL ===
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
    if (theme) apiParams.set('theme', theme)
    if (brands.length) apiParams.set('brands', brands.join(','))
    if (skinTypes.length) apiParams.set('skin_types', skinTypes.join(','))
    if (priceMin > 0) apiParams.set('min_price', String(priceMin))
    if (priceMax < MAX_PRICE) apiParams.set('max_price', String(priceMax))
    if (search) apiParams.set('q', search)
    if (sort !== 'default') apiParams.set('sort', sort)

    api.getPaged<Product[]>(`/public/products?${apiParams.toString()}`)
      .then(({ data, total }) => { setProducts(data); setTotal(total) })
      .catch(() => { setProducts([]); setTotal(0) })
      .finally(() => setLoading(false))

    const urlParams = new URLSearchParams()
    if (category) urlParams.set('category', category)
    if (theme) urlParams.set('theme', theme)
    if (search) urlParams.set('q', search)
    if (sort !== 'default') urlParams.set('sort', sort)
    if (page > 1) urlParams.set('page', String(page))
    if (brands.length) urlParams.set('brand', brands.join(','))
    if (skinTypes.length) urlParams.set('skin', skinTypes.join(','))
    if (priceMin > 0) urlParams.set('minPrice', String(priceMin))
    if (priceMax < MAX_PRICE) urlParams.set('maxPrice', String(priceMax))
    setSearchParams(urlParams, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, category, theme, brands.join(','), skinTypes.join(','), priceMin, priceMax, search, sort, page, categories])

  const setCategoryPill = (slug: string) => { setCategory(slug); setTheme(''); setPage(1) }
  const toggleBrand = (b: string) => { setBrands(v => v.includes(b) ? v.filter(x => x !== b) : [...v, b]); setPage(1) }
  const toggleSkinType = (s: string) => { setSkinTypes(v => v.includes(s) ? v.filter(x => x !== s) : [...v, s]); setPage(1) }
  const changeSort = (v: string) => { setSort(v); setPage(1) }

  const clearAll = () => {
    setCategory(''); setTheme(''); setBrands([]); setSkinTypes([])
    setPriceMinState(0); setPriceMaxState(MAX_PRICE); setPriceMinInput(0); setPriceMaxInput(MAX_PRICE)
    setSearchInput(''); setSearch(''); setSort('default'); setPage(1)
  }

  const catLabelOf = (slug: string) => CATEGORY_PILLS.find(c => c.slug === slug)?.label || slug
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))

  const chips: { key: string; label: string; onRemove: () => void }[] = []
  if (category) chips.push({ key: 'cat', label: catLabelOf(category), onRemove: () => { setCategory(''); setPage(1) } })
  if (theme) chips.push({ key: 'theme', label: THEME_LABELS[theme] || theme, onRemove: () => { setTheme(''); setPage(1) } })
  brands.forEach(b => chips.push({ key: `brand-${b}`, label: b, onRemove: () => toggleBrand(b) }))
  skinTypes.forEach(s => chips.push({ key: `skin-${s}`, label: SKIN_TYPE_LABELS[s] || s, onRemove: () => toggleSkinType(s) }))
  if (priceMin > 0 || priceMax < MAX_PRICE) chips.push({
    key: 'price', label: `${fmtPrice(priceMin)} – ${fmtPrice(priceMax)}`,
    onRemove: () => { setPriceMinState(0); setPriceMaxState(MAX_PRICE); setPriceMinInput(0); setPriceMaxInput(MAX_PRICE) },
  })
  if (search) chips.push({ key: 'search', label: `"${search}"`, onRemove: () => { setSearchInput(''); setSearch('') } })

  const goToPage = (n: number) => {
    setPage(n)
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const totalFilters = (category ? 1 : 0) + brands.length + skinTypes.length + (priceMin > 0 || priceMax < MAX_PRICE ? 1 : 0) + (search ? 1 : 0) + (theme ? 1 : 0)

  return (
    <main id="mp-main" className="mp-catalog-wrap">
      <section className="mp-page-hero">
        <div className="wd-container">
          <nav aria-label="Breadcrumb">
            <ol className="mp-breadcrumb">
              <li><a href="/">Trang chủ</a></li>
              <li><span>Sản phẩm</span></li>
            </ol>
          </nav>
          <h1 className="mp-page-hero-title">Tất Cả Sản Phẩm</h1>
          <p className="mp-page-hero-sub">Khám phá bộ sưu tập mỹ phẩm cao cấp từ các thương hiệu uy tín hàng đầu thế giới</p>
        </div>
      </section>

      <div className="wd-container">
        <div className="mp-filter-toolbar" role="search" aria-label="Bộ lọc sản phẩm">
          <div className="mp-filter-row mp-filter-row--cats" role="group" aria-label="Lọc theo danh mục">
            {CATEGORY_PILLS.map(c => (
              <button key={c.slug || 'all'} className={'mp-cat-pill' + (category === c.slug ? ' active' : '')}
                type="button" aria-pressed={category === c.slug} onClick={() => setCategoryPill(c.slug)}>
                {c.label}
              </button>
            ))}
          </div>

          <div className="mp-filter-row mp-filter-row--dropdowns">
            <div className="mp-filter-search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              <input type="text" className="mp-filter-search-input" placeholder="Tìm kiếm..." aria-label="Tìm kiếm sản phẩm"
                value={searchInput} onChange={e => setSearchInput(e.target.value)} />
            </div>

            <div className="mp-dropdown-wrap">
              <button className="mp-dropdown-btn" aria-haspopup="listbox" aria-expanded={dropdownOpen === 'brand'}
                onClick={() => setDropdownOpen(o => o === 'brand' ? '' : 'brand')} type="button">
                Thương hiệu <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                {brands.length > 0 && <span className="mp-dd-badge">{brands.length}</span>}
              </button>
              <div className={'mp-dropdown-menu' + (dropdownOpen === 'brand' ? ' open' : '')} role="listbox" aria-multiselectable="true">
                {BRAND_OPTIONS.map(b => (
                  <label className="mp-dd-opt" key={b}>
                    <input type="checkbox" checked={brands.includes(b)} onChange={() => toggleBrand(b)} /> {b === 'Generic' ? 'Khác' : b}
                  </label>
                ))}
              </div>
            </div>

            <div className="mp-dropdown-wrap">
              <button className="mp-dropdown-btn" aria-haspopup="listbox" aria-expanded={dropdownOpen === 'skin'}
                onClick={() => setDropdownOpen(o => o === 'skin' ? '' : 'skin')} type="button">
                Loại da <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                {skinTypes.length > 0 && <span className="mp-dd-badge">{skinTypes.length}</span>}
              </button>
              <div className={'mp-dropdown-menu' + (dropdownOpen === 'skin' ? ' open' : '')} role="listbox" aria-multiselectable="true">
                {SKIN_TYPE_OPTIONS.map(s => (
                  <label className="mp-dd-opt" key={s}>
                    <input type="checkbox" checked={skinTypes.includes(s)} onChange={() => toggleSkinType(s)} /> {SKIN_TYPE_LABELS[s]}
                  </label>
                ))}
              </div>
            </div>

            <div className="mp-dropdown-wrap">
              <button className="mp-dropdown-btn" aria-haspopup="dialog" aria-expanded={dropdownOpen === 'price'}
                onClick={() => setDropdownOpen(o => o === 'price' ? '' : 'price')} type="button">
                Khoảng giá <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                {(priceMin > 0 || priceMax < MAX_PRICE) && <span className="mp-dd-badge">!</span>}
              </button>
              <div className={'mp-dropdown-menu mp-price-menu' + (dropdownOpen === 'price' ? ' open' : '')} role="dialog" aria-label="Khoảng giá">
                <div className="mp-price-labels">
                  <span>{fmtPrice(priceMinInput)}</span>
                  <span>{fmtPrice(priceMaxInput)}</span>
                </div>
                <input type="range" min={0} max={MAX_PRICE} step={50000} value={priceMinInput} className="mp-range" aria-label="Giá tối thiểu"
                  onChange={e => setPriceMinInput(Number(e.target.value))} />
                <input type="range" min={0} max={MAX_PRICE} step={50000} value={priceMaxInput} className="mp-range" aria-label="Giá tối đa"
                  onChange={e => setPriceMaxInput(Number(e.target.value))} />
              </div>
            </div>

            <div className="mp-filter-spacer"></div>

            <div className="mp-sort-wrap">
              <label htmlFor="mpSortSelect" className="mp-sort-label">Sắp xếp:</label>
              <select id="mpSortSelect" className="mp-sort-select" aria-label="Sắp xếp sản phẩm" value={sort} onChange={e => changeSort(e.target.value)}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <button className="mp-mob-filter-btn" aria-label="Mở bộ lọc" aria-expanded={mobileFilterOpen} type="button" onClick={() => setMobileFilterOpen(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" /></svg>
              Lọc
              {totalFilters > 0 && <span className="mp-mob-filter-badge">{totalFilters}</span>}
            </button>
          </div>

          {chips.length > 0 && (
            <div className="mp-active-chips" role="group" aria-label="Bộ lọc đang áp dụng">
              {chips.map(c => (
                <button key={c.key} className="mp-chip" type="button" aria-label={`Xóa bộ lọc: ${c.label}`} onClick={c.onRemove}>
                  {c.label} ✕
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mp-result-info" aria-live="polite">
          <span>{total} sản phẩm</span>
        </div>

        <div className="mp-grid" ref={gridRef} role="list" aria-live="polite" aria-label="Danh sách sản phẩm">
          {!loading && products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>

        {!loading && products.length === 0 && (
          <div className="mp-empty-state" aria-live="polite" role="status">
            <div className="mp-empty-icon" aria-hidden="true">🔍</div>
            <h3>Không tìm thấy sản phẩm</h3>
            <p>Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác.</p>
            <button className="mp-btn mp-btn-accent" type="button" onClick={clearAll}>Xóa tất cả bộ lọc</button>
          </div>
        )}

        {totalPages > 1 && (
          <nav className="mp-pagination" aria-label="Phân trang sản phẩm" aria-live="polite">
            {page > 1 && <button className="mp-page-btn" aria-label="Trang trước" onClick={() => goToPage(page - 1)}>‹</button>}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 2)
              .map((n, idx, arr) => (
                <span key={n} style={{ display: 'contents' }}>
                  {idx > 0 && arr[idx - 1] !== n - 1 && <span className="mp-page-ellipsis" aria-hidden="true">…</span>}
                  <button className={'mp-page-btn' + (n === page ? ' active' : '')} aria-label={`Trang ${n}`}
                    aria-current={n === page ? 'page' : undefined} onClick={() => goToPage(n)}>{n}</button>
                </span>
              ))}
            {page < totalPages && <button className="mp-page-btn" aria-label="Trang tiếp" onClick={() => goToPage(page + 1)}>›</button>}
          </nav>
        )}
      </div>

      {/* Mobile filter offcanvas — React-controlled, không phụ thuộc Bootstrap JS bundle */}
      <div className={'mp-mob-filter-backdrop' + (mobileFilterOpen ? ' open' : '')} aria-hidden="true" onClick={() => setMobileFilterOpen(false)}></div>
      <div className={'mp-mob-filter-panel' + (mobileFilterOpen ? ' open' : '')} role="dialog" aria-label="Bộ lọc sản phẩm" aria-modal="true">
        <div className="mp-mob-filter-header">
          <span className="mp-mob-filter-title">Bộ lọc</span>
          <button className="mp-mob-filter-close" aria-label="Đóng bộ lọc" onClick={() => setMobileFilterOpen(false)}>✕</button>
        </div>
        <div className="mp-mob-filter-body">
          <div className="mp-mob-filter-section">
            <div className="mp-mob-filter-section-title">Danh mục</div>
            <div className="mp-mob-cats">
              {CATEGORY_PILLS.map(c => (
                <button key={c.slug || 'all'} className={'mp-mob-cat-btn' + (category === c.slug ? ' active' : '')}
                  type="button" aria-pressed={category === c.slug} onClick={() => setCategoryPill(c.slug)}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mp-mob-filter-section">
            <div className="mp-mob-filter-section-title">Loại da</div>
            <div className="mp-mob-checkboxes">
              {SKIN_TYPE_OPTIONS.map(s => (
                <label className="mp-dd-opt" key={s}>
                  <input type="checkbox" checked={skinTypes.includes(s)} onChange={() => toggleSkinType(s)} /> {SKIN_TYPE_LABELS[s]}
                </label>
              ))}
            </div>
          </div>

          <div className="mp-mob-filter-section">
            <div className="mp-mob-filter-section-title">Khoảng giá</div>
            <div className="mp-price-labels">
              <span>{fmtPrice(priceMinInput)}</span>
              <span>{fmtPrice(priceMaxInput)}</span>
            </div>
            <input type="range" min={0} max={MAX_PRICE} step={50000} value={priceMinInput} className="mp-range" aria-label="Giá tối thiểu"
              onChange={e => setPriceMinInput(Number(e.target.value))} />
            <input type="range" min={0} max={MAX_PRICE} step={50000} value={priceMaxInput} className="mp-range" aria-label="Giá tối đa"
              onChange={e => setPriceMaxInput(Number(e.target.value))} />
          </div>

          <div className="mp-mob-filter-section">
            <div className="mp-mob-filter-section-title">Thương hiệu</div>
            <div className="mp-mob-checkboxes">
              {BRAND_OPTIONS.map(b => (
                <label className="mp-dd-opt" key={b}>
                  <input type="checkbox" checked={brands.includes(b)} onChange={() => toggleBrand(b)} /> {b === 'Generic' ? 'Khác' : b}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="mp-mob-filter-footer">
          <button className="mp-btn mp-btn-ghost" type="button" onClick={clearAll}>Xóa lọc</button>
          <button className="mp-btn mp-btn-accent" type="button" onClick={() => setMobileFilterOpen(false)}>Áp dụng</button>
        </div>
      </div>
    </main>
  )
}
