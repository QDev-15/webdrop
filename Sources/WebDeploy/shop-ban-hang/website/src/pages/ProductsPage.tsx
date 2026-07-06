import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function ProductsPage() {
  const { products, categories } = useSite()
  const [selectedCat, setSelectedCat] = useState<number | null>(null)
  const [sort, setSort] = useState('default')

  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'

  let filtered = products.filter(p => p.status === 'published')
  if (selectedCat !== null) filtered = filtered.filter(p => {
    const cat = categories.find(c => c.id === selectedCat)
    return cat && p.category_name === cat.name
  })

  if (sort === 'price-asc') filtered = [...filtered].sort((a, b) => (a.price_sale || a.price) - (b.price_sale || b.price))
  if (sort === 'price-desc') filtered = [...filtered].sort((a, b) => (b.price_sale || b.price) - (a.price_sale || a.price))
  if (sort === 'new') filtered = [...filtered].sort((a, b) => b.is_new - a.is_new)

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
          <p className="sb-page-count">{filtered.length} sản phẩm</p>
        </div>
      </div>

      <div className="sb-container">
        <div className="sb-shop-layout">
          <aside className="sb-filter-sidebar">
            <div className="sb-filter-block">
              <div className="sb-filter-title">Danh mục</div>
              <div className="sb-filter-options">
                <label className="sb-filter-opt">
                  <input type="radio" name="cat" checked={selectedCat === null} onChange={() => setSelectedCat(null)} />
                  <span>Tất cả</span>
                </label>
                {categories.map(cat => (
                  <label key={cat.id} className="sb-filter-opt">
                    <input type="radio" name="cat" checked={selectedCat === cat.id} onChange={() => setSelectedCat(cat.id)} />
                    <span>{cat.name} ({cat.product_count})</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <div>
            <div className="sb-shop-top">
              <p style={{ fontSize: 14, color: 'var(--text-3)' }}>{filtered.length} kết quả</p>
              <select className="sb-sort-select" value={sort} onChange={e => setSort(e.target.value)}>
                <option value="default">Sắp xếp mặc định</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="new">Mới nhất</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-3)' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <p>Không có sản phẩm nào trong danh mục này</p>
              </div>
            ) : (
              <div className="sb-prod-grid">
                {filtered.map(p => (
                  <Link key={p.id} to={`/san-pham/${p.slug}`} className="sb-prod-card">
                    <div className="sb-prod-img">
                      {p.image ? (
                        <img src={p.image} alt={p.name} loading="lazy" />
                      ) : (
                        <div style={{ aspectRatio: '1', background: 'var(--cream-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🛍</div>
                      )}
                      {p.badge && <div className={`sb-prod-badge ${p.is_new ? 'new' : ''}`}>{p.badge}</div>}
                    </div>
                    <div className="sb-prod-info">
                      <div className="sb-prod-cat">{p.category_name}</div>
                      <div className="sb-prod-name">{p.name}</div>
                      <div className="sb-prod-footer">
                        <div className="sb-prod-price">
                          <span className="sb-prod-price-new">{fmt(p.price_sale || p.price)}</span>
                          {p.price_sale > 0 && p.price_sale < p.price && <span className="sb-prod-price-old">{fmt(p.price)}</span>}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
