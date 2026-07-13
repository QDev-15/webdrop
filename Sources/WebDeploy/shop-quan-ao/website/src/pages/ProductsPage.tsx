import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import { useSite, type Product } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'

const PER_PAGE = 12

// Phải khớp 100% với COLOR_SWATCHES ở admin/src/pages/products/ProductForm.tsx
const COLOR_SWATCHES = [
  { name: 'Lavender', hex: '#b98bd1' },
  { name: 'Butter', hex: '#f2c14e' },
  { name: 'Blush', hex: '#f7d8de' },
  { name: 'Trắng', hex: '#ffffff' },
  { name: 'Đen', hex: '#2b2230' },
]

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'One Size']

export default function ProductsPage() {
  const { categories } = useSite()
  const { addItem } = useCart()
  const [searchParams] = useSearchParams()

  const [tab, setTab] = useState<'all' | 'sale' | number>('all')

  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [categoryIds, setCategoryIds] = useState<number[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
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
  const [appliedSizes, setAppliedSizes] = useState<string[]>([])
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

  const query = useMemo(() => {
    const params = new URLSearchParams()
    if (appliedCategoryIds.length) params.set('category_ids', appliedCategoryIds.join(','))
    if (appliedMinPrice) params.set('min_price', appliedMinPrice)
    if (appliedMaxPrice) params.set('max_price', appliedMaxPrice)
    if (appliedSizes.length) params.set('sizes', appliedSizes.join(','))
    if (appliedColors.length) params.set('colors', appliedColors.join(','))
    if (appliedMinRating !== null) params.set('min_rating', String(appliedMinRating))
    if (appliedInStock) params.set('in_stock', '1')
    if (appliedSale) params.set('sale', '1')
    if (appliedNew) params.set('is_new', '1')
    params.set('sort', sort)
    params.set('page', String(page))
    params.set('per_page', String(PER_PAGE))
    return params.toString()
  }, [appliedCategoryIds, appliedMinPrice, appliedMaxPrice, appliedSizes, appliedColors, appliedMinRating, appliedInStock, appliedSale, appliedNew, sort, page])

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
  const toggleSize = (s: string) => setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  const toggleColor = (name: string) => setSelectedColors(prev => prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name])

  const applyFilters = () => {
    setAppliedMinPrice(minPrice)
    setAppliedMaxPrice(maxPrice)
    setAppliedCategoryIds(categoryIds)
    setAppliedSizes(selectedSizes)
    setAppliedColors(selectedColors)
    setAppliedMinRating(minRating)
    setAppliedInStock(inStockOnly)
    setAppliedSale(saleOnly)
    setAppliedNew(newOnly)
    setPage(1)
    setTab(categoryIds.length === 1 ? categoryIds[0] : saleOnly ? 'sale' : 'all')
  }

  const clearFilters = () => {
    setMinPrice(''); setAppliedMinPrice('')
    setMaxPrice(''); setAppliedMaxPrice('')
    setCategoryIds([]); setAppliedCategoryIds([])
    setSelectedSizes([]); setAppliedSizes([])
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
      <div className="qa-page-header">
        <div className="qa-container">
          <nav className="qa-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Trang chủ</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span><span>Sản phẩm</span>
          </nav>
          <h1 className="qa-page-title">Tất cả sản phẩm</h1>
          <p className="qa-page-count">Hiển thị <strong>{rangeStart}–{rangeEnd}</strong> trong số <strong>{total}</strong> sản phẩm</p>
        </div>
      </div>

      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', overflowX: 'auto', scrollbarWidth: 'none' }}>
        <div className="qa-container" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
          <button className={`qa-tab-btn${tab === 'all' ? ' active' : ''}`} onClick={() => selectTab('all')}>Tất cả</button>
          {categories.map(c => (
            <button key={c.id} className={`qa-tab-btn${tab === c.id ? ' active' : ''}`} onClick={() => selectTab(c.id)}>{c.name}</button>
          ))}
          <button className={`qa-tab-btn${tab === 'sale' ? ' active' : ''}`} onClick={() => selectTab('sale')}>Đang giảm giá</button>
        </div>
      </div>

      <main>
        <div className="qa-container">
          <div className="qa-shop-layout">
            <aside className="qa-filter-sidebar">
              <div className="qa-filter-block">
                <div className="qa-filter-title">Mức giá</div>
                <div className="qa-filter-price-range">
                  <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} min={0} aria-label="Giá thấp nhất" placeholder="0" />
                  <span>—</span>
                  <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} min={0} aria-label="Giá cao nhất" placeholder="1.500.000" />
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>đ</span>
                </div>
              </div>

              <div className="qa-filter-block">
                <div className="qa-filter-title">Danh mục</div>
                <div className="qa-filter-options">
                  {categories.map(cat => (
                    <label className="qa-filter-opt" key={cat.id}>
                      <input type="checkbox" checked={categoryIds.includes(cat.id)} onChange={() => toggleCategory(cat.id)} />
                      {cat.name} ({cat.product_count})
                    </label>
                  ))}
                </div>
              </div>

              <div className="qa-filter-block">
                <div className="qa-filter-title">Kích cỡ</div>
                <div className="qa-size-swatches">
                  {SIZE_OPTIONS.map(s => (
                    <div
                      key={s}
                      className={`qa-size-swatch${selectedSizes.includes(s) ? ' selected' : ''}`}
                      role="button"
                      tabIndex={0}
                      aria-pressed={selectedSizes.includes(s)}
                      onClick={() => toggleSize(s)}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSize(s) } }}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              <div className="qa-filter-block">
                <div className="qa-filter-title">Màu sắc</div>
                <div className="qa-color-swatches">
                  {COLOR_SWATCHES.map(c => (
                    <div
                      key={c.name}
                      className={`qa-color-swatch${selectedColors.includes(c.name) ? ' selected' : ''}`}
                      style={{ background: c.hex, borderColor: c.hex === '#ffffff' && !selectedColors.includes(c.name) ? 'var(--border)' : undefined }}
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

              <div className="qa-filter-block">
                <div className="qa-filter-title">Đánh giá</div>
                <div className="qa-filter-options">
                  {[5, 4, 3].map(r => (
                    <label className="qa-filter-opt" key={r}>
                      <input type="radio" name="min-rating" checked={minRating === r} onChange={() => setMinRating(minRating === r ? null : r)} />
                      {'★'.repeat(r)}{'☆'.repeat(5 - r)} {r === 5 ? '' : 'trở lên'}
                    </label>
                  ))}
                </div>
              </div>

              <div className="qa-filter-block">
                <div className="qa-filter-title">Tình trạng</div>
                <div className="qa-filter-options">
                  <label className="qa-filter-opt"><input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} /> Còn hàng</label>
                  <label className="qa-filter-opt"><input type="checkbox" checked={saleOnly} onChange={e => setSaleOnly(e.target.checked)} /> Đang giảm giá</label>
                  <label className="qa-filter-opt"><input type="checkbox" checked={newOnly} onChange={e => setNewOnly(e.target.checked)} /> Hàng mới</label>
                </div>
              </div>

              <button className="qa-btn qa-btn-outline w-100" style={{ marginTop: 8, justifyContent: 'center' }} onClick={applyFilters}>Áp dụng bộ lọc</button>
              <button className="qa-btn qa-btn-ghost w-100" style={{ marginTop: 8, justifyContent: 'center' }} onClick={clearFilters}>Xóa bộ lọc</button>
            </aside>

            <div>
              <div className="qa-shop-top">
                <div style={{ fontSize: 14, color: 'var(--text-2)' }}>Tìm thấy <strong style={{ color: 'var(--text)' }}>{total}</strong> sản phẩm</div>
                <div className="d-flex align-items-center gap-2">
                  <label htmlFor="sort-select" style={{ fontSize: 14, color: 'var(--text-2)' }}>Sắp xếp:</label>
                  <select id="sort-select" className="qa-sort-select" value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}>
                    <option value="default">Nổi bật nhất</option>
                    <option value="new">Mới nhất</option>
                    <option value="price-asc">Giá: Thấp đến cao</option>
                    <option value="price-desc">Giá: Cao đến thấp</option>
                    <option value="rating">Đánh giá cao nhất</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-3)' }}>Đang tải sản phẩm...</div>
              ) : products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-3)' }}>Không tìm thấy sản phẩm nào khớp bộ lọc</div>
              ) : (
                <div className="qa-prod-grid">
                  {products.map(p => (
                    <div className="qa-prod-card" data-reveal key={p.id}>
                      <div className="qa-prod-thumb">
                        <Link to={`/san-pham/${p.slug}`}><img src={p.image} alt={p.name} loading="lazy" /></Link>
                        {p.badge && <div className={`qa-prod-badge${p.is_new ? ' new' : p.price_sale ? ' sale' : ''}`}>{p.badge}</div>}
                        <div className="qa-prod-actions">
                          <button className="qa-prod-action-btn" aria-label="Yêu thích"><i className="bi bi-heart" /></button>
                          <Link to={`/san-pham/${p.slug}`} className="qa-prod-action-btn" aria-label="Xem chi tiết"><i className="bi bi-eye" /></Link>
                        </div>
                      </div>
                      <div className="qa-prod-info">
                        <div className="qa-prod-cat">{p.category_name}</div>
                        <h3 className="qa-prod-name"><Link to={`/san-pham/${p.slug}`}>{p.name}</Link></h3>
                        <div className="qa-prod-footer">
                          <div>
                            <span className="qa-prod-price-new">{fmt(p.price_sale || p.price)}</span>
                            {!!p.price_sale && <span className="qa-prod-price-old">{fmt(p.price)}</span>}
                          </div>
                          <button
                            className="qa-add-cart"
                            aria-label="Thêm vào giỏ"
                            disabled={!p.in_stock}
                            onClick={() => addItem({ product_id: p.id, name: p.name, slug: p.slug, image: p.image, price: p.price_sale || p.price })}
                          >
                            <i className="bi bi-bag-plus" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <nav className="qa-pagination" aria-label="Phân trang">
                  <button className="qa-page-btn" aria-label="Trang trước" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
                    <i className="bi bi-chevron-left" />
                  </button>
                  {pageNumbers().map((n, i) => n === '…' ? (
                    <span key={`e${i}`} className="qa-page-btn" style={{ pointerEvents: 'none', border: 'none', color: 'var(--text-3)' }}>…</span>
                  ) : (
                    <button key={n} className={`qa-page-btn${page === n ? ' active' : ''}`} aria-current={page === n ? 'page' : undefined} onClick={() => setPage(n as number)}>{n}</button>
                  ))}
                  <button className="qa-page-btn" aria-label="Trang tiếp" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
                    <i className="bi bi-chevron-right" />
                  </button>
                </nav>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
