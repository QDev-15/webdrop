import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import { useCart } from '../contexts/CartContext'
import { useSite, type Product } from '../contexts/SiteContext'

// Catalog toolbar filter (Mode A) — khớp NGUYÊN VĂN UI thật của index.html gốc: category pills (đơn
// chọn, exclusive) + 3 dropdown checkbox (Loại thú cưng/Kích cỡ/Thương hiệu) + price-range max + sort —
// KHÔNG phải sidebar 5-block generic. Toàn bộ filter/sort đều "áp dụng tức thì" (không có nút Apply),
// đúng hành vi gốc trong assets/js/main.js (inline script) của index.html.

const PER_PAGE = 12
const MAX_PRICE = 1500000

const PET_TYPE_OPTIONS = [
  { value: 'cho', label: 'Chó' },
  { value: 'meo', label: 'Mèo' },
  { value: 'ca-hai', label: 'Cả chó & mèo' },
]
const SIZE_OPTIONS = ['S', 'M', 'L']
const BRANDS = ['PawFresh', 'PetKing', 'MeowMart', "Buddy's Choice", 'VetCare Pro', 'FurNest', 'PurePaw', 'Happy Tail']

function formatVND(n: number) { return n.toLocaleString('vi-VN') + '₫' }
const csv = (arr: string[]) => arr.join(',')
const parseCsv = (s: string | null) => (s ? s.split(',').filter(Boolean) : [])

