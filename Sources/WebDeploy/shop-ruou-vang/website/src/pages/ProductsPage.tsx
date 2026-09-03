import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import { useCart } from '../contexts/CartContext'
import type { Product } from '../contexts/SiteContext'

// Catalog toolbar filter (Mode A) — khớp NGUYÊN VĂN UI thật của index.html gốc: category pills +
// 3 dropdown checkbox (Xuất xứ/Nồng độ cồn/Dịp dùng) + price-range max + sort — KHÔNG phải sidebar
// 5-block generic. Toàn bộ filter/sort đều "áp dụng tức thì" (không có nút Apply), đúng hành vi gốc.

const PER_PAGE = 12
const MAX_PRICE = 3200000

const CATEGORY_LABEL: Record<string, string> = {
  'vang-do': 'Vang đỏ', 'vang-trang': 'Vang trắng', 'vang-sui': 'Vang sủi', 'vang-hong': 'Vang hồng', 'qua-tang-set': 'Set quà tặng',
}
const ORIGIN_OPTIONS = [
  { value: 'phap', label: 'Pháp' }, { value: 'y', label: 'Ý' }, { value: 'chile', label: 'Chile' },
  { value: 'tay-ban-nha', label: 'Tây Ban Nha' }, { value: 'argentina', label: 'Argentina' },
  { value: 'uc', label: 'Úc' }, { value: 'my', label: 'Mỹ' }, { value: 'duc', label: 'Đức' }, { value: 'nam-phi', label: 'Nam Phi' },
]
const ABV_OPTIONS = [
  { value: 'duoi-12', label: 'Dưới 12%' }, { value: '12-13', label: '12% – 13%' },
  { value: '13-14', label: '13% – 14%' }, { value: 'tren-14', label: 'Trên 14%' },
]
const OCCASION_OPTIONS = [
  { value: 'qua-tang', label: 'Quà tặng' }, { value: 'tiec-tung', label: 'Tiệc tùng' }, { value: 'suu-tam', label: 'Sưu tầm' },
  { value: 'khai-vi', label: 'Khai vị' }, { value: 'hang-ngay', label: 'Dùng hàng ngày' },
]

interface Preset { category?: string[]; origin?: string[]; occasion?: string[]; maxPrice?: number }
const COLLECTION_PRESETS: Record<string, Preset> = {
  'vang-phap': { origin: ['phap'] },
  'qua-tang-doanh-nhan': { category: ['qua-tang-set'] },
  'vang-sui-le-hoi': { category: ['vang-sui'] },
  'suu-tam-cao-cap': { occasion: ['suu-tam'] },
  'duoi-400k': { maxPrice: 400000 },
  'tiec-cuoi-su-kien': { occasion: ['tiec-tung'] },
}

function volumeLabel(p: Product) { return p.category_slug === 'qua-tang-set' ? `Bộ ${p.volume / 750} chai` : `${p.volume}ml` }
function formatVND(n: number) { return n.toLocaleString('vi-VN') + '₫' }
const csv = (arr: string[]) => arr.join(',')
const parseCsv = (s: string | null) => (s ? s.split(',').filter(Boolean) : [])

