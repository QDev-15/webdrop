import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useSite, parseColorNames } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const ITEMS_PER_PAGE = 12

interface FilterState {
  search: string
  categories: string[]
  priceMax: number
  sizes: string[]
  colors: string[]
  brands: string[]
  sort: 'newest' | 'price-asc' | 'price-desc' | 'bestseller' | 'rating'
  page: number
}

export default function HomePage() {
  const { products, categories } = useSite()
  const { addItem } = useCart()
  const [searchParams] = useSearchParams()
  useDocumentMeta({ title: 'Shop Thể Thao — Đồ Thể Thao & Gym Chính Hãng', description: '40 sản phẩm thể thao & gym chính hãng. Quần áo thể thao, giày chạy bộ, dụng cụ tập gym, yoga & pilates. Miễn phí ship đơn từ 500K.' })

  const [filter, setFilter] = useState<FilterState>({
    search: searchParams.get('q') || '',
    categories: [],
    priceMax: 2000000,
    sizes: [],
    colors: [],
    brands: [],
    sort: 'newest',
    page: 1,
  })

  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'

  // Filter products
  const filtered = useMemo(() => {
    return products.filter((p: typeof products[0]) => {
      if (filter.search && !p.name.toLowerCase().includes(filter.search.toLowerCase())) return false
      if (filter.categories.length && !filter.categories.includes(p.category_slug || '')) return false
      const price = p.price_sale || p.price
      if (price > filter.priceMax) return false
      if (filter.sizes.length && (!p.sizes || !p.sizes.split('|').some((s: string) => filter.sizes.includes(s)))) return false
      if (filter.colors.length) {
        const productColors = parseColorNames(p.colors)
        if (!productColors.some(c => filter.colors.includes(c))) return false
      }
      if (filter.brands.length && p.brand && !filter.brands.includes(p.brand)) return false
      return true
    })
  }, [products, filter.search, filter.categories, filter.priceMax, filter.sizes, filter.colors, filter.brands])

  // Sort products
  const sorted = useMemo(() => {
    const arr = [...filtered]
    if (filter.sort === 'price-asc') arr.sort((a: typeof products[0], b: typeof products[0]) => (a.price_sale || a.price) - (b.price_sale || b.price))
    else if (filter.sort === 'price-desc') arr.sort((a: typeof products[0], b: typeof products[0]) => (b.price_sale || b.price) - (a.price_sale || a.price))
    else if (filter.sort === 'rating') arr.sort((a: typeof products[0], b: typeof products[0]) => (b.rating || 0) - (a.rating || 0))
    else if (filter.sort === 'bestseller') arr.sort((a: typeof products[0], b: typeof products[0]) => (b.sold || 0) - (a.sold || 0))
    else arr.sort((a, b) => b.id - a.id) // newest
    return arr
  }, [filtered, filter.sort])

  // Paginate
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE)
  const paginatedProducts = sorted.slice((filter.page - 1) * ITEMS_PER_PAGE, filter.page * ITEMS_PER_PAGE)

  // Extract unique values for filters
  const allSizes = useMemo(() => {
    const sizes = new Set<string>()
    products.forEach(p => {
      if (p.sizes) {
        p.sizes.split('|').filter(Boolean).forEach((s: string) => sizes.add(s))
      }
    })
    return Array.from(sizes).sort()
  }, [products])

  const allColors = useMemo(() => {
    const colors = new Set<string>()
    products.forEach(p => parseColorNames(p.colors).forEach(c => colors.add(c)))
    return Array.from(colors).sort()
  }, [products])

  const allBrands = useMemo(() => {
    const brands = new Set<string>()
    products.forEach(p => p.brand && brands.add(p.brand))
    return Array.from(brands).sort()
  }, [products])

  const handleSearch = (q: string) => {
    setFilter(f => ({ ...f, search: q, page: 1 }))
  }

  const handleCategoryToggle = (slug: string) => {
    setFilter(f => {
      const cats = f.categories.includes(slug)
        ? f.categories.filter(c => c !== slug)
        : [slug]
      return { ...f, categories: cats, page: 1 }
    })
  }

  const handlePriceChange = (max: number) => {
    setFilter(f => ({ ...f, priceMax: max, page: 1 }))
  }

  const handleSizeToggle = (size: string) => {
    setFilter(f => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter(s => s !== size) : [...f.sizes, size],
      page: 1,
    }))
  }

  const handleColorToggle = (color: string) => {
    setFilter(f => ({
      ...f,
      colors: f.colors.includes(color) ? f.colors.filter(c => c !== color) : [...f.colors, color],
      page: 1,
    }))
  }

  const handleBrandToggle = (brand: string) => {
    setFilter(f => ({
      ...f,
      brands: f.brands.includes(brand) ? f.brands.filter(b => b !== brand) : [...f.brands, brand],
      page: 1,
    }))
  }

  const handleAddCart = (product: typeof products[0]) => {
    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: product.price_sale || product.price,
    })
  }

  const activeFilterCount = [
    filter.search ? 1 : 0,
    filter.categories.length,
    filter.priceMax < 2000000 ? 1 : 0,
    filter.sizes.length,
    filter.colors.length,
    filter.brands.length,
  ].reduce((a, b) => a + b, 0)

  const categoryLabels: Record<string, string> = {
    'quan-ao': 'Quần áo thể thao',
    'giay': 'Giày thể thao',
    'dung-cu': 'Dụng cụ gym',
    'phu-kien': 'Phụ kiện thể thao',
    'yoga': 'Yoga & Pilates',
  }

  return (
    <div className="tt-page-wrap">
      {/* Search Zone */}
      <div className="tt-catalog-header">
        <div className="tt-container">
          <h1 className="tt-catalog-title">40 sản phẩm thể thao <span>chính hãng</span></h1>
          <div className="tt-search-main">
            <input
              type="text"
              placeholder="Tìm kiếm áo, giày, dụng cụ gym, yoga..."
              value={filter.search}
              onChange={e => handleSearch(e.target.value)}
              autoComplete="off"
            />
            <button aria-label="Tìm kiếm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              Tìm
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="tt-filter-wrap">
        <div className="tt-container">
          {/* Desktop filter row 1 */}
          <div className="tt-filter-row1 d-none d-lg-flex">
            {/* Category pills */}
            <div className="tt-cat-pills">
              <button className={`tt-cat-pill ${filter.categories.length === 0 ? 'active' : ''}`} onClick={() => handleCategoryToggle('')}>
                Tất cả
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`tt-cat-pill ${filter.categories.includes(cat.slug) ? 'active' : ''}`}
                  onClick={() => handleCategoryToggle(cat.slug)}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="tt-filter-sep"></div>

            {/* Price dropdown */}
            <div className="dropdown tt-dropdown">
              <button className="tt-drop-btn dropdown-toggle" data-bs-toggle="dropdown">Khoảng giá</button>
              <div className="dropdown-menu" style={{ width: '220px' }}>
                <div className="tt-price-range">
                  <div className="tt-price-labels">
                    <span>0đ</span>
                    <span>{fmt(filter.priceMax)}</span>
                  </div>
                  <input
                    type="range"
                    className="tt-range"
                    min="0"
                    max="2000000"
                    value={filter.priceMax}
                    step="50000"
                    onChange={e => handlePriceChange(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Size dropdown */}
            <div className="dropdown tt-dropdown">
              <button className="tt-drop-btn dropdown-toggle" data-bs-toggle="dropdown">Size</button>
              <div className="dropdown-menu">
                {allSizes.map(size => (
                  <label key={size} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input tt-size-cb"
                      checked={filter.sizes.includes(size)}
                      onChange={() => handleSizeToggle(size)}
                    />
                    <span className="form-check-label">{size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Color dropdown */}
            <div className="dropdown tt-dropdown">
              <button className="tt-drop-btn dropdown-toggle" data-bs-toggle="dropdown">Màu sắc</button>
              <div className="dropdown-menu">
                {allColors.map(color => (
                  <label key={color} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input tt-color-cb"
                      checked={filter.colors.includes(color)}
                      onChange={() => handleColorToggle(color)}
                    />
                    <span className="form-check-label">{color}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand dropdown */}
            <div className="dropdown tt-dropdown">
              <button className="tt-drop-btn dropdown-toggle" data-bs-toggle="dropdown">Thương hiệu</button>
              <div className="dropdown-menu">
                {allBrands.map(brand => (
                  <label key={brand} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input tt-brand-cb"
                      checked={filter.brands.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                    />
                    <span className="form-check-label">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div style={{ marginLeft: 'auto' }}>
              <select
                className="tt-sort-select"
                value={filter.sort}
                onChange={e => setFilter(f => ({ ...f, sort: e.target.value as any, page: 1 }))}
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="bestseller">Bán chạy</option>
                <option value="rating">Đánh giá cao</option>
              </select>
            </div>
          </div>

          {/* Active chips row */}
          <div className="tt-filter-row2">
            <div className="tt-chips-row">
              {filter.search && (
                <span className="tt-chip">
                  "{filter.search}"
                  <button onClick={() => handleSearch('')} aria-label="Xóa">×</button>
                </span>
              )}
              {filter.categories.map(cat => (
                <span key={cat} className="tt-chip">
                  {categoryLabels[cat] || cat}
                  <button onClick={() => handleCategoryToggle(cat)} aria-label="Xóa">×</button>
                </span>
              ))}
              {filter.priceMax < 2000000 && (
                <span className="tt-chip">
                  Tối đa {fmt(filter.priceMax)}
                  <button onClick={() => handlePriceChange(2000000)} aria-label="Xóa">×</button>
                </span>
              )}
              {filter.sizes.map(size => (
                <span key={size} className="tt-chip">
                  {size}
                  <button onClick={() => handleSizeToggle(size)} aria-label="Xóa">×</button>
                </span>
              ))}
              {filter.colors.map(color => (
                <span key={color} className="tt-chip">
                  {color}
                  <button onClick={() => handleColorToggle(color)} aria-label="Xóa">×</button>
                </span>
              ))}
              {filter.brands.map(brand => (
                <span key={brand} className="tt-chip">
                  {brand}
                  <button onClick={() => handleBrandToggle(brand)} aria-label="Xóa">×</button>
                </span>
              ))}
            </div>
            <div className="tt-result-count">{sorted.length} sản phẩm</div>
          </div>

          {/* Mobile filter bar */}
          <div className="tt-filter-mobile d-lg-none">
            <button className="tt-btn-filter" data-bs-toggle="offcanvas" data-bs-target="#ttFilterOffcanvas">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/></svg>
              Bộ lọc
              {activeFilterCount > 0 && <span className="tt-filter-badge">{activeFilterCount}</span>}
            </button>
            <div style={{ marginLeft: 'auto' }}>
              <select
                className="tt-sort-select"
                value={filter.sort}
                onChange={e => setFilter(f => ({ ...f, sort: e.target.value as any, page: 1 }))}
              >
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

      {/* Catalog Section */}
      <div className="tt-catalog-section">
        <div className="tt-container">
          {paginatedProducts.length === 0 ? (
            <div className="tt-empty-state">
              <div className="tt-empty-icon">🏃</div>
              <h3>Không tìm thấy sản phẩm</h3>
              <p>Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
              <button
                className="tt-btn-reset"
                onClick={() => setFilter(f => ({
                  ...f,
                  search: '',
                  categories: [],
                  priceMax: 2000000,
                  sizes: [],
                  colors: [],
                  brands: [],
                  page: 1,
                }))}
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <>
              <div className="tt-product-grid">
                {paginatedProducts.map(product => (
                  <div key={product.id} className="tt-prod-card">
                    <Link to={`/san-pham/${product.slug}`} className="tt-prod-img-wrap">
                      <img src={product.image} alt={product.name} loading="lazy" />
                      {product.badge && (
                        <div className={`tt-badge tt-badge-${product.badge?.toLowerCase() || 'new'}`}>
                          {product.badge === 'sale' ? 'Sale' : product.badge === 'new' ? 'Mới' : product.badge === 'hot' ? 'Hot' : product.badge}
                        </div>
                      )}
                    </Link>
                    <div className="tt-prod-body">
                      <div className="tt-prod-cat">{categoryLabels[product.category_slug || ''] || product.category_slug}</div>
                      <h3 className="tt-prod-name">
                        <Link to={`/san-pham/${product.slug}`}>{product.name}</Link>
                      </h3>
                      <div className="tt-prod-rating">
                        <span className="tt-stars">{'★'.repeat(Math.round(product.rating || 0))}</span>
                        <span>{(product.rating || 0).toFixed(1)}</span>
                        <span>({product.sold || 0} đã bán)</span>
                      </div>
                      <div className="tt-prod-price">
                        <span className={`tt-price${product.price_sale ? ' sale' : ''}`}>
                          {fmt(product.price_sale || product.price)}
                        </span>
                        {product.price_sale && <span className="tt-price-orig">{fmt(product.price)}</span>}
                      </div>
                      <div className="tt-trust-mini">✓ Hàng chính hãng · ✓ Đổi size miễn phí</div>
                      <div className="tt-prod-actions">
                        <button
                          className="tt-btn-cart"
                          onClick={() => handleAddCart(product)}
                          title="Thêm vào giỏ hàng"
                        >
                          Thêm vào giỏ
                        </button>
                        <Link
                          to={`/san-pham/${product.slug}`}
                          className="tt-btn-detail"
                          title="Xem chi tiết"
                        >
                          Chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav aria-label="Phân trang" style={{ marginTop: 48, textAlign: 'center' }}>
                  <ul className="tt-pagination">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li key={i + 1} className={filter.page === i + 1 ? 'page-item active' : 'page-item'}>
                        <button
                          onClick={() => setFilter(f => ({ ...f, page: i + 1 }))}
                          className="page-link"
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Offcanvas */}
      <div className="offcanvas offcanvas-start tt-offcanvas" tabIndex={-1} id="ttFilterOffcanvas">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Bộ lọc</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          {/* Category section */}
          <div className="tt-oc-section">
            <div className="tt-oc-section-title">Danh mục</div>
            <div className="tt-cat-pills" style={{ flexWrap: 'wrap', gap: '6px' }}>
              <button
                className={`tt-cat-pill ${filter.categories.length === 0 ? 'active' : ''}`}
                onClick={() => { handleCategoryToggle(''); (document.querySelector('[data-bs-dismiss="offcanvas"]') as HTMLElement)?.click() }}
              >
                Tất cả
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`tt-cat-pill ${filter.categories.includes(cat.slug) ? 'active' : ''}`}
                  onClick={() => { handleCategoryToggle(cat.slug); (document.querySelector('[data-bs-dismiss="offcanvas"]') as HTMLElement)?.click() }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price section */}
          <div className="tt-oc-section">
            <div className="tt-oc-section-title">Khoảng giá</div>
            <div className="tt-price-range">
              <div className="tt-price-labels">
                <span>0đ</span>
                <span>{fmt(filter.priceMax)}</span>
              </div>
              <input
                type="range"
                className="tt-range"
                min="0"
                max="2000000"
                value={filter.priceMax}
                step="50000"
                onChange={e => handlePriceChange(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Size section */}
          <div className="tt-oc-section">
            <div className="tt-oc-section-title">Size</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {allSizes.map(size => (
                <label key={size} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={filter.sizes.includes(size)}
                    onChange={() => handleSizeToggle(size)}
                  />
                  <span className="form-check-label">{size}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Color section */}
          <div className="tt-oc-section">
            <div className="tt-oc-section-title">Màu sắc</div>
            <div>
              {allColors.map(color => (
                <label key={color} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={filter.colors.includes(color)}
                    onChange={() => handleColorToggle(color)}
                  />
                  <span className="form-check-label">{color}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand section */}
          <div className="tt-oc-section">
            <div className="tt-oc-section-title">Thương hiệu</div>
            <div>
              {allBrands.map(brand => (
                <label key={brand} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={filter.brands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                  />
                  <span className="form-check-label">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Apply button */}
          <button className="tt-oc-apply" data-bs-dismiss="offcanvas">Áp dụng bộ lọc</button>
        </div>
      </div>
    </div>
  )
}
