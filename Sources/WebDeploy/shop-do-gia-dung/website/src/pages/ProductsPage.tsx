import { useMemo, useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useCart } from '../contexts/CartContext'

const SORT_OPTIONS = [
  { value: '', label: 'Mặc định' },
  { value: 'price-asc', label: 'Giá: Thấp đến Cao' },
  { value: 'price-desc', label: 'Giá: Cao đến Thấp' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'sold-desc', label: 'Bán chạy nhất' },
]

interface ProductCardProps {
  product: any
}

function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image || '',
      price: product.salePrice || product.price,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="dg-card">
      <Link to={`/san-pham/${product.slug}`} className="dg-card-link">
        <div className="dg-card-image">
          <img src={product.image} alt={product.name} onError={e => {
            const img = e.target as HTMLImageElement
            img.src = `https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&auto=format&fit=crop&q=80`
          }} />
          {product.badge && <span className="dg-card-badge">{product.badge === 'sale' ? 'Sale' : 'Hot'}</span>}
        </div>
        <h3 className="dg-card-name">{product.name}</h3>
        <p className="dg-card-desc">{product.description}</p>
      </Link>
      <div className="dg-card-footer">
        <div className="dg-card-price">
          {product.salePrice ? (
            <>
              <span className="dg-card-price-orig">{(product.price).toLocaleString('vi-VN')}đ</span>
              <span className="dg-card-price-sale">{(product.salePrice || 0).toLocaleString('vi-VN')}đ</span>
            </>
          ) : (
            <>
              <span className="dg-card-price-orig"></span>
              <span className="dg-card-price-sale">{(product.price).toLocaleString('vi-VN')}đ</span>
            </>
          )}
        </div>
        <div className="dg-card-actions">
          <button className={`dg-card-btn ${added ? 'added' : ''} dg-card-btn-flex-center`} onClick={handleAddToCart} title="Thêm vào giỏ hàng">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 01-8 0"></path></svg>
            <span> {added ? '✓ Đã thêm' : 'Thêm giỏ'}</span>
          </button>
          <Link to={`/san-pham/${product.slug}`} className="dg-card-btn-secondary" title="Mua ngay">Mua ngay</Link>
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const { products, categories, settings } = useSite()
  useDocumentMeta({
    title: 'Sản phẩm — ' + settings.site_name,
    description: 'Khám phá toàn bộ sản phẩm đồ gia dụng tại ' + settings.site_name,
  })

  const [searchParams, setSearchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [selectedTheme, setSelectedTheme] = useState(searchParams.get('theme') || '')
  const [priceRange, setPriceRange] = useState([0, 2000000])
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '')

  useEffect(() => {
    setSearchInput(searchParams.get('q') || '')
    setSelectedCategory(searchParams.get('category') || '')
    setSelectedTheme(searchParams.get('theme') || '')
  }, [searchParams])

  const filtered = useMemo(() => {
    let result = [...products]

    if (searchInput) result = result.filter(p => p.name.toLowerCase().includes(searchInput.toLowerCase()))
    if (selectedCategory) result = result.filter(p => p.category === selectedCategory)
    if (selectedTheme) result = result.filter(p => p.theme?.includes(selectedTheme) || p.theme?.split(',').includes(selectedTheme))
    result = result.filter(p => (p.price >= priceRange[0] && p.price <= priceRange[1]) || (p.salePrice && p.salePrice >= priceRange[0] && p.salePrice <= priceRange[1]))

    if (sortBy === 'price-asc') result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price))
    else if (sortBy === 'price-desc') result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price))
    else if (sortBy === 'sold-desc') result.sort((a, b) => (b.sold || 0) - (a.sold || 0))
    else if (sortBy === 'newest') result.sort((a, b) => b.id - a.id)

    return result
  }, [products, searchInput, selectedCategory, selectedTheme, priceRange, sortBy])

  return (
    <>
      {/* Page Hero */}
      <div className="dg-page-hero">
        <div className="dg-container">
          <p className="dg-page-hero__label">Cửa hàng</p>
          <h1 className="dg-page-hero__title">Tất cả sản phẩm</h1>
          <p className="dg-page-hero__sub">Khám phá bộ sưu tập đồ gia dụng chất lượng cao, được tuyển chọn kỹ lưỡng.</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="dg-container" style={{ paddingTop: '32px', paddingBottom: '80px' }}>

        {/* Filter Bar */}
        <div className="dg-filter-bar">
          {/* Category Pills */}
          <div className="dg-cat-pills" id="dg-cat-pills">
            <button className={`dg-cat-pill ${!selectedCategory ? 'active' : ''}`} onClick={() => {
              setSelectedCategory('')
              setSearchParams({})
            }}>Tất cả</button>
            {categories.map(cat => (
              <button key={cat.slug} className={`dg-cat-pill ${selectedCategory === cat.slug ? 'active' : ''}`} onClick={() => {
                setSelectedCategory(cat.slug)
                setSearchParams({ category: cat.slug })
              }}>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Price Range & Sort */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
            <input type="range" min="0" max="2000000" value={priceRange[1]} onChange={e => setPriceRange([0, parseInt(e.target.value)])} style={{ flex: 1, minWidth: '200px' }} />
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="form-select" style={{ maxWidth: '200px' }}>
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '32px' }}>
          <input type="text" className="form-control" placeholder="Tìm kiếm sản phẩm..." value={searchInput} onChange={e => setSearchInput(e.target.value)} />
        </div>

        {/* Product Grid */}
        <div className="dg-grid dg-grid--4">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <p style={{ fontSize: '18px', color: 'var(--text-2)' }}>Không tìm thấy sản phẩm phù hợp.</p>
          </div>
        )}
      </main>
    </>
  )
}
