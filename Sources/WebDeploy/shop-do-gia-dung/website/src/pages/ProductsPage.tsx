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

const ITEMS_PER_PAGE = 12

interface ProductCardProps {
  product: any
}

function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)

  // Parse product colors: "Terracotta:#b5651d|Sage:#87a06b"
  const getProductColors = () => {
    if (!product.colors) return []
    return product.colors.split('|').map((c: string) => {
      const [name, hex] = c.split(':')
      return { name, hex }
    })
  }

  const handleAddToCart = (selectedColor?: string) => {
    addItem({
      product_id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image || '',
      price: product.salePrice || product.price,
      color: selectedColor || undefined,
    })
    setAdded(true)
    setShowColorPicker(false)
    setTimeout(() => setAdded(false), 2000)
  }

  const productColors = getProductColors()
  const hasMultipleColors = productColors.length > 1

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
          <button className={`dg-card-btn ${added ? 'added' : ''} dg-card-btn-flex-center`} onClick={() => {
            if (hasMultipleColors) {
              setShowColorPicker(true)
            } else {
              handleAddToCart()
            }
          }} title="Thêm vào giỏ hàng">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 01-8 0"></path></svg>
            <span> {added ? '✓ Đã thêm' : 'Thêm giỏ'}</span>
          </button>
          <Link to={`/san-pham/${product.slug}`} className="dg-card-btn-secondary" title="Mua ngay">Mua ngay</Link>
        </div>

        {/* Color Picker Modal */}
        {showColorPicker && hasMultipleColors && (
          <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
            <div style={{background: '#fff', borderRadius: '12px', padding: '32px', maxWidth: '400px', width: '90vw'}}>
              <h3 style={{marginBottom: '20px', fontSize: '18px', fontWeight: '600'}}>Chọn màu sắc</h3>
              <div style={{display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap'}}>
                {productColors.map((color: any) => (
                  <button
                    key={color.name}
                    onClick={() => handleAddToCart(color.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      border: '2px solid var(--border)',
                      background: '#fff',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all .2s'
                    }}
                  >
                    <span style={{width: '20px', height: '20px', borderRadius: '4px', backgroundColor: color.hex, border: '1px solid #ccc'}}></span>
                    {color.name}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowColorPicker(false)}
                style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', fontWeight: '500'}}
              >
                Đóng
              </button>
            </div>
          </div>
        )}
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
  const [priceRange, setPriceRange] = useState([0, 3000000])
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '')
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'))
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    setSearchInput(searchParams.get('q') || '')
    setSelectedCategory(searchParams.get('category') || '')
    setSelectedTheme(searchParams.get('theme') || '')
  }, [searchParams])

  useEffect(() => {
    const handleDocumentClick = () => {
      setOpenDropdown(null)
    }
    document.addEventListener('click', handleDocumentClick)
    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [])

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

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const validPage = Math.max(1, Math.min(currentPage, totalPages || 1))
  const startIdx = (validPage - 1) * ITEMS_PER_PAGE
  const paginatedItems = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({top: 0, behavior: 'smooth'})
  }

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
      <main className="dg-container sec-pad" style={{ paddingTop: '32px' }}>

        {/* Filter Bar */}
        <div className="dg-filter-bar">
          {/* Row 1: Categories + Mobile toggle */}
          <div className="dg-filter-bar__row">
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
            <button className="dg-filter-mob-btn" id="dg-filter-mob-open">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
              Bộ lọc
              <span className="dg-count" id="dg-filter-badge" style={{ display: 'none' }}>0</span>
            </button>
          </div>

          {/* Row 2: Dropdowns + Sort + Count (hidden on mobile) */}
          <div className="dg-filter-bar__row desktop-filters">
            {/* Search input */}
            <div style={{ position: 'relative', flex: '0 0 220px' }}>
              <input type="text" id="dg-filter-search" placeholder="Tìm theo tên..." aria-label="Tìm theo tên"
                value={searchInput} onChange={e => setSearchInput(e.target.value)}
                className="form-control"
              />
              <svg style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>

            {/* Price dropdown */}
            <div className="dg-filter-dropdown" id="dd-price">
              <button className={`dg-filter-dropdown__btn ${openDropdown === 'price' ? 'open' : ''}`} id="btn-dd-price" onClick={(e) => {e.stopPropagation(); setOpenDropdown(prev => prev === 'price' ? null : 'price');}}>
                Khoảng giá 0đ - {priceRange[1].toLocaleString('vi-VN')}đ
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <div className={`dg-filter-dropdown__menu ${openDropdown === 'price' ? 'open' : ''}`} id="menu-dd-price" onClick={(e) => e.stopPropagation()}>
                <div className="dg-price-range">
                  <input type="range" id="dg-price-slider" min="0" max="3000000" step="50000" value={priceRange[1]} onChange={e => setPriceRange([0, parseInt(e.target.value)])} />
                  <span className="dg-price-range__vals" id="dg-price-val">Đến {priceRange[1].toLocaleString('vi-VN')}đ</span>
                </div>
              </div>
            </div>

            {/* Sort */}
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="form-select" style={{ maxWidth: '200px' }}>
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            

            {/* Result count */}
            <span className="dg-result-count" id="dg-result-count">{filtered.length} sản phẩm</span>
          </div>
        </div>
        

        {/* Product Grid */}
        <div className="dg-grid dg-grid--4">
          {paginatedItems.map(p => <ProductCard key={p.id} product={p} />)}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <p style={{ fontSize: '18px', color: 'var(--text-2)' }}>Không tìm thấy sản phẩm phù hợp.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '64px', flexWrap: 'wrap' }}>
            {/* Previous button */}
            <button
              onClick={() => handlePageChange(validPage - 1)}
              disabled={validPage === 1}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                background: validPage === 1 ? '#f5f5f5' : '#fff',
                cursor: validPage === 1 ? 'not-allowed' : 'pointer',
                color: validPage === 1 ? '#999' : 'var(--text)',
                fontWeight: '500',
              }}
            >
              ← Trước
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '6px',
                  border: page === validPage ? '2px solid var(--accent)' : '1px solid var(--border)',
                  background: page === validPage ? 'var(--accent-light)' : '#fff',
                  color: page === validPage ? 'var(--accent)' : 'var(--text)',
                  fontWeight: page === validPage ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all .2s',
                }}
              >
                {page}
              </button>
            ))}

            {/* Next button */}
            <button
              onClick={() => handlePageChange(validPage + 1)}
              disabled={validPage === totalPages}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                background: validPage === totalPages ? '#f5f5f5' : '#fff',
                cursor: validPage === totalPages ? 'not-allowed' : 'pointer',
                color: validPage === totalPages ? '#999' : 'var(--text)',
                fontWeight: '500',
              }}
            >
              Tiếp →
            </button>
          </div>
        )}
      </main>
    </>
  )
}
