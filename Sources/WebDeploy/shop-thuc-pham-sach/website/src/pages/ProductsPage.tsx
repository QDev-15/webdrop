import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import { useSite, type Product } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const PER_PAGE = 9

// Tông màu nhóm thực phẩm — phải khớp 100% với COLOR_SWATCHES ở admin/src/pages/products/ProductForm.tsx
const COLOR_SWATCHES = [
  { name: 'Xanh lá', hex: '#3f7d4a' },
  { name: 'Đỏ', hex: '#c0392b' },
  { name: 'Cam', hex: '#d97706' },
  { name: 'Vàng', hex: '#dbb42c' },
]

// Chứng nhận — phải khớp filter checkbox trong template gốc (san-pham.html)
const CERT_OPTIONS = ['VietGAP', 'Organic', 'GlobalGAP']

export default function ProductsPage() {
  useDocumentMeta({
    title: 'Sản Phẩm — Tươi Mỗi Ngày',
    description: 'Rau củ hữu cơ, trái cây, thịt cá tươi, gạo & đồ khô chuẩn VietGAP — lọc theo danh mục, giá, chứng nhận, giao hàng lạnh trong ngày.',
  })
  const { categories } = useSite()
  const { addItem } = useCart()
  const [searchParams] = useSearchParams()

  const [tab, setTab] = useState<'all' | 'sale' | number>('all')

  const [searchInput, setSearchInput] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')

  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [categoryIds, setCategoryIds] = useState<number[]>([])
  const [selectedCerts, setSelectedCerts] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [minRating, setMinRating] = useState<number | null>(null)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [saleOnly, setSaleOnly] = useState(false)
  const [newOnly, setNewOnly] = useState(false)
  const [sort, setSort] = useState('default')
  const [page, setPage] = useState(1)

  const [appliedMinPrice, setAppliedMinPrice] = useState('')
  const [appliedMaxPrice, setAppliedMaxPrice] = useState('')
  const [appliedCategoryIds, setAppliedCategoryIds] = useState<number[]>([])
  const [appliedCerts, setAppliedCerts] = useState<string[]>([])
  const [appliedColors, setAppliedColors] = useState<string[]>([])
  const [appliedMinRating, setAppliedMinRating] = useState<number | null>(null)
  const [appliedInStock, setAppliedInStock] = useState(false)
  const [appliedSale, setAppliedSale] = useState(false)
  const [appliedNew, setAppliedNew] = useState(false)

  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  // Đọc ?cat=slug hoặc ?sale=1 từ URL khi vào trang lần đầu (link từ Header/Footer/HomePage)
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

  // Đọc ?q=từ khóa từ URL khi vào trang lần đầu (link từ ô tìm kiếm ở Header)
  useEffect(() => {
    const q = searchParams.get('q')
    if (q) { setSearchInput(q); setAppliedSearch(q) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Debounce 400ms cho ô tìm kiếm sidebar
  useEffect(() => {
    const t = setTimeout(() => {
      setAppliedSearch(searchInput.trim())
      setPage(1)
    }, 400)
    return () => clearTimeout(t)
  }, [searchInput])

  const query = useMemo(() => {
    const params = new URLSearchParams()
    if (appliedSearch) params.set('q', appliedSearch)
    if (appliedCategoryIds.length) params.set('category_ids', appliedCategoryIds.join(','))
    if (appliedMinPrice) params.set('min_price', appliedMinPrice)
    if (appliedMaxPrice) params.set('max_price', appliedMaxPrice)
    if (appliedCerts.length) params.set('certs', appliedCerts.join(','))
    if (appliedColors.length) params.set('colors', appliedColors.join(','))
    if (appliedMinRating !== null) params.set('min_rating', String(appliedMinRating))
    if (appliedInStock) params.set('in_stock', '1')
    if (appliedSale) params.set('sale', '1')
    if (appliedNew) params.set('is_new', '1')
    params.set('sort', sort)
    params.set('page', String(page))
    params.set('per_page', String(PER_PAGE))
    return params.toString()
  }, [appliedSearch, appliedCategoryIds, appliedMinPrice, appliedMaxPrice, appliedCerts, appliedColors, appliedMinRating, appliedInStock, appliedSale, appliedNew, sort, page])

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
  const toggleCert = (name: string) => setSelectedCerts(prev => prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name])
  const toggleColor = (name: string) => setSelectedColors(prev => prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name])

  const applyFilters = () => {
    setAppliedMinPrice(minPrice)
    setAppliedMaxPrice(maxPrice)
    setAppliedCategoryIds(categoryIds)
    setAppliedCerts(selectedCerts)
    setAppliedColors(selectedColors)
    setAppliedMinRating(minRating)
    setAppliedInStock(inStockOnly)
    setAppliedSale(saleOnly)
    setAppliedNew(newOnly)
    setPage(1)
    setTab(categoryIds.length === 1 ? categoryIds[0] : saleOnly ? 'sale' : 'all')
  }

  const clearFilters = () => {
    setSearchInput(''); setAppliedSearch('')
    setMinPrice(''); setAppliedMinPrice('')
    setMaxPrice(''); setAppliedMaxPrice('')
    setCategoryIds([]); setAppliedCategoryIds([])
    setSelectedCerts([]); setAppliedCerts([])
    setSelectedColors([]); setAppliedColors([])
    setMinRating(null); setAppliedMinRating(null)
    setInStockOnly(false); setAppliedInStock(false)
    setSaleOnly(false); setAppliedSale(false)
    setNewOnly(false); setAppliedNew(false)
    setSort('default'); setTab('all'); setPage(1)
  }

  const pageNumbers = (): (number | '…')[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (page <= 3) return [1, 2, 3, 4, '…', totalPages]
    if (page >= totalPages - 2) return [1, '…', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [1, '…', page, '…', totalPages]
  }

  const rangeStart = total === 0 ? 0 : (page - 1) * PER_PAGE + 1
  const rangeEnd = Math.min(page * PER_PAGE, total)

  return (
    <>
      <section className="tp-page-hero">
        <div className="tp-container">
          <div className="tp-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <i className="bi bi-chevron-right" style={{ fontSize: 10 }} />
            <span>Sản phẩm</span>
          </div>
          <h1 className="tp-page-title">Tất cả sản phẩm</h1>
          <p className="tp-page-count">Hiển thị <strong>{rangeStart}–{rangeEnd}</strong> trong số <strong>{total}</strong> sản phẩm sạch</p>
        </div>
      </section>

      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', overflowX: 'auto', scrollbarWidth: 'none' }}>
        <div className="tp-container" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
          <button className={`tp-btn tp-btn-ghost tp-btn-sm${tab === 'all' ? ' tp-active' : ''}`} style={{ borderRadius: 0, border: 'none', borderBottom: tab === 'all' ? '2px solid var(--accent)' : '2px solid transparent' }} onClick={() => selectTab('all')}>Tất cả</button>
          {categories.map(c => (
            <button key={c.id} className="tp-btn tp-btn-ghost tp-btn-sm" style={{ borderRadius: 0, border: 'none', borderBottom: tab === c.id ? '2px solid var(--accent)' : '2px solid transparent' }} onClick={() => selectTab(c.id)}>{c.name}</button>
          ))}
          <button className="tp-btn tp-btn-ghost tp-btn-sm" style={{ borderRadius: 0, border: 'none', borderBottom: tab === 'sale' ? '2px solid var(--accent)' : '2px solid transparent' }} onClick={() => selectTab('sale')}>Đang giảm giá</button>
        </div>
      </div>

      <div className="tp-container">
        <div className="tp-shop-layout">
          <aside className="tp-filter-sidebar" aria-label="Bộ lọc sản phẩm">
            <div className="tp-filter-hd">
              Bộ lọc
              <span className="tp-filter-clear" onClick={clearFilters}>Xóa lọc</span>
            </div>

            <div className="tp-filter-block">
              <div className="tp-filter-title">Tìm kiếm</div>
              <div className="tp-search-box">
                <i className="bi bi-search" aria-hidden="true" />
                <input
                  type="search"
                  className="tp-search-input"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Tìm theo tên sản phẩm..."
                  aria-label="Tìm kiếm sản phẩm"
                />
              </div>
            </div>

            <div className="tp-filter-block">
              <div className="tp-filter-title">Khoảng giá</div>
              <div className="tp-price-range">
                <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="0" aria-label="Giá thấp nhất" />
                <span>—</span>
                <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="500.000" aria-label="Giá cao nhất" />
              </div>
            </div>

            <div className="tp-filter-block">
              <div className="tp-filter-title">Danh mục</div>
              <div className="tp-filter-opts">
                {categories.map(cat => (
                  <label className="tp-filter-opt" key={cat.id}>
                    <input type="checkbox" checked={categoryIds.includes(cat.id)} onChange={() => toggleCategory(cat.id)} />
                    {cat.name} <span className="tp-count">{cat.product_count}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="tp-filter-block">
              <div className="tp-filter-title">Chứng nhận</div>
              <div className="tp-filter-opts">
                {CERT_OPTIONS.map(c => (
                  <label className="tp-filter-opt" key={c}>
                    <input type="checkbox" checked={selectedCerts.includes(c)} onChange={() => toggleCert(c)} />
                    {c === 'Organic' ? 'Organic (Hữu cơ)' : c}
                  </label>
                ))}
              </div>
            </div>

            <div className="tp-filter-block">
              <div className="tp-filter-title">Màu sắc</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {COLOR_SWATCHES.map(c => (
                  <div
                    key={c.name}
                    style={{
                      width: 26, height: 26, borderRadius: '50%', background: c.hex, cursor: 'pointer',
                      border: selectedColors.includes(c.name) ? '2px solid var(--accent)' : '1px solid var(--border)',
                      boxShadow: selectedColors.includes(c.name) ? '0 0 0 2px var(--surface), 0 0 0 4px var(--accent)' : 'none',
                      transition: 'box-shadow .15s',
                    }}
                    title={c.name}
                    role="button"
                    tabIndex={0}
                    aria-pressed={selectedColors.includes(c.name)}
                    aria-label={`Màu ${c.name}`}
                    onClick={() => toggleColor(c.name)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleColor(c.name) } }}
                  />
                ))}
              </div>
            </div>

            <div className="tp-filter-block">
              <div className="tp-filter-title">Đánh giá</div>
              <div className="tp-filter-opts">
                {[5, 4, 3].map(r => (
                  <label className="tp-filter-opt" key={r}>
                    <input type="radio" name="min-rating" checked={minRating === r} onChange={() => setMinRating(minRating === r ? null : r)} />
                    {'★'.repeat(r)}{'☆'.repeat(5 - r)} {r === 5 ? '' : 'trở lên'}
                  </label>
                ))}
              </div>
            </div>

            <div className="tp-filter-block">
              <div className="tp-filter-title">Tình trạng</div>
              <div className="tp-filter-opts">
                <label className="tp-filter-opt"><input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} /> Còn hàng</label>
                <label className="tp-filter-opt"><input type="checkbox" checked={saleOnly} onChange={e => setSaleOnly(e.target.checked)} /> Đang khuyến mãi</label>
                <label className="tp-filter-opt"><input type="checkbox" checked={newOnly} onChange={e => setNewOnly(e.target.checked)} /> Hàng mới</label>
              </div>
            </div>

            <button className="tp-btn tp-btn-primary tp-btn-full" style={{ marginTop: 8 }} onClick={applyFilters}>Áp dụng bộ lọc</button>
            <button className="tp-btn tp-btn-ghost tp-btn-full" style={{ marginTop: 10 }} onClick={clearFilters}>Xóa bộ lọc</button>
          </aside>

          <div>
            <div className="tp-shop-top">
              <span className="tp-result-count">Tìm thấy {total} sản phẩm</span>
              <select className="tp-sort-select" aria-label="Sắp xếp" value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}>
                <option value="default">Nổi bật nhất</option>
                <option value="new">Mới nhất</option>
                <option value="price-asc">Giá: Thấp đến cao</option>
                <option value="price-desc">Giá: Cao đến thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
              </select>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-3)' }}>Đang tải sản phẩm...</div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-3)' }}>
                {appliedSearch
                  ? <>Không tìm thấy sản phẩm nào khớp từ khóa "<strong>{appliedSearch}</strong>"</>
                  : 'Không tìm thấy sản phẩm nào khớp bộ lọc'}
              </div>
            ) : (
              <div className="tp-prod-grid">
                {products.map(p => (
                  <div className="tp-prod-card" data-reveal key={p.id}>
                    <div className="tp-prod-thumb">
                      {p.badge && (
                        <span className={`tp-prod-badge ${p.is_new ? 'tp-prod-badge-new' : p.price_sale ? 'tp-prod-badge-sale' : 'tp-prod-badge-organic'}`}>{p.badge}</span>
                      )}
                      <Link to={`/san-pham/${p.slug}`}><img src={p.image} alt={p.name} loading="lazy" /></Link>
                      <span
                        className="tp-prod-quickadd"
                        onClick={() => addItem({ product_id: p.id, name: p.name, slug: p.slug, image: p.image, price: p.price_sale || p.price })}
                      ><i className="bi bi-plus-lg" /></span>
                    </div>
                    <div className="tp-prod-info">
                      <div className="tp-prod-cat">{p.category_name}</div>
                      <Link to={`/san-pham/${p.slug}`} className="tp-prod-name" style={{ display: 'block' }}>{p.name}</Link>
                      <div className="tp-prod-footer">
                        <div className="tp-prod-price">
                          <span className="tp-price-now">{fmt(p.price_sale || p.price)}</span>
                          {!!p.price_sale && <span className="tp-price-old">{fmt(p.price)}</span>}
                        </div>
                        <div className="tp-prod-rating"><i className="bi bi-star-fill" /> {p.rating.toFixed(1)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <nav className="tp-pagination" aria-label="Phân trang">
                <button className="tp-page-btn" aria-label="Trang trước" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
                  <i className="bi bi-chevron-left" />
                </button>
                {pageNumbers().map((n, i) => n === '…' ? (
                  <span key={`e${i}`} style={{ display: 'flex', alignItems: 'center', color: 'var(--text-3)' }}>…</span>
                ) : (
                  <button key={n} className={`tp-page-btn${page === n ? ' tp-active' : ''}`} aria-current={page === n ? 'page' : undefined} onClick={() => setPage(n as number)}>{n}</button>
                ))}
                <button className="tp-page-btn" aria-label="Trang sau" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
                  <i className="bi bi-chevron-right" />
                </button>
              </nav>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
