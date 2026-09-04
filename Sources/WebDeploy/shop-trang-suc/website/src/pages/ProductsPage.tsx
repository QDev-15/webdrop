import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import { useCart } from '../contexts/CartContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import type { Product } from '../contexts/SiteContext'

// Catalog toolbar filter — khớp NGUYÊN VĂN UI thật của san-pham.html gốc: category pills (single-select)
// + 2 dropdown checkbox (Chất liệu/Dịp sử dụng, multi-select) + price-range max + sort — KHÔNG phải
// sidebar 5-block generic. Toàn bộ filter/sort đều "áp dụng tức thì" (không có nút Apply), đúng hành vi gốc.

const PER_PAGE = 12
const MAX_PRICE = 35000000

const CATEGORY_LABEL: Record<string, string> = {
  'nhan': 'Nhẫn', 'day-chuyen': 'Dây chuyền', 'bong-tai': 'Bông tai', 'lac-tay': 'Lắc tay', 'bo-trang-suc': 'Bộ trang sức',
}
const MATERIAL_OPTIONS = [
  { value: 'bac-925', label: 'Bạc 925' },
  { value: 'vang-18k', label: 'Vàng 18K' },
  { value: 'vang-24k', label: 'Vàng 24K' },
  { value: 'da-quy', label: 'Đá quý tự nhiên' },
  { value: 'dinh-da', label: 'Đính đá CZ' },
]
const OCCASION_OPTIONS = [
  { value: 'hang-ngay', label: 'Hàng ngày' },
  { value: 'du-tiec', label: 'Dự tiệc' },
  { value: 'cuoi-hoi', label: 'Cưới hỏi' },
  { value: 'qua-tang', label: 'Quà tặng' },
]
const THEME_LABEL: Record<string, string> = {
  'moi-ve': 'Bộ sưu tập mới về', 'ban-chay': 'Bán chạy nhất', 'uu-dai': 'Đang ưu đãi', 'qua-tang': 'Quà tặng ý nghĩa',
}
const MATERIAL_LABEL: Record<string, string> = Object.fromEntries(MATERIAL_OPTIONS.map(o => [o.value, o.label]))

function formatVND(n: number) { return n.toLocaleString('vi-VN') + '₫' }
const csv = (arr: string[]) => arr.join(',')
const parseCsv = (s: string | null) => (s ? s.split(',').filter(Boolean) : [])

