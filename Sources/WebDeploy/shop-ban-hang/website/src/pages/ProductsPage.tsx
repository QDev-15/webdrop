import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'

interface Product {
  id: number
  name: string
  slug: string
  category_name: string
  image: string
  price: number
  price_sale: number
  badge: string
  colors: string
  rating: number
  in_stock: number
  is_featured: number
  is_new: number
  status: string
}

const PER_PAGE = 12
const COLOR_SWATCHES = [
  { name: 'Terracotta', hex: '#c4603a' },
  { name: 'Sage',       hex: '#6b8a7a' },
  { name: 'Kem',        hex: '#f7f3ee' },
  { name: 'Đen',        hex: '#1e1610' },
  { name: 'Trắng',      hex: '#ffffff' },
  { name: 'Nâu',        hex: '#8b6f5e' },
]

export default function ProductsPage() {
  const { categories } = useSite()
  const { addItem } = useCart()

  const [tab, setTab] = useState<'all' | 'sale' | number>('all')
  const [searchInput, setSearchInput] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [categoryIds, setCategoryIds] = useState<number[]>([])
  const [minPrice, setMinPrice] = useState('0')
  const [maxPrice, setMaxPrice] = useState('1000000')
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [minRating, setMinRating] = useState<number | null>(null)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [saleOnly, setSaleOnly] = useState(false)
  const [newOnly, setNewOnly] = useState(false)
  const [sort, setSort] = useState('default')
  const [page, setPage] = useState(1)

  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [wishlist, setWishlist] = useState<number[]>([])

  // Áp dụng: draft state (sidebar) chỉ push vào query khi bấm "Áp dụng bộ lọc"
  // (saleOnly là ngoại lệ có chủ đích — tab bar "Đang giảm giá" cần áp dụng tức thời)
  const [appliedColors, setAppliedColors] = useState<string[]>([])
  const [appliedRating, setAppliedRating] = useState<number | null>(null)
  const [appliedInStock, setAppliedInStock] = useState(false)
  const [appliedSaleOnly, setAppliedSaleOnly] = useState(false)
  const [appliedNew, setAppliedNew] = useState(false)
  const [appliedMinPrice, setAppliedMinPrice] = useState('0')
  const [appliedMaxPrice, setAppliedMaxPrice] = useState('1000000')
  const [appliedCategoryIds, setAppliedCategoryIds] = useState<number[]>([])

  // Search gõ-là-tự-tìm (debounce 400ms) — không cần bấm "Áp dụng bộ lọc" như các filter khác
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
    if (appliedColors.length) params.set('colors', appliedColors.join(','))
    if (appliedRating !== null) params.set('min_rating', String(appliedRating))
    if (appliedInStock) params.set('in_stock', '1')
    if (appliedSaleOnly) params.set('sale', '1')
    if (appliedNew) params.set('is_new', '1')
    params.set('sort', sort)
    params.set('page', String(page))
    params.set('per_page', String(PER_PAGE))
    return params.toString()
  }, [appliedSearch, appliedCategoryIds, appliedMinPrice, appliedMaxPrice, appliedColors, appliedRating, appliedInStock, appliedSaleOnly, appliedNew, sort, page])

  useEffect(() => {
    setLoading(true)
    api.getPaged<Product[]>(`/public/products?${query}`)
      .then(({ data, total }) => { setProducts(data); setTotal(total) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [query])

  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
  const rangeStart = total === 0 ? 0 : (page - 1) * PER_PAGE + 1
  const rangeEnd = Math.min(total, page * PER_PAGE)

  const selectTab = (t: 'all' | 'sale' | number) => {
    setTab(t)
    setPage(1)
    if (t === 'all') {
      setSaleOnly(false); setAppliedSaleOnly(false); setAppliedCategoryIds([]); setCategoryIds([])
    } else if (t === 'sale') {
      setSaleOnly(true); setAppliedSaleOnly(true); setAppliedCategoryIds([]); setCategoryIds([])
    } else {
      setSaleOnly(false); setAppliedSaleOnly(false); setAppliedCategoryIds([t]); setCategoryIds([t])
    }
  }

  const toggleCategory = (id: number) => {
    setCategoryIds(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
  }

  const toggleColor = (name: string) => {
    setSelectedColors(prev => prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name])
  }

  const applyFilters = () => {
    setAppliedCategoryIds(categoryIds)
    setAppliedMinPrice(minPrice)
    setAppliedMaxPrice(maxPrice)
    setAppliedColors(selectedColors)
    setAppliedRating(minRating)
    setAppliedInStock(inStockOnly)
    setAppliedSaleOnly(saleOnly)
    setAppliedNew(newOnly)
    setPage(1)
    if (categoryIds.length !== 1) setTab(categoryIds.length === 0 ? 'all' : tab)
  }

  const resetFilters = () => {
    setSearchInput(''); setAppliedSearch('')
    setCategoryIds([]); setMinPrice('0'); setMaxPrice('1000000')
    setSelectedColors([]); setMinRating(null); setInStockOnly(false); setNewOnly(false)
    setAppliedCategoryIds([]); setAppliedMinPrice('0'); setAppliedMaxPrice('1000000')
    setAppliedColors([]); setAppliedRating(null); setAppliedInStock(false); setAppliedNew(false)
    setSaleOnly(false); setAppliedSaleOnly(false); setSort('default'); setTab('all'); setPage(1)
  }

  const toggleWishlist = (id: number) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id])
  }

  const pageNumbers = (): (number | '…')[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (page <= 3) return [1, 2, 3, '…', totalPages]
    if (page >= totalPages - 2) return [1, '…', totalPages - 2, totalPages - 1, totalPages]
    return [1, '…', page, '…', totalPages]
  }

  return (
    <>
      <div className="sb-page-header">
        <div className="sb-container">
          <div className="sb-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>›</span>
            <span>Sản phẩm</span>
          </div>
          <h1 className="sb-page-title">Tất cả sản phẩm</h1>
          <p className="sb-page-count">Hiển thị <strong>{rangeStart}–{rangeEnd}</strong> trong số <strong>{total}</strong> sản phẩm</p>
        </div>
      </div>

      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
        <div className="sb-container" style={{ display: 'flex', gap: 0, whiteSpace: 'nowrap' }}>
          <button className={`sb-tab-btn ${tab === 'all' ? 'active' : ''}`} style={{ padding: '16px 20px' }} onClick={() => selectTab('all')}>Tất cả</button>
          {categories.map(cat => (
            <button key={cat.id} className={`sb-tab-btn ${tab === cat.id ? 'active' : ''}`} style={{ padding: '16px 20px' }} onClick={() => selectTab(cat.id)}>{cat.name}</button>
          ))}
          <button className={`sb-tab-btn ${tab === 'sale' ? 'active' : ''}`} style={{ padding: '16px 20px' }} onClick={() => selectTab('sale')}>Đang giảm giá</button>
        </div>
      </div>

      <main>
        <div className="sb-container">
          <div className="sb-shop-layout">
            <aside className="sb-filter-sidebar">
              <div className="sb-filter-block">
                <div className="sb-filter-title">Tìm kiếm</div>
                <div className="sb-search-box">
                  <i className="bi bi-search" aria-hidden="true" />
                  <input
                    type="search"
                    className="sb-search-input"
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    placeholder="Tìm theo tên sản phẩm..."
                    aria-label="Tìm kiếm sản phẩm"
                  />
                </div>
              </div>

              <div className="sb-filter-block">
                <div className="sb-filter-title">Mức giá</div>
                <div className="sb-filter-price-range">
                  <input type="number" value={minPrice} min={0} onChange={e => setMinPrice(e.target.value)} aria-label="Giá thấp nhất" />
                  <span>—</span>
                  <input type="number" value={maxPrice} min={0} onChange={e => setMaxPrice(e.target.value)} aria-label="Giá cao nhất" />
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>đ</span>
                </div>
              </div>

              <div className="sb-filter-block">
                <div className="sb-filter-title">Danh mục</div>
                <div className="sb-filter-options">
                  {categories.map(cat => (
                    <label key={cat.id} className="sb-filter-opt">
                      <input type="checkbox" checked={categoryIds.includes(cat.id)} onChange={() => toggleCategory(cat.id)} />
                      <span>{cat.name} ({cat.product_count})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="sb-filter-block">
                <div className="sb-filter-title">Màu sắc</div>
                <div className="sb-color-swatches">
                  {COLOR_SWATCHES.map(c => (
                    <div
                      key={c.name}
                      className={`sb-color-swatch ${selectedColors.includes(c.name) ? 'selected' : ''}`}
                      style={{ background: c.hex, border: c.hex === '#ffffff' ? '1px solid var(--border)' : undefined }}
                      title={c.name}
                      role="button"
                      tabIndex={0}
                      aria-label={`Lọc màu ${c.name}`}
                      onClick={() => toggleColor(c.name)}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') toggleColor(c.name) }}
                    />
                  ))}
                </div>
              </div>

              <div className="sb-filter-block">
                <div className="sb-filter-title">Đánh giá</div>
                <div className="sb-filter-options">
                  {[5, 4, 3].map(star => (
                    <label key={star} className="sb-filter-opt">
                      <input type="checkbox" checked={minRating === star} onChange={() => setMinRating(minRating === star ? null : star)} />
                      <span style={{ color: '#f59e0b' }}>{'★'.repeat(star)}</span>
                      <span style={{ color: 'var(--text-3)' }}>{'☆'.repeat(5 - star)}</span>
                      <span>{star === 5 ? ' (5 sao)' : ` (${star}+ sao)`}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="sb-filter-block">
                <div className="sb-filter-title">Tình trạng</div>
                <div className="sb-filter-options">
                  <label className="sb-filter-opt">
                    <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} /> Còn hàng
                  </label>
                  <label className="sb-filter-opt">
                    <input type="checkbox" checked={saleOnly} onChange={e => setSaleOnly(e.target.checked)} /> Đang giảm giá
                  </label>
                  <label className="sb-filter-opt">
                    <input type="checkbox" checked={newOnly} onChange={e => setNewOnly(e.target.checked)} /> Hàng mới
                  </label>
                </div>
              </div>

              <button type="button" className="sb-btn sb-btn-outline w-100" style={{ marginTop: 8 }} onClick={applyFilters}>
                Áp dụng bộ lọc
              </button>
              <button type="button" className="sb-btn sb-btn-ghost w-100" style={{ marginTop: 8 }} onClick={resetFilters}>
                Xóa bộ lọc
              </button>
            </aside>

            <div>
              <div className="sb-shop-top">
                <div style={{ fontSize: 14, color: 'var(--text-2)' }}>
                  Tìm thấy <strong>{total}</strong> sản phẩm
                </div>
                <div className="d-flex align-items-center gap-2">
                  <label htmlFor="sort-select" style={{ fontSize: 14, color: 'var(--text-2)', whiteSpace: 'nowrap' }}>Sắp xếp:</label>
                  <select id="sort-select" className="sb-sort-select" value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}>
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
                <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-3)' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                  <p>{appliedSearch ? `Không tìm thấy sản phẩm nào khớp với "${appliedSearch}"` : 'Không có sản phẩm nào khớp bộ lọc'}</p>
                </div>
              ) : (
                <div className="sb-prod-grid">
                  {products.map(p => (
                    <div key={p.id} className="sb-prod-card" data-reveal>
                      <div className="sb-prod-img">
                        <Link to={`/san-pham/${p.slug}`}>
                          {p.image ? (
                            <img src={p.image} alt={p.name} loading="lazy" />
                          ) : (
                            <div style={{ aspectRatio: '1', background: 'var(--cream-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🛍</div>
                          )}
                        </Link>
                        {p.badge && <div className={`sb-prod-badge ${p.is_new ? 'new' : ''}`}>{p.badge}</div>}
                        <div className="sb-prod-actions">
                          <button className="sb-prod-action-btn" aria-label="Yêu thích" onClick={() => toggleWishlist(p.id)}>
                            <i className={`bi ${wishlist.includes(p.id) ? 'bi-heart-fill' : 'bi-heart'}`} />
                          </button>
                          <Link to={`/san-pham/${p.slug}`} className="sb-prod-action-btn" aria-label="Xem chi tiết">
                            <i className="bi bi-eye" />
                          </Link>
                        </div>
                      </div>
                      <div className="sb-prod-info">
                        <div className="sb-prod-cat">{p.category_name}</div>
                        <h3 className="sb-prod-name"><Link to={`/san-pham/${p.slug}`}>{p.name}</Link></h3>
                        <div className="sb-prod-footer">
                          <div className="sb-prod-price">
                            <span className="sb-prod-price-new">{fmt(p.price_sale || p.price)}</span>
                            {p.price_sale > 0 && p.price_sale < p.price && <span className="sb-prod-price-old">{fmt(p.price)}</span>}
                          </div>
                          <button
                            className="sb-add-cart"
                            aria-label="Thêm vào giỏ hàng"
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
                <nav className="sb-pagination" aria-label="Phân trang">
                  <button className="sb-page-btn" aria-label="Trang trước" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
                    <i className="bi bi-chevron-left" />
                  </button>
                  {pageNumbers().map((n, i) => n === '…' ? (
                    <span key={`e${i}`} className="sb-page-btn" style={{ pointerEvents: 'none', border: 'none', color: 'var(--text-3)' }}>…</span>
                  ) : (
                    <button key={n} className={`sb-page-btn ${page === n ? 'active' : ''}`} aria-current={page === n ? 'page' : undefined} onClick={() => setPage(n as number)}>
                      {n}
                    </button>
                  ))}
                  <button className="sb-page-btn" aria-label="Trang tiếp" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
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
