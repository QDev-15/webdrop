import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import type { Product } from '../contexts/SiteContext'

const AGE_GROUPS = ['0-2', '3-5', '6-8', '9+']

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
  const [selectedAge, setSelectedAge] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<number>(1500000)
  const [sortBy, setSortBy] = useState<string>('default')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [offcanvasOpen, setOffcanvasOpen] = useState(false)

  const PER_PAGE = 12

  // Read initial filters from URL
  useEffect(() => {
    const cat = searchParams.get('category') || ''
    const age = searchParams.get('age') || ''
    const price = searchParams.get('price_max') || '1500000'
    const sort = searchParams.get('sort') || 'default'
    const q = searchParams.get('q') || ''

    setSelectedCategory(cat)
    setSelectedAge(age)
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
        if (selectedAge) params.set('age_group', selectedAge)
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
  }, [selectedCategory, selectedAge, maxPrice, sortBy, searchQuery, page])

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
  const hasActiveFilter = selectedCategory || selectedAge || maxPrice < 1500000 || searchQuery

  return (
    <div className="dc-page-wrap">
      <div className="dc-page-hero">
        <div className="dc-container">
          <h1>Tất cả sản phẩm</h1>
          <p>Khám phá hơn 500 đồ chơi chất lượng cho bé yêu</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="dc-filter-wrap" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="dc-container" style={{ padding: '16px 0' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', overflowX: 'auto', paddingBottom: 12 }}>
            {/* Category pills */}
            <button
              onClick={() => setSelectedCategory('')}
              style={{ padding: '8px 16px', background: !selectedCategory ? 'var(--accent)' : 'transparent', color: !selectedCategory ? 'white' : 'inherit', border: '1px solid var(--border)', borderRadius: 20, cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}
            >
              Tất cả
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.slug); setPage(1) }}
                style={{ padding: '8px 16px', background: selectedCategory === cat.slug ? 'var(--accent)' : 'transparent', color: selectedCategory === cat.slug ? 'white' : 'inherit', border: '1px solid var(--border)', borderRadius: 20, cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', flex: 1 }}>
              {/* Age dropdown */}
              <select
                value={selectedAge}
                onChange={e => { setSelectedAge(e.target.value); setPage(1) }}
                style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer' }}
              >
                <option value="">Độ tuổi</option>
                {AGE_GROUPS.map(age => (
                  <option key={age} value={age}>{age === '9+' ? '9+ tuổi' : `${age} tuổi`}</option>
                ))}
              </select>

              {/* Price range */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 200 }}>
                <input
                  type="range"
                  min="0"
                  max="1500000"
                  step="50000"
                  value={maxPrice}
                  onChange={e => { setMaxPrice(Number(e.target.value)); setPage(1) }}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: 13, whiteSpace: 'nowrap' }}>Max: {fmt(maxPrice)}</span>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={e => { setSortBy(e.target.value); setPage(1) }}
                style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer' }}
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
              style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer' }}
            >
              🔍 Bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Active chips */}
      {hasActiveFilter && (
        <div style={{ borderBottom: '1px solid var(--border)', padding: '12px 0' }}>
          <div className="dc-container" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {selectedCategory && (
              <span style={{ padding: '6px 12px', background: 'var(--accent)', color: 'white', borderRadius: 20, fontSize: 13 }}>
                {categories.find(c => c.slug === selectedCategory)?.name} <button onClick={() => { setSelectedCategory(''); setPage(1) }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginLeft: 6 }}>×</button>
              </span>
            )}
            {selectedAge && (
              <span style={{ padding: '6px 12px', background: 'var(--accent)', color: 'white', borderRadius: 20, fontSize: 13 }}>
                {selectedAge === '9+' ? '9+ tuổi' : `${selectedAge} tuổi`} <button onClick={() => { setSelectedAge(''); setPage(1) }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginLeft: 6 }}>×</button>
              </span>
            )}
            {maxPrice < 1500000 && (
              <span style={{ padding: '6px 12px', background: 'var(--accent)', color: 'white', borderRadius: 20, fontSize: 13 }}>
                Max {fmt(maxPrice)} <button onClick={() => { setMaxPrice(1500000); setPage(1) }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginLeft: 6 }}>×</button>
              </span>
            )}
            {searchQuery && (
              <span style={{ padding: '6px 12px', background: 'var(--accent)', color: 'white', borderRadius: 20, fontSize: 13 }}>
                "{searchQuery}" <button onClick={() => { setSearchQuery(''); setPage(1) }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginLeft: 6 }}>×</button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Products grid */}
      <div style={{ padding: '48px 0' }}>
        <div className="dc-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '64px 0' }}>Đang tải...</div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: '#991b1b' }}>{error}</div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <p>Không có sản phẩm nào khớp với bộ lọc của bạn.</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
                {products.map(product => (
                  <div key={product.id} className="dc-prod-card" style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                    <Link to={`/san-pham/${product.slug}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                      <div style={{ position: 'relative', paddingBottom: '100%', overflow: 'hidden', background: '#f5f5f5' }}>
                        <img src={product.image} alt={product.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                        {product.price_sale && <span style={{ position: 'absolute', top: 8, right: 8, background: '#e24b4a', color: 'white', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>-{Math.round((1 - (product.price_sale / product.price)) * 100)}%</span>}
                      </div>
                      <div style={{ padding: 10 }}>
                        <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, lineHeight: 1.3, minHeight: '2.6em' }}>{product.name}</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>{fmt(product.price_sale || product.price)}</span>
                          {product.price_sale && <span style={{ fontSize: 11, color: 'var(--text-3)', textDecoration: 'line-through' }}>{fmt(product.price)}</span>}
                        </div>
                      </div>
                    </Link>
                    <button onClick={() => handleAddCart(product)} style={{ width: '100%', padding: '8px', background: 'var(--accent)', color: 'white', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Thêm vào giỏ</button>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, cursor: page === 1 ? 'not-allowed' : 'pointer' }}>‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, background: p === page ? 'var(--accent)' : 'transparent', color: p === page ? 'white' : 'inherit', cursor: 'pointer', fontWeight: p === page ? 600 : 400 }}
                    >
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, cursor: page === totalPages ? 'not-allowed' : 'pointer' }}>›</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
