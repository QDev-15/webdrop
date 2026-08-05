import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import type { Product } from '../contexts/SiteContext'

export default function ProductsPage() {
  useDocumentMeta({ title: 'Sản phẩm — KidZone Shop Đồ Chơi' })

  const [searchParams] = useSearchParams()
  const { categories } = useSite()
  const { addItem } = useCart()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<number>(1500000)
  const [sortBy, setSortBy] = useState<string>('default')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [offcanvasOpen, setOffcanvasOpen] = useState(false)

  const PER_PAGE = 12

  // Read initial filters from URL
  useEffect(() => {
    const cat = searchParams.get('category') || ''
    const price = searchParams.get('price_max') || '1500000'
    const sort = searchParams.get('sort') || 'default'
    const q = searchParams.get('q') || ''

    setSelectedCategory(cat)
    setMaxPrice(Number(price))
    setSortBy(sort)
    setSearchQuery(q)
    setPage(1)
  }, [searchParams])

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError('')
      try {
        const params = new URLSearchParams()
        params.set('page', page.toString())
        params.set('per_page', PER_PAGE.toString())
        if (selectedCategory) params.set('category', selectedCategory)
        params.set('price_max', maxPrice.toString())
        if (searchQuery) params.set('q', searchQuery)
        params.set('sort', sortBy)

        const { data, total: t } = await api.getPaged<Product[]>(`/public/products?${params}`)
        setProducts(data)
        setTotal(t)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi tải sản phẩm')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory, maxPrice, sortBy, searchQuery, page])

  const handleAddCart = (product: Product) => {
    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: product.price_sale || product.price,
    })
  }

  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'
  const totalPages = Math.ceil(total / PER_PAGE)
  const hasActiveFilter = selectedCategory || maxPrice < 1500000 || searchQuery

  return (
    <div className="dc-page-wrap">
      <div className="dc-page-hero">
        <div className="dc-container">
          <h1>Tất cả sản phẩm</h1>
          <p>Khám phá hơn 500 đồ chơi chất lượng cho bé yêu</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="dc-filter-wrap">
        <div className="dc-container dc-filter-inner">
          {/* Category pills */}
          <div className="dc-filter-cats">
            <button
              onClick={() => setSelectedCategory('')}
              className={`dc-filter-cat ${!selectedCategory ? 'active' : ''}`}
            >
              Tất cả
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.slug); setPage(1) }}
                className={`dc-filter-cat ${selectedCategory === cat.slug ? 'active' : ''}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="dc-filter-controls">
            <div className="dc-filter-group">
              {/* Price range */}
              <div className="dc-filter-price">
                <input
                  type="range"
                  min="0"
                  max="1500000"
                  step="50000"
                  value={maxPrice}
                  onChange={e => { setMaxPrice(Number(e.target.value)); setPage(1) }}
                  className="dc-price-slider"
                />
                <span className="dc-price-display">Max: {fmt(maxPrice)}</span>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={e => { setSortBy(e.target.value); setPage(1) }}
                className="dc-filter-sort"
              >
                <option value="default">Mặc định</option>
                <option value="price-asc">Giá thấp trước</option>
                <option value="price-desc">Giá cao trước</option>
                <option value="popular">Bán chạy nhất</option>
                <option value="newest">Mới nhất</option>
              </select>
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setOffcanvasOpen(!offcanvasOpen)}
              className="dc-filter-toggle-mob"
            >
              🔍 Bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Active chips */}
      {hasActiveFilter && (
        <div className="dc-active-chips-wrap">
          <div className="dc-container">
            {selectedCategory && (
              <span className="dc-chip">
                {categories.find(c => c.slug === selectedCategory)?.name}
                <button onClick={() => { setSelectedCategory(''); setPage(1) }} className="dc-chip-close">×</button>
              </span>
            )}
            {maxPrice < 1500000 && (
              <span className="dc-chip">
                Max {fmt(maxPrice)}
                <button onClick={() => { setMaxPrice(1500000); setPage(1) }} className="dc-chip-close">×</button>
              </span>
            )}
            {searchQuery && (
              <span className="dc-chip">
                "{searchQuery}"
                <button onClick={() => { setSearchQuery(''); setPage(1) }} className="dc-chip-close">×</button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Products grid */}
      <div className="dc-prod-section">
        <div className="dc-container">
          {loading ? (
            <div className="dc-empty-state">Đang tải...</div>
          ) : error ? (
            <div className="dc-empty-state dc-empty-error">{error}</div>
          ) : products.length === 0 ? (
            <div className="dc-empty-state">
              <div className="dc-empty-icon">📭</div>
              <p>Không có sản phẩm nào khớp với bộ lọc của bạn.</p>
            </div>
          ) : (
            <>
              <div className="dc-prod-grid">
                {products.map(product => (
                  <div key={product.id} className="dc-prod-card">
                    <Link to={`/san-pham/${product.slug}`} className="dc-prod-link">
                      <div className="dc-prod-img-wrap">
                        <img src={product.image} alt={product.name} className="dc-prod-img" />
                        {product.price_sale && (
                          <span className="dc-prod-sale-badge">
                            -{Math.round((1 - (product.price_sale / product.price)) * 100)}%
                          </span>
                        )}
                      </div>
                      <div className="dc-prod-body">
                        <h3 className="dc-prod-name">{product.name}</h3>
                        <div className="dc-prod-price-wrap">
                          <span className="dc-prod-price">{fmt(product.price_sale || product.price)}</span>
                          {product.price_sale && <span className="dc-prod-price-old">{fmt(product.price)}</span>}
                        </div>
                      </div>
                    </Link>
                    <button onClick={() => handleAddCart(product)} className="dc-prod-cta">
                      Thêm vào giỏ
                    </button>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="dc-pagination">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="dc-page-btn dc-page-prev"
                  >
                    ‹
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`dc-page-btn ${p === page ? 'active' : ''}`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="dc-page-btn dc-page-next"
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