function ProductCard({ p, onQuickAdd }: { p: Product; onQuickAdd: (p: Product) => void }) {
  const matLabel = MATERIAL_LABEL[p.material] ?? p.material
  function renderStars(rating: number) {
    const full = Math.round(rating)
    return '★'.repeat(full) + '☆'.repeat(5 - full)
  }
  return (
    <article className="tr-prod-card" data-reveal>
      <Link to={`/san-pham/${p.slug}`} className="tr-prod-img" aria-label={p.name}>
        <img src={p.image} alt={p.name} loading="lazy" />
        {!p.in_stock ? (
          <span className="tr-prod-badge-out">Hết hàng</span>
        ) : p.badge === 'new' ? (
          <span className="tr-prod-badge tr-prod-badge-new">Mới</span>
        ) : p.badge === 'sale' ? (
          <span className="tr-prod-badge tr-prod-badge-sale">Sale</span>
        ) : p.badge === 'hot' ? (
          <span className="tr-prod-badge tr-prod-badge-hot">Hot</span>
        ) : null}
        <span className="tr-prod-fav" role="button" aria-label={`Yêu thích ${p.name}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
        </span>
        <div className="tr-prod-add-float">
          <button
            className="tr-btn tr-btn-fill tr-btn-sm tr-btn-block"
            disabled={!p.in_stock}
            onClick={e => { e.preventDefault(); e.stopPropagation(); onQuickAdd(p) }}
          >
            {p.in_stock ? '+ Thêm vào giỏ' : 'Hết hàng'}
          </button>
        </div>
      </Link>
      <div className="tr-prod-body">
        <div className="tr-prod-material">{matLabel}</div>
        <h3 className="tr-prod-name"><Link to={`/san-pham/${p.slug}`}>{p.name}</Link></h3>
        <div className="tr-prod-rating"><span className="tr-rating-stars">{renderStars(p.rating)}</span><span>{p.rating} ({p.sold.toLocaleString('vi-VN')})</span></div>
        <div className="tr-prod-price">
          <span className={'tr-price-main' + (p.price_sale ? ' tr-price-sale' : '')}>{formatVND(p.price_sale || p.price)}</span>
          {p.price_sale ? <span className="tr-price-old">{formatVND(p.price)}</span> : null}
        </div>
      </div>
    </article>
  )
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { addItem } = useCart()

  const [category, setCategory] = useState(searchParams.get('category') || 'tat-ca')
  const [material, setMaterial] = useState<string[]>(() => parseCsv(searchParams.get('material')))
  const [occasion, setOccasion] = useState<string[]>(() => parseCsv(searchParams.get('occasion')))
  const [theme, setTheme] = useState<string | null>(searchParams.get('theme'))
  const [maxPrice, setMaxPrice] = useState<number>(() => {
    const p = searchParams.get('maxprice')
    return p ? Math.min(Number(p), MAX_PRICE) : MAX_PRICE
  })
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest')
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1)

  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [openDropdown, setOpenDropdown] = useState<'material' | 'occasion' | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const toolbarRef = useRef<HTMLDivElement>(null)

  useDocumentMeta({
    title: 'Sản phẩm — VIOLETTE Fine Jewelry',
    description: 'Toàn bộ nhẫn, dây chuyền, bông tai, lắc tay, bộ trang sức bạc 925 - vàng 18K/24K - đá quý tự nhiên tại VIOLETTE. Lọc theo giá, chất liệu, dịp sử dụng.',
  })

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) setOpenDropdown(null)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('per_page', String(PER_PAGE))
    if (category !== 'tat-ca') params.set('category_slugs', category)
    if (material.length) params.set('material', material.join(','))
    if (occasion.length) params.set('occasion', occasion.join(','))
    if (theme) params.set('theme', theme)
    if (maxPrice < MAX_PRICE) params.set('max_price', String(maxPrice))
    if (search) params.set('q', search)
    if (sort !== 'newest') params.set('sort', sort)

    api.getPaged<Product[]>(`/public/products?${params.toString()}`)
      .then(({ data, total }) => { setProducts(data); setTotal(total) })
      .catch(() => {})
      .finally(() => setLoading(false))

    const qs = new URLSearchParams()
    if (category !== 'tat-ca') qs.set('category', category)
    if (material.length) qs.set('material', csv(material))
    if (occasion.length) qs.set('occasion', csv(occasion))
    if (theme) qs.set('theme', theme)
    if (maxPrice < MAX_PRICE) qs.set('maxprice', String(maxPrice))
    if (search) qs.set('q', search)
    if (sort !== 'newest') qs.set('sort', sort)
    if (page > 1) qs.set('page', String(page))
    setSearchParams(qs, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, material, occasion, theme, maxPrice, search, sort, page])

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))

  const toggleMaterial = (v: string) => { setMaterial(arr => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]); setPage(1) }
  const toggleOccasion = (v: string) => { setOccasion(arr => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]); setPage(1) }
  const selectCategory = (v: string) => { setCategory(v); setPage(1) }

  const clearAll = () => {
    setCategory('tat-ca'); setMaterial([]); setOccasion([]); setTheme(null)
    setMaxPrice(MAX_PRICE); setSearch(''); setSort('newest'); setPage(1)
  }

  const activeFilterCount = material.length + occasion.length + (maxPrice < MAX_PRICE ? 1 : 0) + (category !== 'tat-ca' ? 1 : 0)

  const chips = useMemo(() => {
    const list: { label: string; onRemove: () => void }[] = []
    if (category !== 'tat-ca') list.push({ label: CATEGORY_LABEL[category] ?? category, onRemove: () => selectCategory('tat-ca') })
    material.forEach(v => list.push({ label: MATERIAL_LABEL[v] ?? v, onRemove: () => toggleMaterial(v) }))
    occasion.forEach(v => list.push({ label: OCCASION_OPTIONS.find(o => o.value === v)?.label ?? v, onRemove: () => toggleOccasion(v) }))
    if (maxPrice < MAX_PRICE) list.push({ label: 'Giá ≤ ' + formatVND(maxPrice), onRemove: () => setMaxPrice(MAX_PRICE) })
    if (theme) list.push({ label: THEME_LABEL[theme] ?? theme, onRemove: () => setTheme(null) })
    if (search) list.push({ label: `"${search}"`, onRemove: () => setSearch('') })
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, material, occasion, maxPrice, theme, search])

  const startIdx = total === 0 ? 0 : (page - 1) * PER_PAGE
  const resultText = total === 0 ? 'Không tìm thấy sản phẩm' : `Hiển thị ${startIdx + 1}–${Math.min(startIdx + PER_PAGE, total)} trong ${total} sản phẩm`

  const CategoryPills = () => (
    <div className="tr-cat-pills" role="group" aria-label="Lọc theo danh mục">
      <button className={'tr-cat-pill' + (category === 'tat-ca' ? ' active' : '')} onClick={() => selectCategory('tat-ca')}>Tất cả</button>
      {Object.entries(CATEGORY_LABEL).map(([slug, label]) => (
        <button key={slug} className={'tr-cat-pill' + (category === slug ? ' active' : '')} onClick={() => selectCategory(slug)}>{label}</button>
      ))}
    </div>
  )

  return (
    <>
      <section className="tr-page-head">
        <div className="tr-container">
          <div className="tr-breadcrumb"><Link to="/">Trang chủ</Link> / <span>Sản phẩm</span></div>
          <h1>Toàn bộ sản phẩm</h1>
          <p className="tr-page-head-sub">Nhẫn, dây chuyền, bông tai, lắc tay và bộ trang sức — bạc 925, vàng 18K/24K, đá quý tự nhiên.</p>
        </div>
      </section>

      <div className="tr-toolbar-wrap">
        <div className="tr-container">
          <div className="tr-toolbar d-none d-lg-flex" ref={toolbarRef}>
            <CategoryPills />
            <div className="tr-toolbar-divider"></div>

            <div className={'tr-dropdown' + (openDropdown === 'material' ? ' open' : '')}>
              <button type="button" className="tr-dropdown-btn" onClick={() => setOpenDropdown(o => o === 'material' ? null : 'material')}>
                {material.length ? `Chất liệu (${material.length})` : 'Chất liệu'} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}><path d="M6 9l6 6 6-6" /></svg>
              </button>
              <div className="tr-dropdown-menu">
                {MATERIAL_OPTIONS.map(o => (
                  <label className="tr-check-row" key={o.value}>
                    <input type="checkbox" checked={material.includes(o.value)} onChange={() => toggleMaterial(o.value)} /> {o.label}
                  </label>
                ))}
              </div>
            </div>

            <div className={'tr-dropdown' + (openDropdown === 'occasion' ? ' open' : '')}>
              <button type="button" className="tr-dropdown-btn" onClick={() => setOpenDropdown(o => o === 'occasion' ? null : 'occasion')}>
                {occasion.length ? `Dịp sử dụng (${occasion.length})` : 'Dịp sử dụng'} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}><path d="M6 9l6 6 6-6" /></svg>
              </button>
              <div className="tr-dropdown-menu">
                {OCCASION_OPTIONS.map(o => (
                  <label className="tr-check-row" key={o.value}>
                    <input type="checkbox" checked={occasion.includes(o.value)} onChange={() => toggleOccasion(o.value)} /> {o.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="tr-price-range">
              <span>Giá:</span>
              <input type="range" min={0} max={MAX_PRICE} step={500000} value={maxPrice} onChange={e => { setMaxPrice(Number(e.target.value)); setPage(1) }} aria-label="Giá tối đa" />
              <span>{maxPrice >= MAX_PRICE ? 'Tất cả' : formatVND(maxPrice)}</span>
            </div>

            <div className="tr-sort">
              <select value={sort} onChange={e => { setSort(e.target.value); setPage(1) }} aria-label="Sắp xếp theo">
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="bestseller">Bán chạy</option>
                <option value="rating">Đánh giá cao</option>
              </select>
            </div>

            <div className="tr-result-count" aria-live="polite">{resultText}</div>
          </div>

          <div className="d-flex d-lg-none align-items-center justify-content-between gap-2" style={{ flexWrap: 'wrap' }}>
            <div className="tr-cat-pills" style={{ flexWrap: 'wrap' }}>
              <button className={'tr-cat-pill' + (category === 'tat-ca' ? ' active' : '')} onClick={() => selectCategory('tat-ca')}>Tất cả</button>
              {Object.entries(CATEGORY_LABEL).map(([slug, label]) => (
                <button key={slug} className={'tr-cat-pill' + (category === slug ? ' active' : '')} onClick={() => selectCategory(slug)}>{label}</button>
              ))}
            </div>
            <button className="tr-filter-mobile-btn" aria-label="Mở bộ lọc" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></svg>
              Lọc &amp; sắp xếp
              {activeFilterCount > 0 && <span className="tr-filter-badge">{activeFilterCount}</span>}
            </button>
          </div>

          {chips.length > 0 && (
            <div className="tr-chips-row" aria-live="polite">
              {chips.map((c, i) => (
                <span className="tr-chip" key={i}>{c.label}
                  <span className="tr-chip-remove" role="button" tabIndex={0} aria-label={`Xóa ${c.label}`} onClick={c.onRemove}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </span>
                </span>
              ))}
              <span className="tr-chips-clear" role="button" tabIndex={0} onClick={clearAll}>Xóa tất cả</span>
            </div>
          )}
        </div>
      </div>

      <main className="tr-catalog-wrap">
        <div className="tr-container">
          {loading ? (
            <div className="tr-prod-grid" aria-live="polite" aria-label="Danh sách sản phẩm">
              {Array.from({ length: PER_PAGE }).map((_, i) => <div key={i} className="tr-prod-card" style={{ minHeight: 320, opacity: .4 }} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="tr-empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.3}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /><path d="M11 8v6M8 11h6" /></svg>
              <h3>Không tìm thấy sản phẩm nào</h3>
              <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm khác.</p>
              <button className="tr-btn tr-btn-silver" onClick={clearAll}>Xóa tất cả bộ lọc</button>
            </div>
          ) : (
            <div className="tr-prod-grid" aria-live="polite" aria-label="Danh sách sản phẩm">
              {products.map(p => <ProductCard key={p.id} p={p} onQuickAdd={pp => addItem({ product_id: pp.id, name: pp.name, slug: pp.slug, image: pp.image, price: pp.price_sale || pp.price })} />)}
            </div>
          )}

          {totalPages > 1 && (
            <ul className="tr-pagination" aria-label="Phân trang">
              <li className={'tr-page-item' + (page === 1 ? ' disabled' : '')}>
                <button className="page-link" disabled={page === 1} onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>&lsaquo;</button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <li key={n} className={'tr-page-item' + (n === page ? ' active' : '')}>
                  <button className="page-link" onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>{n}</button>
                </li>
              ))}
              <li className={'tr-page-item' + (page === totalPages ? ' disabled' : '')}>
                <button className="page-link" disabled={page === totalPages} onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>&rsaquo;</button>
              </li>
            </ul>
          )}
        </div>
      </main>

      <div className={'tr-offcanvas' + (mobileOpen ? ' open' : '')} role="dialog" aria-modal="true" aria-label="Bộ lọc sản phẩm">
        <div className="tr-offcanvas-backdrop" onClick={() => setMobileOpen(false)}></div>
        <div className="tr-offcanvas-panel">
          <div className="tr-offcanvas-header">
            <span className="tr-offcanvas-title">Bộ lọc &amp; sắp xếp</span>
            <button className="tr-offcanvas-close" aria-label="Đóng bộ lọc" onClick={() => setMobileOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="tr-filter-section">
            <div className="tr-filter-section-title">Sắp xếp theo</div>
            <select value={sort} onChange={e => { setSort(e.target.value); setPage(1) }} style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 20, padding: '10px 14px', color: 'var(--text-2)', background: 'transparent' }}>
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="bestseller">Bán chạy</option>
              <option value="rating">Đánh giá cao</option>
            </select>
          </div>

          <div className="tr-filter-section">
            <div className="tr-filter-section-title">Chất liệu</div>
            {MATERIAL_OPTIONS.map(o => (
              <label className="tr-check-row" key={o.value}>
                <input type="checkbox" checked={material.includes(o.value)} onChange={() => toggleMaterial(o.value)} /> {o.label}
              </label>
            ))}
          </div>

          <div className="tr-filter-section">
            <div className="tr-filter-section-title">Dịp sử dụng</div>
            {OCCASION_OPTIONS.map(o => (
              <label className="tr-check-row" key={o.value}>
                <input type="checkbox" checked={occasion.includes(o.value)} onChange={() => toggleOccasion(o.value)} /> {o.label}
              </label>
            ))}
          </div>

          <div className="tr-filter-section">
            <div className="tr-filter-section-title">Khoảng giá</div>
            <input type="range" min={0} max={MAX_PRICE} step={500000} value={maxPrice} onChange={e => { setMaxPrice(Number(e.target.value)); setPage(1) }} style={{ width: '100%', accentColor: 'var(--accent)' }} aria-label="Giá tối đa" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-2)', marginTop: 6 }}>
              <span>0₫</span><span>{maxPrice >= MAX_PRICE ? 'Tất cả' : formatVND(maxPrice)}</span><span>35.000.000₫</span>
            </div>
          </div>

          <button className="tr-btn tr-btn-silver tr-btn-block" onClick={clearAll}>Xóa tất cả bộ lọc</button>
        </div>
      </div>
    </>
  )
}
