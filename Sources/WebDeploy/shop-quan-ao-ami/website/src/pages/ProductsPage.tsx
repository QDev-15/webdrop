import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import { useSite, type Product } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { fmtPrice } from '../lib/format'
import ProductCard from '../components/ProductCard'

// Trang Sản phẩm dùng FILTER TOOLBAR NGANG (không phải sidebar dọc 5-block chuẩn rule 22) —
// bám đúng cấu trúc thật của san-pham.html template gốc (category pill + size/color dropdown
// checkbox + price range slider + sort select, tất cả áp dụng tức thì không nút Apply).
// Cùng ngoại lệ đã áp dụng ở shop-tui-sach/shop-may-tinh/shop-ami-mobile.
const MAX_PRICE = 1300000
const PER_PAGE = 12

const CATEGORY_PILLS = [
  { slug: '', label: 'Tất cả' },
  { slug: 'ao-thun', label: 'Áo Thun' },
  { slug: 'ao-so-mi', label: 'Áo Sơ Mi' },
  { slug: 'quan-jean', label: 'Quần Jean' },
  { slug: 'vay-dam', label: 'Váy & Đầm' },
  { slug: 'ao-khoac', label: 'Áo Khoác' },
]
const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL']
const COLOR_OPTIONS = [
  { name: 'Trắng' }, { name: 'Đen' }, { name: 'Be' }, { name: 'Xám' },
  { name: 'Xanh Navy' }, { name: 'Hồng' }, { name: 'Vàng Kem' },
]
const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price-asc', label: 'Giá: Thấp → Cao' },
  { value: 'price-desc', label: 'Giá: Cao → Thấp' },
  { value: 'bestseller', label: 'Bán chạy nhất' },
  { value: 'rating', label: 'Đánh giá cao' },
]

