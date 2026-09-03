import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import { useSite, type Product } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { MATERIALS, COLOR_SWATCHES, ROOMS, MAX_PRICE, fmtVND } from '../data/filters'
import HeroSlider from '../components/HeroSlider'
import ProductCard from '../components/ProductCard'

// Trang chủ MỘC AN = catalog đầy đủ, bám đúng cấu trúc index.html gốc: banner mỏng (search +
// quick-category) + filter toolbar NGANG (category pill + 3 dropdown checkbox Chất liệu/Màu sắc/
// Không gian + price range slider + sort select, áp dụng tức thì không nút Apply) + active chips
// + product grid + pagination cổ điển. KHÔNG có sidebar filter dọc.
const PER_PAGE = 12

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price-asc', label: 'Giá tăng dần' },
  { value: 'price-desc', label: 'Giá giảm dần' },
  { value: 'bestseller', label: 'Bán chạy' },
  { value: 'rating', label: 'Đánh giá cao' },
]

type DropdownKey = 'material' | 'color' | 'room' | null

export default function ProductsPage() {
  const { settings, categories } = useSite()
  const [searchParams, setSearchParams] = useSearchParams()

  const [initialized, setInitialized] = useState(false)
  const [category, setCategory] = useState('tat-ca')
  const [materials, setMaterials] = useState<string[]>([])
  const [colors, setColors] = useState<string[]>([])
  const [rooms, setRooms] = useState<string[]>([])
  const [collection, setCollection] = useState<string | null>(null)
  const [priceMax, setPriceMax] = useState(MAX_PRICE)
  const [priceInput, setPriceInput] = useState(MAX_PRICE)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)

  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  useDocumentMeta({
    title: settings.meta_title || 'MỘC AN — Nội thất tối giản cho không gian sống chậm',
    description: settings.meta_description || 'MỘC AN — nội thất gỗ tối giản: sofa, bàn ghế, tủ kệ, đèn trang trí. Chất liệu gỗ tự nhiên, bảo hành 24 tháng, giao hàng & lắp đặt tận nơi toàn quốc.',
  })

  // Đọc state ban đầu từ URL (chỉ 1 lần khi mount) — khớp readStateFromURL() template gốc.
  useEffect(() => {
    const p = searchParams
    const cat = p.get('category')
    setCategory(cat && (cat === 'tat-ca' || categories.some(c => c.slug === cat)) ? cat : 'tat-ca')
    setMaterials(p.get('material') ? p.get('material')!.split(',').filter(s => MATERIALS.some(m => m.slug === s)) : [])
    setColors(p.get('color') ? p.get('color')!.split(',').filter(Boolean) : [])
    setRooms(p.get('room') ? p.get('room')!.split(',').filter(s => ROOMS.some(r => r.slug === s)) : [])
    const pm = p.get('price') ? Number(p.get('price')) : MAX_PRICE
    setPriceMax(pm > 0 ? pm : MAX_PRICE); setPriceInput(pm > 0 ? pm : MAX_PRICE)
    const q = (p.get('q') || '').slice(0, 100)
    setSearchInput(q); setSearch(q)
    setSort(p.get('sort') || 'newest')
    setPage(p.get('page') ? Math.max(1, Number(p.get('page'))) : 1)
    setCollection(p.get('collection') || null)
    setInitialized(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories.length])

  // Đồng bộ khi query `?q=` đổi từ BÊN NGOÀI (vd tìm kiếm từ ô nav Header khi đang đứng ở "/")
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
    if (category !== 'tat-ca') {
      const catId = categories.find(c => c.slug === category)?.id
      if (catId) apiParams.set('category_ids', String(catId))
    }
    if (materials.length) apiParams.set('material', materials.join(','))
    if (colors.length) apiParams.set('colors', colors.join(','))
    if (rooms.length) apiParams.set('room', rooms.join(','))
    if (priceMax < MAX_PRICE) apiParams.set('max_price', String(priceMax))
    if (search) apiParams.set('q', search)
    if (sort !== 'newest') apiParams.set('sort', sort)
    if (collection) apiParams.set('collection', collection)

    api.getPaged<Product[]>(`/public/products?${apiParams.toString()}`)
      .then(({ data, total }) => { setProducts(data); setTotal(total) })
      .catch(() => { setProducts([]); setTotal(0) })
      .finally(() => setLoading(false))

    const urlParams = new URLSearchParams()
    if (category !== 'tat-ca') urlParams.set('category', category)
    if (materials.length) urlParams.set('material', materials.join(','))
    if (colors.length) urlParams.set('color', colors.join(','))
    if (rooms.length) urlParams.set('room', rooms.join(','))
    if (priceMax < MAX_PRICE) urlParams.set('price', String(priceMax))
    if (search) urlParams.set('q', search)
    if (sort !== 'newest') urlParams.set('sort', sort)
    if (page > 1) urlParams.set('page', String(page))
    if (collection) urlParams.set('collection', collection)
    setSearchParams(urlParams, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, category, materials.join(','), colors.join(','), rooms.join(','), priceMax, search, sort, page, collection, categories])

  const changeCategory = (slug: string) => { setCategory(slug); setPage(1) }
  const toggleInList = (list: string[], value: string, setter: (v: string[]) => void) => {
    setter(list.includes(value) ? list.filter(x => x !== value) : [...list, value])
    setPage(1)
  }
  const changeSort = (v: string) => { setSort(v); setPage(1) }

  const clearAllFilters = () => {
    setCategory('tat-ca'); setMaterials([]); setColors([]); setRooms([])
    setPriceMax(MAX_PRICE); setPriceInput(MAX_PRICE)
    setSearchInput(''); setSearch(''); setSort('newest'); setPage(1); setCollection(null)
  }

  const handleQuickCat = (slug: string) => {
    setCategory(slug); setPage(1)
    toolbarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
  const startIdx = (page - 1) * PER_PAGE

  const catName = (slug: string) => categories.find(c => c.slug === slug)?.name || slug

  const chips: { key: string; label: string; onRemove: () => void }[] = []
  if (category !== 'tat-ca') chips.push({ key: 'category', label: catName(category), onRemove: () => changeCategory('tat-ca') })
  if (collection) chips.push({ key: 'collection', label: 'BST: ' + collection, onRemove: () => setCollection(null) })
  materials.forEach(m => chips.push({ key: `mat-${m}`, label: MATERIALS.find(x => x.slug === m)?.name || m, onRemove: () => toggleInList(materials, m, setMaterials) }))
  colors.forEach(c => chips.push({ key: `col-${c}`, label: c, onRemove: () => toggleInList(colors, c, setColors) }))
  rooms.forEach(r => chips.push({ key: `room-${r}`, label: ROOMS.find(x => x.slug === r)?.name || r, onRemove: () => toggleInList(rooms, r, setRooms) }))
  if (priceMax < MAX_PRICE) chips.push({ key: 'price', label: 'Giá ≤ ' + fmtVND(priceMax), onRemove: () => { setPriceMax(MAX_PRICE); setPriceInput(MAX_PRICE); setPage(1) } })
  if (search) chips.push({ key: 'search', label: `Tìm: "${search}"`, onRemove: () => { setSearchInput(''); setSearch(''); setPage(1) } })

  const filterBadgeCount = materials.length + colors.length + rooms.length + (priceMax < MAX_PRICE ? 1 : 0)

  const goToPage = (n: number) => {
    if (n < 1 || n > totalPages) return
    setPage(n)
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Đóng dropdown khi click ra ngoài — khớp hành vi document click listener của template gốc.
  const controlsRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!openDropdown) return
    const onDocClick = (e: MouseEvent) => {
      if (controlsRef.current && !controlsRef.current.contains(e.target as Node)) setOpenDropdown(null)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [openDropdown])

  const categoryPills = [{ slug: 'tat-ca', name: 'Tất cả' }, ...categories]

  return (
    <>
      <HeroSlider
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearchSubmit={() => { setSearch(searchInput); setPage(1) }}
        onQuickCat={handleQuickCat}
      />

      {/* ── FILTER TOOLBAR ── */}
      <div className="nt-toolbar-wrap" ref={toolbarRef}>
        <div className="nt-container">
          {/* Desktop: category pills */}
          <div className="nt-toolbar-pills d-none d-lg-flex" role="group" aria-label="Lọc theo danh mục">
            {categoryPills.map(c => (
              <button key={c.slug} className={'nt-pill nt-cat-pill' + (category === c.slug ? ' active' : '')} onClick={() => changeCategory(c.slug)}>{c.name}</button>
            ))}
          </div>

          {/* Desktop: dropdown controls */}
          <div className="nt-toolbar-controls d-none d-lg-flex" ref={controlsRef}>
            <div className="nt-dropdown">
              <button className={'nt-dropdown-btn' + (openDropdown === 'material' ? ' open' : '')} aria-expanded={openDropdown === 'material'} onClick={() => setOpenDropdown(o => o === 'material' ? null : 'material')}>
                Chất liệu {materials.length > 0 && <span className="nt-dd-badge">{materials.length}</span>}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}><path d="M6 9l6 6 6-6" /></svg>
              </button>
              <div className={'nt-dropdown-menu' + (openDropdown === 'material' ? ' show' : '')}>
                {MATERIALS.map(m => (
                  <label className="nt-dd-option" key={m.slug}>
                    <input type="checkbox" checked={materials.includes(m.slug)} onChange={() => toggleInList(materials, m.slug, setMaterials)} /> {m.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="nt-dropdown">
              <button className={'nt-dropdown-btn' + (openDropdown === 'color' ? ' open' : '')} aria-expanded={openDropdown === 'color'} onClick={() => setOpenDropdown(o => o === 'color' ? null : 'color')}>
                Màu sắc {colors.length > 0 && <span className="nt-dd-badge">{colors.length}</span>}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}><path d="M6 9l6 6 6-6" /></svg>
              </button>
              <div className={'nt-dropdown-menu' + (openDropdown === 'color' ? ' show' : '')}>
                {COLOR_SWATCHES.map(c => (
                  <label className="nt-dd-option" key={c.name}>
                    <input type="checkbox" checked={colors.includes(c.name)} onChange={() => toggleInList(colors, c.name, setColors)} /> {c.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="nt-dropdown">
              <button className={'nt-dropdown-btn' + (openDropdown === 'room' ? ' open' : '')} aria-expanded={openDropdown === 'room'} onClick={() => setOpenDropdown(o => o === 'room' ? null : 'room')}>
                Không gian {rooms.length > 0 && <span className="nt-dd-badge">{rooms.length}</span>}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}><path d="M6 9l6 6 6-6" /></svg>
              </button>
              <div className={'nt-dropdown-menu' + (openDropdown === 'room' ? ' show' : '')}>
                {ROOMS.map(r => (
                  <label className="nt-dd-option" key={r.slug}>
                    <input type="checkbox" checked={rooms.includes(r.slug)} onChange={() => toggleInList(rooms, r.slug, setRooms)} /> {r.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="nt-toolbar-divider"></div>

            <div className="nt-price-range" aria-label="Khoảng giá">
              <span>Giá tối đa:</span>
              <input type="range" min={200000} max={MAX_PRICE} step={200000} value={priceInput} onChange={e => setPriceInput(Number(e.target.value))} aria-label="Giá tối đa" />
              <span>{priceInput >= MAX_PRICE ? 'Tất cả' : fmtVND(priceInput)}</span>
            </div>

            <div className="nt-toolbar-divider"></div>

            <div className="nt-sort" aria-label="Sắp xếp">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 6h18M7 12h10M11 18h2" /></svg>
              <select aria-label="Sắp xếp theo" value={sort} onChange={e => changeSort(e.target.value)}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <div className="nt-result-count" aria-live="polite">
              {products.length ? `Hiển thị ${startIdx + 1}–${startIdx + products.length} trong ${total} sản phẩm` : '0 sản phẩm'}
            </div>
          </div>

          {/* Mobile row */}
          <div className="d-flex d-lg-none" style={{ overflowX: 'auto', gap: 8, paddingBottom: 4 }}>
            {categoryPills.map(c => (
              <button key={c.slug} className={'nt-pill nt-cat-pill' + (category === c.slug ? ' active' : '')} onClick={() => changeCategory(c.slug)}>{c.name}</button>
            ))}
          </div>
          <div className="nt-toolbar-mobile-row d-lg-none">
            <button className="nt-filter-mobile-btn" aria-label="Mở bộ lọc" aria-expanded={mobileFilterOpen} onClick={() => setMobileFilterOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></svg>
              Bộ lọc
              {filterBadgeCount > 0 && <span className="nt-filter-badge">{filterBadgeCount}</span>}
            </button>
            <select className="nt-sort-mobile" aria-label="Sắp xếp" value={sort} onChange={e => changeSort(e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Active chips */}
          {chips.length > 0 && (
            <div className="nt-chips-row" aria-live="polite">
              {chips.map(c => (
                <span className="nt-chip" key={c.key}>
                  {c.label}
                  <button aria-label={`Bỏ lọc ${c.label}`} onClick={c.onRemove}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </span>
              ))}
              <button className="nt-chip-clear" onClick={clearAllFilters}>Xóa tất cả</button>
            </div>
          )}
        </div>
      </div>

      {/* ── CATALOG ── */}
      <main className="nt-catalog">
        <div className="nt-container" ref={gridRef}>
          {!loading && products.length === 0 ? (
            <div className="nt-empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /><path d="M11 8v6M8 11h6" /></svg>
              <h3>Không tìm thấy sản phẩm nào</h3>
              <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm khác.</p>
              <button className="nt-btn-outline" onClick={clearAllFilters}>Xóa tất cả bộ lọc</button>
            </div>
          ) : (
            <div className="nt-prod-grid" aria-live="polite" aria-label="Danh sách sản phẩm">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {totalPages > 1 && (
            <ul className="nt-pagination" aria-label="Phân trang">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <li key={n} className={'page-item' + (n === page ? ' active' : '')}>
                  <button className="page-link" onClick={() => goToPage(n)}>{n}</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {/* ── Mobile Offcanvas Filter ── */}
      <div className={'nt-offcanvas' + (mobileFilterOpen ? ' show' : '')} role="dialog" aria-modal="true" aria-label="Bộ lọc sản phẩm">
        <div className="nt-offcanvas-backdrop" onClick={() => setMobileFilterOpen(false)}></div>
        <div className="nt-offcanvas-panel">
          <div className="nt-offcanvas-header">
            <span className="nt-offcanvas-title">Bộ lọc</span>
            <button className="nt-offcanvas-close" aria-label="Đóng bộ lọc" onClick={() => setMobileFilterOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="nt-filter-section">
            <div className="nt-filter-section-title">Chất liệu</div>
            {MATERIALS.map(m => (
              <label className="nt-dd-option" key={m.slug}>
                <input type="checkbox" checked={materials.includes(m.slug)} onChange={() => toggleInList(materials, m.slug, setMaterials)} /> {m.name}
              </label>
            ))}
          </div>

          <div className="nt-filter-section">
            <div className="nt-filter-section-title">Màu sắc</div>
            {COLOR_SWATCHES.map(c => (
              <label className="nt-dd-option" key={c.name}>
                <input type="checkbox" checked={colors.includes(c.name)} onChange={() => toggleInList(colors, c.name, setColors)} /> {c.name}
              </label>
            ))}
          </div>

          <div className="nt-filter-section">
            <div className="nt-filter-section-title">Không gian phù hợp</div>
            {ROOMS.map(r => (
              <label className="nt-dd-option" key={r.slug}>
                <input type="checkbox" checked={rooms.includes(r.slug)} onChange={() => toggleInList(rooms, r.slug, setRooms)} /> {r.name}
              </label>
            ))}
          </div>

          <div className="nt-filter-section">
            <div className="nt-filter-section-title">Khoảng giá</div>
            <input type="range" min={200000} max={MAX_PRICE} step={200000} value={priceInput} onChange={e => setPriceInput(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent)' }} aria-label="Giá tối đa" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-2)', marginTop: 6 }}>
              <span>200.000₫</span>
              <span>{priceInput >= MAX_PRICE ? 'Tất cả' : fmtVND(priceInput)}</span>
              <span>18.000.000₫</span>
            </div>
          </div>

          <div className="nt-offcanvas-footer">
            <button className="nt-btn-outline" style={{ flex: 1 }} onClick={clearAllFilters}>Xóa bộ lọc</button>
            <button className="nt-btn" style={{ flex: 1 }} onClick={() => setMobileFilterOpen(false)}>Xem kết quả</button>
          </div>
        </div>
      </div>

      {/* ── TRUST / FEATURE ROW ── */}
      <section className="nt-container">
        <div className="nt-feature-row" data-reveal>
          <div className="nt-feature-item">
            <span className="nt-feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 3v12a2 2 0 002 2h14" /><path d="M7 21h10M7 17l3-8 3 5 3-8" /></svg></span>
            <div><h4>Chất liệu chọn lọc</h4><p>Gỗ tự nhiên, gỗ công nghiệp phủ Melamine chống ẩm, kiểm định trước khi giao.</p></div>
          </div>
          <div className="nt-feature-item">
            <span className="nt-feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="1" y="6" width="15" height="12" rx="1" /><path d="M16 10h4l3 4v4h-7" /><circle cx="6" cy="19" r="2" /><circle cx="18" cy="19" r="2" /></svg></span>
            <div><h4>Giao hàng &amp; lắp đặt</h4><p>Miễn phí giao hàng nội thành đơn từ 5.000.000₫, lắp đặt tận nơi toàn quốc.</p></div>
          </div>
          <div className="nt-feature-item">
            <span className="nt-feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2l8 4v6c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-4z" /></svg></span>
            <div><h4>Bảo hành 24 tháng</h4><p>Bảo hành khung, bản lề, cơ chế vận hành — bảo trì tận nhà khi cần.</p></div>
          </div>
          <div className="nt-feature-item">
            <span className="nt-feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12a9 9 0 11-9-9M21 3v6h-6" /></svg></span>
            <div><h4>Đổi trả trong 15 ngày</h4><p>Không đúng ý — đổi trả miễn phí nếu sản phẩm còn nguyên trạng.</p></div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FaqSection />
    </>
  )
}

const FAQS = [
  { q: 'Thời gian giao hàng mất bao lâu?', a: 'Nội thành các thành phố lớn: 2–4 ngày làm việc. Khu vực tỉnh/thành khác: 5–8 ngày làm việc tùy sản phẩm và địa điểm. Đơn hàng lắp ráp sẵn (sofa, giường lớn) có thể cần thêm 1–2 ngày để đóng gói cẩn thận.' },
  { q: 'Sản phẩm có được lắp đặt tận nơi không?', a: 'Có. Với các sản phẩm cần lắp ráp như tủ, giường, bàn ăn lớn, đội kỹ thuật của MỘC AN sẽ lắp đặt và dọn dẹp bao bì tận nơi, hoàn toàn miễn phí trong nội thành.' },
  { q: 'Chính sách bảo hành áp dụng như thế nào?', a: 'Toàn bộ sản phẩm nội thất gỗ được bảo hành 24 tháng đối với lỗi khung, bản lề, cơ chế vận hành (ray trượt, bánh xe, khớp gấp...). Đèn trang trí và phụ kiện nhỏ bảo hành 6 tháng đối với lỗi kỹ thuật từ nhà sản xuất.' },
  { q: 'Tôi có thể đổi trả nếu không vừa ý?', a: 'Được đổi trả miễn phí trong vòng 15 ngày kể từ ngày nhận hàng nếu sản phẩm còn nguyên trạng, chưa qua sử dụng và còn đầy đủ bao bì. Phụ kiện trang trí giá trị nhỏ áp dụng đổi trả trong 7 ngày.' },
  { q: 'Có hỗ trợ thanh toán trả góp không?', a: 'Có. MỘC AN hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng của các ngân hàng liên kết cho đơn hàng từ 3.000.000₫, kỳ hạn 3–6 tháng. Liên hệ tư vấn viên để biết chi tiết ngân hàng hỗ trợ.' },
  { q: 'Đồ gỗ tự nhiên có bị cong vênh theo thời gian?', a: 'Gỗ tự nhiên tại MỘC AN được xử lý sấy tẩm và tẩm sấy đạt độ ẩm tiêu chuẩn (8–12%) trước khi gia công, hạn chế tối đa cong vênh, mối mọt trong điều kiện khí hậu Việt Nam khi được đặt ở nơi khô ráo, tránh ánh nắng trực tiếp kéo dài.' },
  { q: 'Làm sao để đo đạc không gian trước khi đặt mua nội thất lớn?', a: 'Mỗi sản phẩm đều có bảng kích thước chi tiết tại trang chi tiết sản phẩm. Với đơn hàng từ 10.000.000₫ trở lên (sofa góc, tủ quần áo lớn...), MỘC AN hỗ trợ tư vấn đo đạc tận nhà miễn phí tại khu vực nội thành.' },
]

function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  return (
    <section className="nt-sec">
      <div className="nt-container">
        <div className="nt-sec-head center" data-reveal>
          <div className="nt-eyebrow" style={{ justifyContent: 'center' }}>Hỏi đáp</div>
          <h2 className="nt-sec-title">Câu hỏi <em>thường gặp</em></h2>
          <p className="nt-sec-sub">Những thắc mắc phổ biến nhất về sản phẩm, vận chuyển và bảo hành tại MỘC AN.</p>
        </div>
        <div className="nt-faq" data-reveal>
          {FAQS.map((item, i) => (
            <div className={'nt-faq-item' + (openIdx === i ? ' open' : '')} key={i}>
              <button className="nt-faq-q" onClick={() => setOpenIdx(o => o === i ? null : i)}>
                {item.q}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M12 5v14M5 12h14" /></svg>
              </button>
              <div className="nt-faq-a"><div className="nt-faq-a-inner">{item.a}</div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
