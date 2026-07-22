import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import { useCart } from '../contexts/CartContext'
import { useSite, type Product } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const PER_PAGE = 9

// Phải khớp 100% với COLOR_SWATCHES ở admin/src/pages/products/ProductForm.tsx
const COLOR_SWATCHES = [
  { name: 'Đen', hex: '#1c1c1c' },
  { name: 'Bạc', hex: '#c7c9cb' },
  { name: 'Trắng', hex: '#f2f1ec' },
  { name: 'Xanh rêu', hex: '#5c6650' },
]

// Phải khớp BRAND_OPTIONS ở admin/src/pages/products/ProductForm.tsx
const BRAND_OPTIONS = ['Sony', 'Canon', 'Fujifilm', 'Nikon']

const MAX_PRICE = 60000000

// san-pham.html KHÔNG có block "Đánh giá" trong sidebar (chỉ 6 block: Tìm kiếm/Danh mục/Khoảng giá/
// Màu thân máy/Thương hiệu/Tình trạng) — khác blueprint 5-block chuẩn rule 22, tương tự shop-tui-sach/shop-may-tinh.
export default function ProductsPage() {
  useDocumentMeta({
    title: 'Sản Phẩm — PhotoPro Máy Ảnh & Thiết Bị Nhiếp Ảnh',
    description: 'Danh sách máy ảnh, ống kính, tripod và phụ kiện nhiếp ảnh chính hãng — lọc theo danh mục, giá, màu thân máy, tình trạng.',
  })

  const { categories } = useSite()
  const { addItem } = useCart()
  const [searchParams] = useSearchParams()

  const [tab, setTab] = useState<'all' | 'sale' | number>('all')

  const [searchInput, setSearchInput] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')

  const [minPrice, setMinPrice] = useState('0')
  const [maxPrice, setMaxPrice] = useState(String(MAX_PRICE))
  const [categoryIds, setCategoryIds] = useState<number[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [newOnly, setNewOnly] = useState(false)
  const [saleOnly, setSaleOnly] = useState(false)
  const [sort, setSort] = useState('default')
  const [page, setPage] = useState(1)

  const [appliedMinPrice, setAppliedMinPrice] = useState('')
  const [appliedMaxPrice, setAppliedMaxPrice] = useState('')
  const [appliedCategoryIds, setAppliedCategoryIds] = useState<number[]>([])
  const [appliedColors, setAppliedColors] = useState<string[]>([])
  const [appliedBrands, setAppliedBrands] = useState<string[]>([])
  const [appliedInStock, setAppliedInStock] = useState(false)
  const [appliedNew, setAppliedNew] = useState(false)
  const [appliedSale, setAppliedSale] = useState(false)

  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  // Đọc ?cat=slug hoặc ?q= từ URL khi vào trang lần đầu (link từ Header/Footer/HomePage)
  useEffect(() => {
    const catSlug = searchParams.get('cat')
    const qParam = searchParams.get('q')
    if (qParam) { setSearchInput(qParam); setAppliedSearch(qParam) }
    if (catSlug && categories.length > 0) {
      const cat = categories.find(c => c.slug === catSlug)
      if (cat) { setTab(cat.id); setCategoryIds([cat.id]); setAppliedCategoryIds([cat.id]) }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories.length])

  // Debounce ô tìm kiếm 400ms trước khi áp dụng vào query
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
    if (appliedBrands.length) params.set('brands', appliedBrands.join(','))
    if (appliedInStock) params.set('in_stock', '1')
    if (appliedNew) params.set('is_new', '1')
    if (appliedSale) params.set('sale', '1')
    params.set('sort', sort)
    params.set('page', String(page))
    params.set('per_page', String(PER_PAGE))
    return params.toString()
  }, [appliedSearch, appliedCategoryIds, appliedMinPrice, appliedMaxPrice, appliedColors, appliedBrands, appliedInStock, appliedNew, appliedSale, sort, page])

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
  const toggleColor = (name: string) => setSelectedColors(prev => prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name])
  const toggleBrand = (name: string) => setSelectedBrands(prev => prev.includes(name) ? prev.filter(b => b !== name) : [...prev, name])

  const applyFilters = () => {
    setAppliedMinPrice(minPrice)
    setAppliedMaxPrice(maxPrice)
    setAppliedCategoryIds(categoryIds)
    setAppliedColors(selectedColors)
    setAppliedBrands(selectedBrands)
    setAppliedInStock(inStockOnly)
    setAppliedNew(newOnly)
    setAppliedSale(saleOnly)
    setPage(1)
    setTab(categoryIds.length === 1 ? categoryIds[0] : saleOnly ? 'sale' : 'all')
  }

  const clearFilters = () => {
    setSearchInput(''); setAppliedSearch('')
    setMinPrice('0'); setAppliedMinPrice('')
    setMaxPrice(String(MAX_PRICE)); setAppliedMaxPrice('')
    setCategoryIds([]); setAppliedCategoryIds([])
    setSelectedColors([]); setAppliedColors([])
    setSelectedBrands([]); setAppliedBrands([])
    setInStockOnly(false); setAppliedInStock(false)
    setNewOnly(false); setAppliedNew(false)
    setSaleOnly(false); setAppliedSale(false)
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
      <section className="ma-page-hero">
        <div className="ma-container">
          <div className="ma-breadcrumb">
            <Link to="/">Trang chủ</Link><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /><span>Sản phẩm</span>
          </div>
          <h1 className="ma-page-title">Tất cả sản phẩm</h1>
          <p className="ma-page-count">Hiển thị <strong>{rangeStart}–{rangeEnd}</strong> trong số <strong>{total}</strong> thiết bị nhiếp ảnh</p>
        </div>
      </section>

      <div className="ma-container">
        <div className="ma-cat-tabs" role="group" aria-label="Lọc theo danh mục">
          <button type="button" className={'ma-cat-tab' + (tab === 'all' ? ' ma-active' : '')} onClick={() => selectTab('all')}>Tất cả</button>
          {categories.map(c => (
            <button key={c.id} type="button" className={'ma-cat-tab' + (tab === c.id ? ' ma-active' : '')} onClick={() => selectTab(c.id)}>{c.name}</button>
          ))}
          <button type="button" className={'ma-cat-tab' + (tab === 'sale' ? ' ma-active' : '')} onClick={() => selectTab('sale')}>Đang giảm giá</button>
        </div>

        <div className="ma-shop-layout">
          <aside className="ma-filter-sidebar" aria-label="Bộ lọc sản phẩm">
            <div className="ma-filter-hd">
              Bộ lọc
              <span className="ma-filter-clear" role="button" tabIndex={0} onClick={clearFilters}>Xóa lọc</span>
            </div>

            <div className="ma-filter-block">
              <div className="ma-filter-title">Tìm kiếm</div>
              <div className="ma-search-box">
                <i className="bi bi-search" aria-hidden="true" />
                <input
                  type="search"
                  className="ma-search-input"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Tìm theo tên sản phẩm..."
                  aria-label="Tìm kiếm sản phẩm"
                />
              </div>
            </div>

            <div className="ma-filter-block">
              <div className="ma-filter-title">Danh mục</div>
              <div className="ma-filter-opts">
                {categories.map(c => (
                  <label className="ma-filter-opt" key={c.id}>
                    <input type="checkbox" checked={categoryIds.includes(c.id)} onChange={() => toggleCategory(c.id)} /> {c.name} <span className="ma-count">{c.product_count}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="ma-filter-block">
              <div className="ma-filter-title">Khoảng giá</div>
              <div className="ma-price-range">
                <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} min={0} aria-label="Giá thấp nhất" />
                <span>—</span>
                <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} min={0} aria-label="Giá cao nhất" />
              </div>
            </div>

            <div className="ma-filter-block">
              <div className="ma-filter-title">Màu thân máy</div>
              <div className="ma-swatch-row">
                {COLOR_SWATCHES.map(c => (
                  <button
                    type="button"
                    key={c.name}
                    className={'ma-filter-swatch' + (selectedColors.includes(c.name) ? ' ma-selected' : '')}
                    style={{ background: c.hex, ...(c.hex === '#f2f1ec' ? { borderColor: '#d7dbdc' } : {}) }}
                    aria-label={`Màu ${c.name}`}
                    aria-pressed={selectedColors.includes(c.name)}
                    onClick={() => toggleColor(c.name)}
                  />
                ))}
              </div>
            </div>

            <div className="ma-filter-block">
              <div className="ma-filter-title">Thương hiệu</div>
              <div className="ma-filter-opts">
                {BRAND_OPTIONS.map(b => (
                  <label className="ma-filter-opt" key={b}>
                    <input type="checkbox" checked={selectedBrands.includes(b)} onChange={() => toggleBrand(b)} /> {b}
                  </label>
                ))}
              </div>
            </div>

            <div className="ma-filter-block">
              <div className="ma-filter-title">Tình trạng</div>
              <div className="ma-filter-opts">
                <label className="ma-filter-opt"><input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} /> Còn hàng</label>
                <label className="ma-filter-opt"><input type="checkbox" checked={newOnly} onChange={e => setNewOnly(e.target.checked)} /> Hàng mới 100%</label>
                <label className="ma-filter-opt"><input type="checkbox" checked={saleOnly} onChange={e => setSaleOnly(e.target.checked)} /> Đang khuyến mãi</label>
              </div>
            </div>

            <button type="button" className="ma-btn ma-btn-dark ma-btn-full" style={{ marginTop: 8, justifyContent: 'center' }} onClick={applyFilters}>Áp dụng bộ lọc</button>
            <button type="button" className="ma-btn ma-btn-ghost ma-btn-full" style={{ marginTop: 8, justifyContent: 'center' }} onClick={clearFilters}>Xóa bộ lọc</button>
          </aside>

          <div>
            <div className="ma-shop-top">
              <span className="ma-result-count">Tìm thấy {total} sản phẩm</span>
              <select className="ma-sort-select" aria-label="Sắp xếp" value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}>
                <option value="new">Mới nhất</option>
                <option value="default">Bán chạy nhất</option>
                <option value="price-asc">Giá: Thấp đến cao</option>
                <option value="price-desc">Giá: Cao đến thấp</option>
              </select>
            </div>

            {loading ? (
              <div className="ma-search-empty">Đang tải sản phẩm...</div>
            ) : products.length === 0 ? (
              <div className="ma-search-empty">{appliedSearch ? `Không tìm thấy sản phẩm nào khớp với "${appliedSearch}"` : 'Không tìm thấy sản phẩm nào khớp bộ lọc'}</div>
            ) : (
              <div className="ma-prod-grid">
                {products.map(p => (
                  <Link to={`/san-pham/${p.slug}`} className="ma-prod-card" key={p.id}>
                    <div className="ma-prod-thumb">
                      {p.badge && <span className={'ma-prod-badge ' + (p.price_sale ? 'ma-prod-badge-sale' : p.is_new ? 'ma-prod-badge-new' : 'ma-prod-badge-hot')}>{p.badge}</span>}
                      <img src={p.image} alt={p.name} loading="lazy" />
                      <span
                        className="ma-prod-quickadd"
                        role="button"
                        tabIndex={0}
                        aria-label="Thêm nhanh vào giỏ"
                        onClick={e => { e.preventDefault(); addItem({ product_id: p.id, name: p.name, slug: p.slug, image: p.image, price: p.price_sale || p.price }) }}
                      ><i className="bi bi-plus-lg" /></span>
                    </div>
                    <div className="ma-prod-info">
                      <div className="ma-prod-cat">{p.category_name}{!p.in_stock ? ' · Hết hàng' : ''}</div>
                      <div className="ma-prod-name">{p.name}</div>
                      <div className="ma-prod-footer">
                        <div className="ma-prod-price">
                          <span className="ma-price-now">{fmt(p.price_sale || p.price)}</span>
                          {!!p.price_sale && <span className="ma-price-old">{fmt(p.price)}</span>}
                        </div>
                        {p.rating > 0 && <div className="ma-prod-rating"><i className="bi bi-star-fill" /> {p.rating}</div>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="ma-pagination">
                <span
                  role="button" tabIndex={0} className="ma-page-btn" aria-label="Trang trước"
                  style={page === 1 ? { opacity: 0.4, pointerEvents: 'none' } : undefined}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                ><i className="bi bi-chevron-left" /></span>
                {pageNumbers().map((n, i) => n === '…' ? (
                  <span key={`e${i}`} className="ma-page-btn" style={{ pointerEvents: 'none' }}>…</span>
                ) : (
                  <span
                    key={n}
                    role="button" tabIndex={0}
                    className={'ma-page-btn' + (page === n ? ' ma-active' : '')}
                    aria-current={page === n ? 'page' : undefined}
                    onClick={() => setPage(n as number)}
                  >{n}</span>
                ))}
                <span
                  role="button" tabIndex={0} className="ma-page-btn" aria-label="Trang sau"
                  style={page === totalPages ? { opacity: 0.4, pointerEvents: 'none' } : undefined}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                ><i className="bi bi-chevron-right" /></span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