export default function ProductsPage() {
  const { settings, categories } = useSite()
  const [searchParams, setSearchParams] = useSearchParams()

  const [initialized, setInitialized] = useState(false)
  // category giữ dạng mảng (khớp state.category của template gốc) — pill click luôn thay thế
  // toàn bộ lựa chọn ([v] duy nhất), nhưng URL đến từ nơi khác (Trang chủ/Bộ sưu tập) có thể
  // truyền nhiều category cùng lúc (vd ?category=ao-thun,ao-so-mi) nên vẫn phải đọc được mảng.
  const [category, setCategoryState] = useState<string[]>([])
  const [sizes, setSizes] = useState<string[]>([])
  const [colors, setColors] = useState<string[]>([])
  const [priceMax, setPriceMax] = useState(MAX_PRICE)
  const [priceInput, setPriceInput] = useState(MAX_PRICE)
  const [theme, setTheme] = useState<string[]>([])
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)

  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState<'' | 'price' | 'size' | 'color'>('')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  useDocumentMeta({
    title: `Sản phẩm — ${settings.site_name || 'AMI Fashion'}`,
    description: `Khám phá toàn bộ bộ sưu tập quần áo ${settings.site_name || 'AMI Fashion'}. Lọc theo danh mục, khoảng giá, size và màu sắc.`,
  })

  useEffect(() => {
    const p = searchParams
    setCategoryState(p.get('category') ? p.get('category')!.split(',').filter(Boolean) : [])
    setSizes(p.get('size') ? p.get('size')!.split(',').filter(Boolean) : [])
    setColors(p.get('color') ? p.get('color')!.split(',').filter(Boolean) : [])
    const pm = p.get('price') ? Number(p.get('price')) : MAX_PRICE
    setPriceMax(pm); setPriceInput(pm)
    setTheme(p.get('theme') ? p.get('theme')!.split(',').filter(Boolean) : [])
    const q = p.get('q') || ''
    setSearchInput(q); setSearch(q)
    setSort(p.get('sort') || 'newest')
    setPage(p.get('page') ? Math.max(1, Number(p.get('page'))) : 1)
    setInitialized(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!initialized) return
    const t = setTimeout(() => { setSearch(searchInput); setPage(1) }, 400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

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
    if (category.length) {
      const ids = category.map(slug => categories.find(c => c.slug === slug)?.id).filter((v): v is number => Boolean(v))
      if (ids.length) apiParams.set('category_ids', ids.join(','))
    }
    if (sizes.length) apiParams.set('sizes', sizes.join(','))
    if (colors.length) apiParams.set('colors', colors.join(','))
    if (priceMax < MAX_PRICE) apiParams.set('max_price', String(priceMax))
    if (theme.length) apiParams.set('theme', theme.join(','))
    if (search) apiParams.set('q', search)
    if (sort !== 'newest') apiParams.set('sort', sort)

    api.getPaged<Product[]>(`/public/products?${apiParams.toString()}`)
      .then(({ data, total }) => { setProducts(data); setTotal(total) })
      .catch(() => { setProducts([]); setTotal(0) })
      .finally(() => setLoading(false))

    const urlParams = new URLSearchParams()
    if (category.length) urlParams.set('category', category.join(','))
    if (sizes.length) urlParams.set('size', sizes.join(','))
    if (colors.length) urlParams.set('color', colors.join(','))
    if (priceMax < MAX_PRICE) urlParams.set('price', String(priceMax))
    if (theme.length) urlParams.set('theme', theme.join(','))
    if (search) urlParams.set('q', search)
    if (sort !== 'newest') urlParams.set('sort', sort)
    if (page > 1) urlParams.set('page', String(page))
    setSearchParams(urlParams, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, category.join(','), sizes.join(','), colors.join(','), priceMax, theme.join(','), search, sort, page, categories])

  // Khớp đúng hành vi pill trong template gốc: click "Tất cả" → xóa lọc; click 1 danh mục đang
  // được chọn → bỏ chọn (về "Tất cả"); click danh mục khác → thay thế toàn bộ lựa chọn.
  const setCategory = (slug: string) => {
    setCategoryState(prev => {
      if (slug === '') return []
      return prev.includes(slug) ? prev.filter(x => x !== slug) : [slug]
    })
    setPage(1)
  }
  const toggleSize = (s: string) => { setSizes(v => v.includes(s) ? v.filter(x => x !== s) : [...v, s]); setPage(1) }
  const toggleColor = (c: string) => { setColors(v => v.includes(c) ? v.filter(x => x !== c) : [...v, c]); setPage(1) }
  const changeSort = (v: string) => { setSort(v); setPage(1) }

  const clearAll = () => {
    setCategoryState([]); setSizes([]); setColors([])
    setPriceMax(MAX_PRICE); setPriceInput(MAX_PRICE)
    setTheme([]); setSearchInput(''); setSearch(''); setSort('newest'); setPage(1)
  }

  const themeLabels: Record<string, string> = { 'ban-chay': 'Bán chạy', 'hang-moi': 'Hàng mới', 'giam-gia': 'Giảm giá' }
  const catLabelOf = (slug: string) => CATEGORY_PILLS.find(c => c.slug === slug)?.label || slug

  const activeCount = category.length + sizes.length + colors.length + (priceMax < MAX_PRICE ? 1 : 0) + (search ? 1 : 0)
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
  const startIdx = (page - 1) * PER_PAGE

  const chips: { key: string; label: string; onRemove: () => void }[] = []
  category.forEach(c => chips.push({ key: `cat-${c}`, label: catLabelOf(c), onRemove: () => setCategoryState(v => v.filter(x => x !== c)) }))
  sizes.forEach(s => chips.push({ key: `size-${s}`, label: `Size ${s}`, onRemove: () => toggleSize(s) }))
  colors.forEach(c => chips.push({ key: `color-${c}`, label: c, onRemove: () => toggleColor(c) }))
  if (priceMax < MAX_PRICE) chips.push({ key: 'price', label: `≤ ${fmtPrice(priceMax)}`, onRemove: () => { setPriceMax(MAX_PRICE); setPriceInput(MAX_PRICE) } })
  if (search) chips.push({ key: 'search', label: `"${search}"`, onRemove: () => { setSearchInput(''); setSearch('') } })
  theme.forEach(t => chips.push({ key: `theme-${t}`, label: themeLabels[t] || t, onRemove: () => setTheme(v => v.filter(x => x !== t)) }))

  const goToPage = (n: number) => {
    setPage(n)
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const resultText = total === 0 ? '0 sản phẩm' : `Hiển thị ${startIdx + 1}–${startIdx + products.length} trong ${total} sản phẩm`

  return (
    <main className="am-page-body">
      <div className="am-page-hero">
        <div className="am-container">
          <h1>Tất cả sản phẩm</h1>
          <p>Khám phá bộ sưu tập thời trang tối giản từ AMI</p>
        </div>
      </div>

      <div className="am-container">
        <div className="am-filter-wrap" role="search" aria-label="Bộ lọc sản phẩm">
          <div className="am-cat-pills" role="group" aria-label="Lọc theo danh mục">
            {CATEGORY_PILLS.map(c => (
              <button
                key={c.slug || 'all'}
                className={'am-cat-pill' + ((c.slug === '' ? category.length === 0 : category.includes(c.slug)) ? ' active' : '')}
                type="button"
                onClick={() => setCategory(c.slug)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="am-filter-bar d-none d-lg-flex" aria-label="Bộ lọc nâng cao">
            <div className="dropdown">
              <button className="am-filter-btn dropdown-toggle" type="button" onClick={() => setDropdownOpen(o => o === 'price' ? '' : 'price')}>
                Khoảng giá
              </button>
              <div className={'dropdown-menu am-dropdown-menu' + (dropdownOpen === 'price' ? ' show' : '')} style={{ minWidth: 240 }}>
                <div className="am-price-slider-wrap">
                  <label htmlFor="priceRange">Tối đa</label>
                  <input type="range" id="priceRange" min={0} max={MAX_PRICE} step={50000} value={priceInput} onChange={e => setPriceInput(Number(e.target.value))} />
                  <div className="am-price-display">
                    <span>0₫</span>
                    <span>{fmtPrice(priceInput)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="dropdown">
              <button className="am-filter-btn dropdown-toggle" type="button" onClick={() => setDropdownOpen(o => o === 'size' ? '' : 'size')}>
                Size
              </button>
              <div className={'dropdown-menu am-dropdown-menu' + (dropdownOpen === 'size' ? ' show' : '')}>
                {SIZE_OPTIONS.map(s => (
                  <label className="am-check-item" key={s}>
                    <input type="checkbox" checked={sizes.includes(s)} onChange={() => toggleSize(s)} /> {s}
                  </label>
                ))}
              </div>
            </div>

            <div className="dropdown">
              <button className="am-filter-btn dropdown-toggle" type="button" onClick={() => setDropdownOpen(o => o === 'color' ? '' : 'color')}>
                Màu sắc
              </button>
              <div className={'dropdown-menu am-dropdown-menu' + (dropdownOpen === 'color' ? ' show' : '')}>
                {COLOR_OPTIONS.map(c => (
                  <label className="am-check-item" key={c.name}>
                    <input type="checkbox" checked={colors.includes(c.name)} onChange={() => toggleColor(c.name)} /> {c.name}
                  </label>
                ))}
              </div>
            </div>

            <select className="am-sort-select" aria-label="Sắp xếp" value={sort} onChange={e => changeSort(e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            <span className="am-result-count" aria-live="polite" aria-atomic="true">{resultText}</span>
          </div>

          <div className="d-flex d-lg-none align-items-center gap-3 pb-3 flex-wrap">
            <button className="am-filter-mobile-btn" type="button" onClick={() => setMobileFilterOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 6h18M7 12h10M11 18h2" /></svg>
              Bộ lọc
              <span className={'am-filter-badge' + (activeCount > 0 ? ' show' : '')}>{activeCount}</span>
            </button>
            <select className="am-sort-select" aria-label="Sắp xếp" value={sort} onChange={e => changeSort(e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <span className="am-result-count" aria-live="polite">{resultText}</span>
          </div>

          {chips.length > 0 && (
            <div className="am-chips-row" aria-label="Bộ lọc đang áp dụng">
              {chips.map(c => (
                <button key={c.key} className="am-chip" type="button" onClick={c.onRemove}>
                  <span>{c.label}</span><span className="am-chip-x">×</span>
                </button>
              ))}
              <button className="am-clear-all" type="button" onClick={clearAll}>Xóa tất cả</button>
            </div>
          )}
        </div>

        <div className="am-prod-grid am-prod-grid-4" role="list" aria-label="Danh sách sản phẩm" ref={gridRef}>
          {!loading && products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>

        {!loading && products.length === 0 && (
          <div className="am-empty-state show" role="status">
            <p>Không tìm thấy sản phẩm phù hợp.</p>
            <button type="button" onClick={clearAll}>Xóa tất cả bộ lọc</button>
          </div>
        )}

        {totalPages > 1 && (
          <nav className="am-pagination" aria-label="Phân trang">
            <ul className="pagination mb-0">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <li key={n} className={'page-item' + (n === page ? ' active' : '')}>
                  <button className="page-link" type="button" onClick={() => goToPage(n)}>{n}</button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      {/* Mobile filter drawer — React-controlled, không phụ thuộc Bootstrap JS bundle (site
          chỉ load Bootstrap CSS qua CDN, không có bootstrap.bundle.min.js) */}
      <div
        className={'offcanvas offcanvas-start' + (mobileFilterOpen ? ' show' : '')}
        style={{ visibility: mobileFilterOpen ? 'visible' : 'hidden' }}
        tabIndex={-1}
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title" style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 300 }}>Bộ lọc</h5>
          <button type="button" className="btn-close" aria-label="Đóng" onClick={() => setMobileFilterOpen(false)}></button>
        </div>
        <div className="offcanvas-body">
          <div className="mb-4">
            <p className="am-option-label">Danh mục</p>
            <div className="am-cat-pills flex-column d-flex gap-2" role="group" aria-label="Danh mục mobile">
              {CATEGORY_PILLS.map(c => (
                <button
                  key={c.slug || 'all'}
                  className={'am-cat-pill' + ((c.slug === '' ? category.length === 0 : category.includes(c.slug)) ? ' active' : '')}
                  type="button"
                  onClick={() => setCategory(c.slug)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="am-option-label">Khoảng giá</p>
            <input type="range" min={0} max={MAX_PRICE} step={50000} value={priceInput} onChange={e => setPriceInput(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent)' }} />
            <div className="am-price-display mt-2">
              <span>0₫</span>
              <span>{fmtPrice(priceInput)}</span>
            </div>
          </div>

          <div className="mb-4">
            <p className="am-option-label">Size</p>
            {SIZE_OPTIONS.map(s => (
              <label className="am-check-item" key={s}>
                <input type="checkbox" checked={sizes.includes(s)} onChange={() => toggleSize(s)} /> {s}
              </label>
            ))}
          </div>

          <div className="mb-4">
            <p className="am-option-label">Màu sắc</p>
            {COLOR_OPTIONS.map(c => (
              <label className="am-check-item" key={c.name}>
                <input type="checkbox" checked={colors.includes(c.name)} onChange={() => toggleColor(c.name)} /> {c.name}
              </label>
            ))}
          </div>

          <button type="button" className="am-btn-primary" onClick={() => setMobileFilterOpen(false)}>Xem kết quả</button>
        </div>
      </div>
      {mobileFilterOpen && <div className="offcanvas-backdrop fade show" onClick={() => setMobileFilterOpen(false)}></div>}
    </main>
  )
}