function ProductCard({ p, catLabel, petLabel, onQuickAdd }: { p: Product; catLabel: string; petLabel: string; onQuickAdd: (p: Product) => void }) {
  const price = p.price_sale ? p.price_sale : p.price
  const badgeLabel: Record<string, string> = { sale: 'Sale', new: 'Mới', hot: 'Hot' }
  return (
    <div className="tc-prod-card" data-reveal>
      <Link to={`/san-pham/${p.slug}`} className="tc-prod-img-wrap">
        <img src={p.image} alt={p.name} loading="lazy" />
        {p.badge && <span className={`tc-badge tc-badge-${p.badge}`}>{badgeLabel[p.badge] ?? p.badge}</span>}
      </Link>
      <div className="tc-prod-body">
        <div className="tc-prod-cat">{catLabel} · {petLabel}</div>
        <h3 className="tc-prod-name"><Link to={`/san-pham/${p.slug}`}>{p.name}</Link></h3>
        <div className="tc-prod-rating">
          <span className="tc-stars">{'★'.repeat(Math.round(p.rating))}</span><span>{p.rating}</span><span>({p.sold} đã bán)</span>
        </div>
        <div className="tc-prod-price">
          <span className={'tc-price' + (p.price_sale ? ' sale' : '')}>{formatVND(price)}</span>
          {p.price_sale ? <span className="tc-price-orig">{formatVND(p.price)}</span> : null}
        </div>
        <div className="tc-prod-actions">
          <button className="tc-btn-cart" onClick={() => onQuickAdd(p)}>Thêm vào giỏ</button>
          <Link to={`/san-pham/${p.slug}`} className="tc-btn-detail">Chi tiết</Link>
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const { categories } = useSite()
  const { addItem } = useCart()
  const [searchParams, setSearchParams] = useSearchParams()

  const [category, setCategory] = useState<string>(searchParams.get('category') || '')
  const [priceMax, setPriceMax] = useState<number>(() => {
    const p = searchParams.get('priceMax')
    return p ? Math.min(Number(p), MAX_PRICE) : MAX_PRICE
  })
  const [petType, setPetType] = useState<string[]>(() => parseCsv(searchParams.get('petType')))
  const [size, setSize] = useState<string[]>(() => parseCsv(searchParams.get('size')))
  const [brand, setBrand] = useState<string[]>(() => parseCsv(searchParams.get('brand')))
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest')
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1)

  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [openDropdown, setOpenDropdown] = useState<'price' | 'pet' | 'size' | 'brand' | null>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  const CAT_LABELS: Record<string, string> = useMemo(() => {
    const m: Record<string, string> = {}
    categories.forEach(c => { m[c.slug] = c.name })
    return m
  }, [categories])
  const PET_LABELS: Record<string, string> = { cho: 'Chó', meo: 'Mèo', 'ca-hai': 'Chó & Mèo' }

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) setOpenDropdown(null)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  // Fetch mỗi khi filter/sort/page đổi + đồng bộ URL
  useEffect(() => {
    setLoading(true)
    const catId = categories.find(c => c.slug === category)?.id
    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('per_page', String(PER_PAGE))
    if (catId) params.set('category_ids', String(catId))
    if (petType.length) params.set('pet_type', petType.join(','))
    if (size.length) params.set('size', size.join(','))
    if (brand.length) params.set('brand', brand.join(','))
    if (priceMax < MAX_PRICE) params.set('max_price', String(priceMax))
    if (search) params.set('q', search)
    if (sort !== 'newest') params.set('sort', sort)

    api.getPaged<Product[]>(`/public/products?${params.toString()}`)
      .then(({ data, total }) => { setProducts(data); setTotal(total) })
      .catch(() => {})
      .finally(() => setLoading(false))

    const qs = new URLSearchParams()
    if (category) qs.set('category', category)
    if (petType.length) qs.set('petType', csv(petType))
    if (size.length) qs.set('size', csv(size))
    if (brand.length) qs.set('brand', csv(brand))
    if (search) qs.set('q', search)
    if (sort !== 'newest') qs.set('sort', sort)
    if (priceMax < MAX_PRICE) qs.set('priceMax', String(priceMax))
    if (page > 1) qs.set('page', String(page))
    setSearchParams(qs, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, petType, size, brand, priceMax, search, sort, page, categories])

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))

  const toggleCategory = (slug: string) => {
    setCategory(c => c === slug ? '' : slug)
    setPage(1)
  }
  const toggleFilter = (setter: React.Dispatch<React.SetStateAction<string[]>>, v: string) => {
    setter(arr => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v])
    setPage(1)
  }
  const clearAll = () => {
    setCategory(''); setPriceMax(MAX_PRICE); setPetType([]); setSize([]); setBrand([]); setSearch(''); setSort('newest'); setPage(1)
  }

  const chips = useMemo(() => {
    const list: { label: string; onRemove: () => void }[] = []
    if (category) list.push({ label: CAT_LABELS[category] ?? category, onRemove: () => setCategory('') })
    petType.forEach(v => list.push({ label: PET_LABELS[v] ?? v, onRemove: () => toggleFilter(setPetType, v) }))
    size.forEach(v => list.push({ label: `Size: ${v}`, onRemove: () => toggleFilter(setSize, v) }))
    brand.forEach(v => list.push({ label: v, onRemove: () => toggleFilter(setBrand, v) }))
    if (priceMax < MAX_PRICE) list.push({ label: `Đến ${formatVND(priceMax)}`, onRemove: () => setPriceMax(MAX_PRICE) })
    if (search) list.push({ label: `"${search}"`, onRemove: () => setSearch('') })
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, petType, size, brand, priceMax, search, CAT_LABELS])

  const activeFilterCount = (category ? 1 : 0) + petType.length + size.length + brand.length + (priceMax < MAX_PRICE ? 1 : 0)
  const startIdx = total === 0 ? 0 : (page - 1) * PER_PAGE
  const resultText = total === 0 ? '0 sản phẩm' : `Hiển thị ${startIdx + 1}–${Math.min(startIdx + PER_PAGE, total)} trong ${total} sản phẩm`

  const CatPills = () => (
    <div className="tc-cat-pills">
      <button className={'tc-cat-pill' + (category === '' ? ' active' : '')} onClick={() => toggleCategory('')}>Tất cả</button>
      {categories.map(c => (
        <button key={c.slug} className={'tc-cat-pill' + (category === c.slug ? ' active' : '')} onClick={() => toggleCategory(c.slug)}>{c.name}</button>
      ))}
    </div>
  )

  return (
    <>
      <div className="tc-filter-wrap" id="tcFilterWrap" ref={toolbarRef}>
        <div className="tc-container">
          <div className="tc-filter-row1 d-none d-lg-flex">
            <CatPills />
            <div className="tc-filter-sep"></div>

            <div className={'dropdown tc-dropdown' + (openDropdown === 'price' ? ' show' : '')}>
              <button type="button" className={'tc-drop-btn' + (priceMax < MAX_PRICE ? ' has-filter' : '')} onClick={() => setOpenDropdown(o => o === 'price' ? null : 'price')}>Khoảng giá</button>
              <div className={'dropdown-menu tc-drop-menu' + (openDropdown === 'price' ? ' show' : '')} style={{ width: 230 }}>
                <div className="tc-price-labels"><span>0₫</span><span>{formatVND(priceMax)}</span></div>
                <input type="range" className="tc-range" min={0} max={MAX_PRICE} step={10000} value={priceMax} onChange={e => { setPriceMax(Number(e.target.value)); setPage(1) }} />
              </div>
            </div>

            <div className={'dropdown tc-dropdown' + (openDropdown === 'pet' ? ' show' : '')}>
              <button type="button" className={'tc-drop-btn' + (petType.length ? ' has-filter' : '')} onClick={() => setOpenDropdown(o => o === 'pet' ? null : 'pet')}>Loại thú cưng</button>
              <div className={'dropdown-menu tc-drop-menu' + (openDropdown === 'pet' ? ' show' : '')}>
                {PET_TYPE_OPTIONS.map(o => (
                  <label className="form-check" key={o.value}><input type="checkbox" className="form-check-input" checked={petType.includes(o.value)} onChange={() => toggleFilter(setPetType, o.value)} /><span className="form-check-label">{o.label}</span></label>
                ))}
              </div>
            </div>

            <div className={'dropdown tc-dropdown' + (openDropdown === 'size' ? ' show' : '')}>
              <button type="button" className={'tc-drop-btn' + (size.length ? ' has-filter' : '')} onClick={() => setOpenDropdown(o => o === 'size' ? null : 'size')}>Kích cỡ</button>
              <div className={'dropdown-menu tc-drop-menu' + (openDropdown === 'size' ? ' show' : '')}>
                {SIZE_OPTIONS.map(s => (
                  <label className="form-check" key={s}><input type="checkbox" className="form-check-input" checked={size.includes(s)} onChange={() => toggleFilter(setSize, s)} /><span className="form-check-label">{s}</span></label>
                ))}
              </div>
            </div>

            <div className={'dropdown tc-dropdown' + (openDropdown === 'brand' ? ' show' : '')}>
              <button type="button" className={'tc-drop-btn' + (brand.length ? ' has-filter' : '')} onClick={() => setOpenDropdown(o => o === 'brand' ? null : 'brand')}>Thương hiệu</button>
              <div className={'dropdown-menu tc-drop-menu' + (openDropdown === 'brand' ? ' show' : '')}>
                {BRANDS.map(b => (
                  <label className="form-check" key={b}><input type="checkbox" className="form-check-input" checked={brand.includes(b)} onChange={() => toggleFilter(setBrand, b)} /><span className="form-check-label">{b}</span></label>
                ))}
              </div>
            </div>

            <div className={'dropdown tc-dropdown'}>
              <select className="tc-sort-select" value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}>
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="bestseller">Bán chạy</option>
                <option value="rating">Đánh giá cao</option>
              </select>
            </div>
          </div>

          <div className="tc-filter-row2">
            <div className="tc-chips-row">
              {chips.map((c, i) => (
                <span className="tc-chip" key={i}>{c.label}<button className="tc-chip-close" aria-label={`Xóa ${c.label}`} onClick={c.onRemove}>×</button></span>
              ))}
              {chips.length > 0 && <button className="tc-chip-clear" onClick={clearAll}>Xóa tất cả</button>}
            </div>
            <div className="tc-result-count" aria-live="polite">{resultText}</div>
          </div>

          <div className="tc-filter-mobile d-lg-none">
            <button className="tc-btn-filter" data-bs-toggle="offcanvas" data-bs-target="#tcFilterOffcanvas">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width="16"><line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" /></svg>
              Bộ lọc
              {activeFilterCount > 0 && <span className="tc-filter-badge">{activeFilterCount}</span>}
            </button>
            <div style={{ marginLeft: 'auto' }}>
              <select className="tc-sort-select" value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}>
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá tăng</option>
                <option value="price-desc">Giá giảm</option>
                <option value="bestseller">Bán chạy</option>
                <option value="rating">Đánh giá</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="offcanvas offcanvas-start tc-offcanvas" tabIndex={-1} id="tcFilterOffcanvas">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Bộ lọc sản phẩm</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Đóng"></button>
        </div>
        <div className="offcanvas-body">
          <div className="tc-oc-section">
            <div className="tc-oc-section-title">Danh mục</div>
            <div className="tc-cat-pills" style={{ flexWrap: 'wrap' }}>
              <button className={'tc-cat-pill' + (category === '' ? ' active' : '')} onClick={() => toggleCategory('')}>Tất cả</button>
              {categories.map(c => (
                <button key={c.slug} className={'tc-cat-pill' + (category === c.slug ? ' active' : '')} onClick={() => toggleCategory(c.slug)}>{c.name}</button>
              ))}
            </div>
          </div>
          <div className="tc-oc-section">
            <div className="tc-oc-section-title">Khoảng giá</div>
            <div className="tc-price-labels"><span>0₫</span><span>{formatVND(priceMax)}</span></div>
            <input type="range" className="tc-range" min={0} max={MAX_PRICE} step={10000} value={priceMax} onChange={e => { setPriceMax(Number(e.target.value)); setPage(1) }} />
          </div>
          <div className="tc-oc-section">
            <div className="tc-oc-section-title">Loại thú cưng</div>
            {PET_TYPE_OPTIONS.map(o => (
              <label className="form-check" key={o.value}><input type="checkbox" className="form-check-input" checked={petType.includes(o.value)} onChange={() => toggleFilter(setPetType, o.value)} /><span className="form-check-label">{o.label}</span></label>
            ))}
          </div>
          <div className="tc-oc-section">
            <div className="tc-oc-section-title">Kích cỡ</div>
            <div style={{ display: 'flex', gap: 16 }}>
              {SIZE_OPTIONS.map(s => (
                <label className="form-check" key={s}><input type="checkbox" className="form-check-input" checked={size.includes(s)} onChange={() => toggleFilter(setSize, s)} /><span className="form-check-label">{s}</span></label>
              ))}
            </div>
          </div>
          <div className="tc-oc-section">
            <div className="tc-oc-section-title">Thương hiệu</div>
            {BRANDS.map(b => (
              <label className="form-check" key={b}><input type="checkbox" className="form-check-input" checked={brand.includes(b)} onChange={() => toggleFilter(setBrand, b)} /><span className="form-check-label">{b}</span></label>
            ))}
          </div>
          <div className="tc-oc-section">
            <div className="tc-oc-section-title">Sắp xếp</div>
            <select className="tc-sort-select" style={{ width: '100%' }} value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}>
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="bestseller">Bán chạy</option>
              <option value="rating">Đánh giá cao</option>
            </select>
          </div>
        </div>
      </div>

      <div className="tc-catalog-section">
        <div className="tc-container">
          {loading ? (
            <div className="tc-product-grid">
              {Array.from({ length: PER_PAGE }).map((_, i) => <div key={i} className="tc-prod-card" style={{ minHeight: 320, opacity: .5 }} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="tc-empty-state visible">
              <div className="tc-empty-icon">🐾</div>
              <h3>Không tìm thấy sản phẩm phù hợp</h3>
              <p>Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm khác</p>
              <button className="tc-btn-reset" onClick={clearAll}>Xóa tất cả bộ lọc</button>
            </div>
          ) : (
            <div className="tc-product-grid">
              {products.map(p => (
                <ProductCard
                  key={p.id}
                  p={p}
                  catLabel={p.category_name || CAT_LABELS[p.category_slug] || ''}
                  petLabel={PET_LABELS[p.pet_type] ?? p.pet_type}
                  onQuickAdd={pp => addItem({ product_id: pp.id, name: pp.name, slug: pp.slug, image: pp.image, price: pp.price_sale ?? pp.price })}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav aria-label="Phân trang sản phẩm">
              <ul className="tc-pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <li className={'page-item' + (n === page ? ' active' : '')} key={n}>
                    <button className="page-link" onClick={() => { setPage(n); document.getElementById('tcFilterWrap')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>{n}</button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </>
  )
}