function ProductCard({ p, onQuickAdd }: { p: Product; onQuickAdd: (p: Product) => void }) {
  const originLabel = ORIGIN_OPTIONS.find(o => o.value === p.origin)?.label ?? p.origin
  return (
    <div className={'rv-card' + (!p.in_stock ? ' rv-card-stock-out' : '')} data-reveal>
      <div className="rv-card-thumb">
        <div className="rv-card-badges">
          {p.badge === 'new' && <span className="rv-badge new">Mới</span>}
          {p.badge === 'sale' && p.price_sale != null && <span className="rv-badge sale">-{Math.round((1 - p.price_sale / p.price) * 100)}%</span>}
          {p.badge === 'hot' && <span className="rv-badge hot">Bán chạy</span>}
          {!p.in_stock && <span className="rv-badge out">Hết hàng</span>}
        </div>
        <Link to={`/san-pham/${p.slug}`} aria-label={`Xem chi tiết ${p.name}`}>
          <img src={p.image} alt={p.name} loading="lazy" />
        </Link>
        <button className="rv-quick-add" disabled={!p.in_stock} onClick={() => onQuickAdd(p)} aria-label={p.in_stock ? `Thêm ${p.name} vào giỏ` : `${p.name} đã hết hàng`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
        </button>
      </div>
      <Link to={`/san-pham/${p.slug}`} className="rv-card-body-link">
        <div className="rv-card-body">
          <span className="rv-card-origin">{originLabel} · {volumeLabel(p)}</span>
          <h3 className="rv-card-name">{p.name}</h3>
          <div className="rv-card-meta"><span className="rv-star">★</span> {p.rating.toFixed(1)} · Đã bán {p.sold}</div>
          <div className="rv-card-price">
            <span className="rv-price-now">{formatVND(p.price_sale ?? p.price)}</span>
            {p.price_sale ? <span className="rv-price-old">{formatVND(p.price)}</span> : null}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { addItem } = useCart()

  const [category, setCategory] = useState<string[]>(() => parseCsv(searchParams.get('category')))
  const [origin, setOrigin] = useState<string[]>(() => parseCsv(searchParams.get('origin')))
  const [abv, setAbv] = useState<string[]>(() => parseCsv(searchParams.get('abv')))
  const [occasion, setOccasion] = useState<string[]>(() => parseCsv(searchParams.get('occasion')))
  const [maxPrice, setMaxPrice] = useState<number>(() => {
    const p = searchParams.get('price')
    return p ? Math.min(Number(p), MAX_PRICE) : MAX_PRICE
  })
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest')
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1)

  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [openDropdown, setOpenDropdown] = useState<'origin' | 'abv' | 'occasion' | null>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  // Áp dụng preset "collection" 1 lần khi mount (từ /bo-suu-tap hoặc HeroSlider)
  useEffect(() => {
    const preset = searchParams.get('collection')
    if (preset && COLLECTION_PRESETS[preset]) {
      const p = COLLECTION_PRESETS[preset]
      if (p.category) setCategory(p.category)
      if (p.origin) setOrigin(p.origin)
      if (p.occasion) setOccasion(p.occasion)
      if (p.maxPrice) setMaxPrice(p.maxPrice)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('per_page', String(PER_PAGE))
    if (category.length) params.set('category_slugs', category.join(','))
    if (origin.length) params.set('origin', origin.join(','))
    if (abv.length) params.set('abv', abv.join(','))
    if (occasion.length) params.set('occasion', occasion.join(','))
    if (maxPrice < MAX_PRICE) params.set('max_price', String(maxPrice))
    if (search) params.set('q', search)
    if (sort !== 'newest') params.set('sort', sort)

    api.getPaged<Product[]>(`/public/products?${params.toString()}`)
      .then(({ data, total }) => { setProducts(data); setTotal(total) })
      .catch(() => {})
      .finally(() => setLoading(false))

    // Đồng bộ URL (không tạo lịch sử điều hướng mới)
    const qs = new URLSearchParams()
    if (category.length) qs.set('category', csv(category))
    if (origin.length) qs.set('origin', csv(origin))
    if (abv.length) qs.set('abv', csv(abv))
    if (occasion.length) qs.set('occasion', csv(occasion))
    if (maxPrice < MAX_PRICE) qs.set('price', String(maxPrice))
    if (search) qs.set('q', search)
    if (sort !== 'newest') qs.set('sort', sort)
    if (page > 1) qs.set('page', String(page))
    setSearchParams(qs, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, origin, abv, occasion, maxPrice, search, sort, page])

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))

  const toggleCategory = (v: string) => {
    setCategory(c => c.includes(v) ? c.filter(x => x !== v) : [...c, v])
    setPage(1)
  }
  const toggleFilter = (setter: React.Dispatch<React.SetStateAction<string[]>>, v: string) => {
    setter(arr => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v])
    setPage(1)
  }
  const clearAll = () => {
    setCategory([]); setOrigin([]); setAbv([]); setOccasion([]); setMaxPrice(MAX_PRICE); setSearch(''); setPage(1)
  }

  const activeFilterCount = category.length + origin.length + abv.length + occasion.length + (maxPrice < MAX_PRICE ? 1 : 0)

  const chips = useMemo(() => {
    const list: { label: string; onRemove: () => void }[] = []
    category.forEach(v => list.push({ label: CATEGORY_LABEL[v] ?? v, onRemove: () => toggleCategory(v) }))
    origin.forEach(v => list.push({ label: ORIGIN_OPTIONS.find(o => o.value === v)?.label ?? v, onRemove: () => toggleFilter(setOrigin, v) }))
    abv.forEach(v => list.push({ label: ABV_OPTIONS.find(o => o.value === v)?.label ?? v, onRemove: () => toggleFilter(setAbv, v) }))
    occasion.forEach(v => list.push({ label: OCCASION_OPTIONS.find(o => o.value === v)?.label ?? v, onRemove: () => toggleFilter(setOccasion, v) }))
    if (maxPrice < MAX_PRICE) list.push({ label: 'Dưới ' + formatVND(maxPrice), onRemove: () => setMaxPrice(MAX_PRICE) })
    if (search) list.push({ label: `Tìm: "${search}"`, onRemove: () => setSearch('') })
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, origin, abv, occasion, maxPrice, search])

  const startIdx = total === 0 ? 0 : (page - 1) * PER_PAGE
  const resultText = total === 0 ? '' : `Hiển thị ${startIdx + 1}–${Math.min(startIdx + PER_PAGE, total)} trong ${total} sản phẩm`

  const CategoryPills = ({ prefix }: { prefix: string }) => (
    <div className="rv-cat-pills">
      {Object.entries(CATEGORY_LABEL).map(([slug, label]) => (
        <button key={prefix + slug} type="button" className={'rv-cat-pill' + (category.includes(slug) ? ' active' : '')} onClick={() => toggleCategory(slug)}>{label}</button>
      ))}
    </div>
  )

  return (
    <section className="rv-catalog" id="rv-catalog">
      <div className="wd-container">
        <div className="rv-catalog-head">
          <div>
            <div className="rv-eyebrow">Toàn bộ sản phẩm</div>
            <h2 className="rv-sec-title">Danh mục <span>rượu vang</span></h2>
          </div>
        </div>

        <div className="rv-toolbar" ref={toolbarRef}>
          <div className="rv-toolbar-row d-none d-lg-flex">
            <CategoryPills prefix="d-" />

            <div className={'rv-dd' + (openDropdown === 'origin' ? ' open' : '')}>
              <button type="button" className="rv-dd-btn" onClick={() => setOpenDropdown(o => o === 'origin' ? null : 'origin')}>
                Xuất xứ <svg viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth={2}><path d="m1 1 5 5 5-5" /></svg>
              </button>
              <div className="rv-dd-panel">
                {ORIGIN_OPTIONS.map(o => (
                  <label key={o.value} className="rv-dd-check">
                    <input type="checkbox" checked={origin.includes(o.value)} onChange={() => toggleFilter(setOrigin, o.value)} /> {o.label}
                  </label>
                ))}
              </div>
            </div>

            <div className={'rv-dd' + (openDropdown === 'abv' ? ' open' : '')}>
              <button type="button" className="rv-dd-btn" onClick={() => setOpenDropdown(o => o === 'abv' ? null : 'abv')}>
                Nồng độ cồn <svg viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth={2}><path d="m1 1 5 5 5-5" /></svg>
              </button>
              <div className="rv-dd-panel">
                {ABV_OPTIONS.map(o => (
                  <label key={o.value} className="rv-dd-check">
                    <input type="checkbox" checked={abv.includes(o.value)} onChange={() => toggleFilter(setAbv, o.value)} /> {o.label}
                  </label>
                ))}
              </div>
            </div>

            <div className={'rv-dd' + (openDropdown === 'occasion' ? ' open' : '')}>
              <button type="button" className="rv-dd-btn" onClick={() => setOpenDropdown(o => o === 'occasion' ? null : 'occasion')}>
                Dịp dùng <svg viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth={2}><path d="m1 1 5 5 5-5" /></svg>
              </button>
              <div className="rv-dd-panel">
                {OCCASION_OPTIONS.map(o => (
                  <label key={o.value} className="rv-dd-check">
                    <input type="checkbox" checked={occasion.includes(o.value)} onChange={() => toggleFilter(setOccasion, o.value)} /> {o.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="rv-price-wrap">
              <label htmlFor="rvPriceRange">Giá tối đa</label>
              <input id="rvPriceRange" type="range" min={0} max={MAX_PRICE} step={50000} value={maxPrice} onChange={e => { setMaxPrice(Number(e.target.value)); setPage(1) }} />
              <span className="rv-price-val">Đến {formatVND(maxPrice)}</span>
            </div>

            <select className="rv-sort-select" value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}>
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="bestseller">Bán chạy</option>
              <option value="rating">Đánh giá cao</option>
            </select>

            <span className="rv-result-count" aria-live="polite">{resultText}</span>
          </div>

          <div className="rv-toolbar-mobile">
            <button className="rv-filter-mob-btn" data-bs-toggle="offcanvas" data-bs-target="#rvOffcanvas">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 6h16M7 12h10M10 18h4" /></svg>
              Bộ lọc
              {activeFilterCount > 0 && <span className="rv-filter-badge">{activeFilterCount}</span>}
            </button>
            <select className="rv-select-native" style={{ flex: '0 0 150px' }} value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}>
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá tăng</option>
              <option value="price-desc">Giá giảm</option>
              <option value="bestseller">Bán chạy</option>
              <option value="rating">Đánh giá</option>
            </select>
          </div>

          {chips.length > 0 && (
            <div className="rv-active-chips">
              {chips.map((c, i) => (
                <span className="rv-chip" key={i}>{c.label}<button onClick={c.onRemove}>✕</button></span>
              ))}
              <button className="rv-clear-all" onClick={clearAll}>Xóa tất cả</button>
            </div>
          )}
        </div>

        {/* Offcanvas filter (mobile) — Bootstrap JS (bootstrap.bundle.min.js) điều khiển qua data-bs-* */}
        <div className="offcanvas offcanvas-start rv-offcanvas" tabIndex={-1} id="rvOffcanvas">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Bộ lọc sản phẩm</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Đóng"></button>
          </div>
          <div className="offcanvas-body">
            <div className="rv-oc-group">
              <h6>Loại rượu</h6>
              <CategoryPills prefix="m-" />
            </div>
            <div className="rv-oc-group">
              <h6>Xuất xứ</h6>
              {ORIGIN_OPTIONS.map(o => (
                <label key={o.value} className="rv-dd-check">
                  <input type="checkbox" checked={origin.includes(o.value)} onChange={() => toggleFilter(setOrigin, o.value)} /> {o.label}
                </label>
              ))}
            </div>
            <div className="rv-oc-group">
              <h6>Nồng độ cồn</h6>
              {ABV_OPTIONS.map(o => (
                <label key={o.value} className="rv-dd-check">
                  <input type="checkbox" checked={abv.includes(o.value)} onChange={() => toggleFilter(setAbv, o.value)} /> {o.label}
                </label>
              ))}
            </div>
            <div className="rv-oc-group">
              <h6>Dịp dùng</h6>
              {OCCASION_OPTIONS.map(o => (
                <label key={o.value} className="rv-dd-check">
                  <input type="checkbox" checked={occasion.includes(o.value)} onChange={() => toggleFilter(setOccasion, o.value)} /> {o.label}
                </label>
              ))}
            </div>
            <div className="rv-oc-group">
              <h6>Giá tối đa</h6>
              <div className="rv-price-wrap" style={{ width: '100%' }}>
                <input type="range" min={0} max={MAX_PRICE} step={50000} value={maxPrice} onChange={e => { setMaxPrice(Number(e.target.value)); setPage(1) }} style={{ flex: 1, width: 'auto' }} />
                <span className="rv-price-val">Đến {formatVND(maxPrice)}</span>
              </div>
            </div>
            <button className="rv-btn rv-btn-solid rv-btn-block" data-bs-dismiss="offcanvas">Xem kết quả (đã áp dụng ngay)</button>
            <button className="rv-btn rv-btn-outline rv-btn-block" style={{ marginTop: 10 }} onClick={clearAll}>Xóa tất cả bộ lọc</button>
          </div>
        </div>

        {loading ? (
          <div className="rv-grid">{Array.from({ length: PER_PAGE }).map((_, i) => <div key={i} className="rv-card" style={{ minHeight: 320, opacity: .5 }} />)}</div>
        ) : products.length === 0 ? (
          <div className="rv-empty">
            <div className="rv-empty-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg></div>
            <h3>Không tìm thấy sản phẩm phù hợp</h3>
            <p>Hãy thử điều chỉnh bộ lọc hoặc xóa bớt tiêu chí tìm kiếm.</p>
            <button className="rv-btn rv-btn-outline" onClick={clearAll}>Xóa tất cả bộ lọc</button>
          </div>
        ) : (
          <div className="rv-grid">
            {products.map(p => <ProductCard key={p.id} p={p} onQuickAdd={pp => addItem({ product_id: pp.id, name: pp.name, slug: pp.slug, image: pp.image, price: pp.price_sale ?? pp.price })} />)}
          </div>
        )}

        {totalPages > 1 && (
          <nav className="rv-pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} className={n === page ? 'active' : ''} onClick={() => { setPage(n); document.getElementById('rv-catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>{n}</button>
            ))}
          </nav>
        )}
      </div>
    </section>
  )
}
