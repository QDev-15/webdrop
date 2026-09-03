import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import { useSite, type Product } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { MATERIALS, STYLES, BRANDS, MAX_PRICE, CATEGORY_LABELS, fmtVND } from '../data/filters'
import ProductCard from '../components/ProductCard'

// Trang "Sản phẩm" — bám sát đúng cấu trúc san-pham.html gốc: catalog header + toolbar NGANG
// (category pill + 3 dropdown checkbox Chất liệu/Thương hiệu/Phong cách + price range slider +
// sort select, áp dụng TỨC THÌ không nút Apply) + active chips + grid 4-col + pagination cổ điển +
// offcanvas filter mobile. KHÔNG có sidebar dọc (template này không dùng sidebar 5-block).
const PER_PAGE = 12

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price-asc', label: 'Giá tăng dần' },
  { value: 'price-desc', label: 'Giá giảm dần' },
  { value: 'bestseller', label: 'Bán chạy' },
  { value: 'rating', label: 'Đánh giá cao' },
]

const THEME_TITLES: Record<string, string> = { nam: 'Bộ sưu tập Nam', nu: 'Bộ sưu tập Nữ', unisex: 'Unisex' }

type DropdownKey = 'material' | 'brand' | 'style' | 'price' | null

export default function ProductsPage() {
  const { categories } = useSite()
  const [searchParams, setSearchParams] = useSearchParams()

  const [initialized, setInitialized] = useState(false)
  const [category, setCategory] = useState('all')
  const [materials, setMaterials] = useState<string[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [styles, setStyles] = useState<string[]>([])
  const [priceMax, setPriceMax] = useState(MAX_PRICE)
  const [priceInput, setPriceInput] = useState(MAX_PRICE)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [limitedOnly, setLimitedOnly] = useState(false)

  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<HTMLDivElement>(null)

  useDocumentMeta({
    title: 'Tất cả sản phẩm — MERIDIAN',
    description: 'Hơn 40 mẫu đồng hồ chính hãng tại MERIDIAN — lọc theo danh mục, chất liệu dây, thương hiệu, phong cách và mức giá.',
  })

  // Đọc state ban đầu từ URL (1 lần khi mount) — khớp readStateFromURL() template gốc.
  useEffect(() => {
    const p = searchParams
    const cat = p.get('category')
    setCategory(cat && ['nam', 'nu', 'unisex'].includes(cat) ? cat : 'all')
    setMaterials(p.get('material') ? p.get('material')!.split(',').filter(s => MATERIALS.some(m => m.slug === s)) : [])
    setBrands(p.get('brand') ? p.get('brand')!.split(',').filter(b => BRANDS.includes(b)) : [])
    setStyles(p.get('style') ? p.get('style')!.split(',').filter(s => STYLES.some(x => x.slug === s)) : [])
    const pm = p.get('price') ? Number(p.get('price')) : MAX_PRICE
    setPriceMax(pm > 0 ? pm : MAX_PRICE); setPriceInput(pm > 0 ? pm : MAX_PRICE)
    const q = (p.get('q') || '').slice(0, 100)
    setSearchInput(q); setSearch(q)
    setSort(p.get('sort') || 'newest')
    setPage(p.get('page') ? Math.max(1, Number(p.get('page'))) : 1)
    setLimitedOnly(p.get('limited') === '1')
    setInitialized(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Debounce ô tìm kiếm (submit từ nav Header cũng đi qua URL — đồng bộ khi ?q= đổi từ bên ngoài)
  useEffect(() => {
    if (!initialized) return
    const q = searchParams.get('q') || ''
    if (q !== search) { setSearchInput(q); setSearch(q); setPage(1) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  useEffect(() => {
    if (!initialized) return
    const t = setTimeout(() => { setSearch(searchInput); setPage(1) }, 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  // Debounce giá (250ms — khớp template dhOnPriceInput)
  useEffect(() => {
    if (!initialized) return
    const t = setTimeout(() => { setPriceMax(priceInput); setPage(1) }, 250)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceInput])

  useEffect(() => {
    if (!initialized) return
    setLoading(true)

    const apiParams = new URLSearchParams()
    apiParams.set('per_page', String(PER_PAGE))
    apiParams.set('page', String(page))
    if (category !== 'all') {
      const catId = categories.find(c => c.slug === category)?.id
      if (catId) apiParams.set('category_ids', String(catId))
    }
    if (materials.length) apiParams.set('material', materials.join(','))
    if (brands.length) apiParams.set('brand', brands.join(','))
    if (styles.length) apiParams.set('style', styles.join(','))
    if (priceMax < MAX_PRICE) apiParams.set('max_price', String(priceMax))
    if (search) apiParams.set('q', search)
    if (sort !== 'newest') apiParams.set('sort', sort)
    if (limitedOnly) apiParams.set('limited', '1')

    api.getPaged<Product[]>(`/public/products?${apiParams.toString()}`)
      .then(({ data, total }) => { setProducts(data); setTotal(total) })
      .catch(() => { setProducts([]); setTotal(0) })
      .finally(() => setLoading(false))

    const urlParams = new URLSearchParams()
    if (category !== 'all') urlParams.set('category', category)
    if (materials.length) urlParams.set('material', materials.join(','))
    if (brands.length) urlParams.set('brand', brands.join(','))
    if (styles.length) urlParams.set('style', styles.join(','))
    if (priceMax < MAX_PRICE) urlParams.set('price', String(priceMax))
    if (search) urlParams.set('q', search)
    if (sort !== 'newest') urlParams.set('sort', sort)
    if (page > 1) urlParams.set('page', String(page))
    if (limitedOnly) urlParams.set('limited', '1')
    setSearchParams(urlParams, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, category, materials.join(','), brands.join(','), styles.join(','), priceMax, search, sort, page, limitedOnly, categories])

  const toggleInList = (list: string[], value: string, setter: (v: string[]) => void) => {
    setter(list.includes(value) ? list.filter(x => x !== value) : [...list, value])
    setPage(1)
  }

  const clearAll = () => {
    setCategory('all'); setMaterials([]); setBrands([]); setStyles([])
    setPriceMax(MAX_PRICE); setPriceInput(MAX_PRICE)
    setSearchInput(''); setSearch(''); setSort('newest'); setPage(1); setLimitedOnly(false)
  }

  // Đóng dropdown khi click ra ngoài — khớp document click listener của template gốc.
  useEffect(() => {
    if (!openDropdown) return
    const onDocClick = (e: MouseEvent) => {
      if (controlsRef.current && !controlsRef.current.contains(e.target as Node)) setOpenDropdown(null)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [openDropdown])

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
  const startIdx = (page - 1) * PER_PAGE

  const chips: { key: string; label: string; onRemove: () => void }[] = []
  if (category !== 'all') chips.push({ key: 'cat', label: CATEGORY_LABELS[category], onRemove: () => { setCategory('all'); setPage(1) } })
  materials.forEach(m => chips.push({ key: `mat-${m}`, label: MATERIALS.find(x => x.slug === m)?.name || m, onRemove: () => toggleInList(materials, m, setMaterials) }))
  brands.forEach(b => chips.push({ key: `brand-${b}`, label: b, onRemove: () => toggleInList(brands, b, setBrands) }))
  styles.forEach(s => chips.push({ key: `style-${s}`, label: STYLES.find(x => x.slug === s)?.name || s, onRemove: () => toggleInList(styles, s, setStyles) }))
  if (priceMax < MAX_PRICE) chips.push({ key: 'price', label: 'Dưới ' + fmtVND(priceMax), onRemove: () => { setPriceMax(MAX_PRICE); setPriceInput(MAX_PRICE); setPage(1) } })
  if (search) chips.push({ key: 'search', label: `Tìm: "${search}"`, onRemove: () => { setSearchInput(''); setSearch(''); setPage(1) } })
  if (limitedOnly) chips.push({ key: 'limited', label: 'Chỉ phiên bản giới hạn', onRemove: () => { setLimitedOnly(false); setPage(1) } })

  const activeFilterCount = materials.length + brands.length + styles.length + (priceMax < MAX_PRICE ? 1 : 0)

  const goToPage = (n: number) => {
    if (n < 1 || n > totalPages) return
    setPage(n)
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const pageTitle = limitedOnly ? 'Phiên bản giới hạn' : (category !== 'all' ? THEME_TITLES[category] : 'Tất cả sản phẩm')
  const breadcrumbLabel = limitedOnly ? 'Phiên bản giới hạn' : (category !== 'all' ? THEME_TITLES[category] : 'Sản phẩm')

  return (
    <>
      <section className="dh-catalog-header">
        <div className="dh-container">
          <div className="dh-breadcrumb"><a href="/">Trang chủ</a> / <span>{breadcrumbLabel}</span></div>
          <h1>{pageTitle}</h1>
          <p>Hơn 40 mẫu đồng hồ chính hãng — lọc theo nhu cầu của bạn</p>
        </div>
      </section>

      {/* ══ Toolbar ══ */}
      <div className="dh-toolbar-wrap">
        <div className="dh-container">
          <div className="dh-toolbar">
            <div className="dh-toolbar-filters" ref={controlsRef}>
              <div className="dh-chip-row">
                <button className={'dh-chip' + (category === 'all' ? ' active' : '')} onClick={() => { setCategory('all'); setPage(1) }}>Tất cả</button>
                <button className={'dh-chip' + (category === 'nam' ? ' active' : '')} onClick={() => { setCategory('nam'); setPage(1) }}>Nam</button>
                <button className={'dh-chip' + (category === 'nu' ? ' active' : '')} onClick={() => { setCategory('nu'); setPage(1) }}>Nữ</button>
                <button className={'dh-chip' + (category === 'unisex' ? ' active' : '')} onClick={() => { setCategory('unisex'); setPage(1) }}>Unisex</button>
              </div>

              <div className={'dh-fdrop' + (openDropdown === 'material' ? ' open' : '')}>
                <button className="dh-fdrop-btn" type="button" onClick={() => setOpenDropdown(o => o === 'material' ? null : 'material')}>
                  Chất liệu dây <span className="dh-fdrop-badge" hidden={materials.length === 0}>{materials.length}</span>
                  <svg viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M1 1l5 5 5-5" /></svg>
                </button>
                <div className="dh-fdrop-panel">
                  {MATERIALS.map(m => (
                    <label className="dh-fdrop-check" key={m.slug}>
                      <input type="checkbox" checked={materials.includes(m.slug)} onChange={() => toggleInList(materials, m.slug, setMaterials)} />
                      <span>{m.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={'dh-fdrop' + (openDropdown === 'brand' ? ' open' : '')}>
                <button className="dh-fdrop-btn" type="button" onClick={() => setOpenDropdown(o => o === 'brand' ? null : 'brand')}>
                  Thương hiệu <span className="dh-fdrop-badge" hidden={brands.length === 0}>{brands.length}</span>
                  <svg viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M1 1l5 5 5-5" /></svg>
                </button>
                <div className="dh-fdrop-panel">
                  {BRANDS.map(b => (
                    <label className="dh-fdrop-check" key={b}>
                      <input type="checkbox" checked={brands.includes(b)} onChange={() => toggleInList(brands, b, setBrands)} />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={'dh-fdrop' + (openDropdown === 'style' ? ' open' : '')}>
                <button className="dh-fdrop-btn" type="button" onClick={() => setOpenDropdown(o => o === 'style' ? null : 'style')}>
                  Phong cách <span className="dh-fdrop-badge" hidden={styles.length === 0}>{styles.length}</span>
                  <svg viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M1 1l5 5 5-5" /></svg>
                </button>
                <div className="dh-fdrop-panel">
                  {STYLES.map(s => (
                    <label className="dh-fdrop-check" key={s.slug}>
                      <input type="checkbox" checked={styles.includes(s.slug)} onChange={() => toggleInList(styles, s.slug, setStyles)} />
                      <span>{s.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={'dh-fdrop' + (openDropdown === 'price' ? ' open' : '')}>
                <button className="dh-fdrop-btn" type="button" onClick={() => setOpenDropdown(o => o === 'price' ? null : 'price')}>
                  Khoảng giá <span className="dh-fdrop-badge" hidden={priceMax >= MAX_PRICE}>1</span>
                  <svg viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M1 1l5 5 5-5" /></svg>
                </button>
                <div className="dh-fdrop-panel" style={{ minWidth: 260 }}>
                  <div className="dh-price-range">
                    <div className="dh-price-vals"><span>0₫</span><span>{fmtVND(priceInput)}</span></div>
                    <input type="range" min={0} max={MAX_PRICE} step={500000} value={priceInput} onChange={e => setPriceInput(Number(e.target.value))} />
                  </div>
                </div>
              </div>

              <button className="dh-mobile-filter-btn" onClick={() => setMobileFilterOpen(true)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 6h16M8 12h8M11 18h2" /></svg>
                Bộ lọc <span className="badge" hidden={activeFilterCount === 0}>{activeFilterCount}</span>
              </button>
            </div>

            <div className="dh-toolbar-right">
              <span className="dh-result-count" aria-live="polite">
                {products.length ? `Hiển thị ${startIdx + 1}–${startIdx + products.length} trong ${total} sản phẩm` : (loading ? 'Đang tải...' : 'Không có sản phẩm nào')}
              </span>
              <select className="dh-sort-select" value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {chips.length > 0 && (
            <div className="dh-chips-row">
              {chips.map(c => (
                <span className="dh-active-chip" key={c.key}>
                  {c.label}
                  <button aria-label="Gỡ bộ lọc" onClick={c.onRemove}>✕</button>
                </span>
              ))}
              <button className="dh-clear-all" onClick={clearAll}>Xóa tất cả</button>
            </div>
          )}
        </div>
      </div>

      {/* ══ Grid + Pagination ══ */}
      <section className="dh-sec" ref={gridRef}>
        <div className="dh-container">
          {!loading && products.length === 0 ? (
            <div className="dh-empty-state">
              <div className="ico">🔍</div>
              <h3>Không tìm thấy sản phẩm phù hợp</h3>
              <p>Hãy thử điều chỉnh hoặc xóa bớt bộ lọc đang áp dụng.</p>
              <button className="dh-btn dh-btn-solid" onClick={clearAll}>Xóa tất cả bộ lọc</button>
            </div>
          ) : (
            <div className="dh-prod-grid">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="dh-pagination" aria-label="Phân trang">
              <button disabled={page === 1} aria-label="Trang trước" onClick={() => goToPage(page - 1)}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} className={n === page ? 'active' : ''} onClick={() => goToPage(n)}>{n}</button>
              ))}
              <button disabled={page === totalPages} aria-label="Trang sau" onClick={() => goToPage(page + 1)}>›</button>
            </nav>
          )}
        </div>
      </section>

      {/* ══ Mobile filter offcanvas ══ */}
      <div className={'dh-mobile-offcanvas' + (mobileFilterOpen ? ' open' : '')} role="dialog" aria-modal="true" aria-label="Bộ lọc sản phẩm">
        <div className="dh-mobile-offcanvas-backdrop" onClick={() => setMobileFilterOpen(false)}></div>
        <div className="dh-mobile-offcanvas-panel">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Bộ lọc sản phẩm</h5>
            <button type="button" className="btn-close" aria-label="Đóng" onClick={() => setMobileFilterOpen(false)}>✕</button>
          </div>
          <div className="offcanvas-body">
            <div className="dh-off-section">
              <h6>Danh mục</h6>
              <div className="dh-chip-row">
                <button className={'dh-chip' + (category === 'all' ? ' active' : '')} onClick={() => { setCategory('all'); setPage(1) }}>Tất cả</button>
                <button className={'dh-chip' + (category === 'nam' ? ' active' : '')} onClick={() => { setCategory('nam'); setPage(1) }}>Nam</button>
                <button className={'dh-chip' + (category === 'nu' ? ' active' : '')} onClick={() => { setCategory('nu'); setPage(1) }}>Nữ</button>
                <button className={'dh-chip' + (category === 'unisex' ? ' active' : '')} onClick={() => { setCategory('unisex'); setPage(1) }}>Unisex</button>
              </div>
            </div>
            <div className="dh-off-section">
              <h6>Khoảng giá</h6>
              <div className="dh-price-vals"><span>0₫</span><span>{fmtVND(priceInput)}</span></div>
              <input type="range" min={0} max={MAX_PRICE} step={500000} value={priceInput} onChange={e => setPriceInput(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent)' }} />
            </div>
            <div className="dh-off-section">
              <h6>Chất liệu dây</h6>
              {MATERIALS.map(m => (
                <label className="dh-fdrop-check" key={m.slug}>
                  <input type="checkbox" checked={materials.includes(m.slug)} onChange={() => toggleInList(materials, m.slug, setMaterials)} />
                  <span>{m.name}</span>
                </label>
              ))}
            </div>
            <div className="dh-off-section">
              <h6>Thương hiệu</h6>
              {BRANDS.map(b => (
                <label className="dh-fdrop-check" key={b}>
                  <input type="checkbox" checked={brands.includes(b)} onChange={() => toggleInList(brands, b, setBrands)} />
                  <span>{b}</span>
                </label>
              ))}
            </div>
            <div className="dh-off-section">
              <h6>Phong cách</h6>
              {STYLES.map(s => (
                <label className="dh-fdrop-check" key={s.slug}>
                  <input type="checkbox" checked={styles.includes(s.slug)} onChange={() => toggleInList(styles, s.slug, setStyles)} />
                  <span>{s.name}</span>
                </label>
              ))}
            </div>
            <div className="dh-off-section">
              <h6>Sắp xếp</h6>
              <select className="dh-sort-select" style={{ width: '100%' }} value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="dh-off-apply">
              <button className="dh-btn dh-btn-solid" style={{ width: '100%' }} onClick={() => setMobileFilterOpen(false)}>Xem kết quả</button>
              <button className="dh-clear-all" style={{ display: 'block', margin: '14px auto 0' }} onClick={clearAll}>Xóa tất cả bộ lọc</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
