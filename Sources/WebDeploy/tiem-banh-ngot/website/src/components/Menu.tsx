import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface ProductCategory {
  id: number
  name: string
  slug: string
  description: string
  icon: string
  image: string
}

interface Product {
  id: number
  category_id: number
  name: string
  description: string
  price: number
  price_note: string
  image: string
  tag: string
  featured: number
}

interface GroupedMenu extends ProductCategory {
  items: Product[]
}

interface MenuProps {
  fullPage?: boolean
}

const TAG_LABELS: Record<string, string> = {
  bestseller: 'Bán chạy',
  new: 'Mới',
  seasonal: 'Theo mùa',
  custom: 'Đặc biệt',
}

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600&q=80'

export default function Menu({ fullPage = false }: MenuProps) {
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<number | 'all'>('all')

  useEffect(() => {
    Promise.all([
      api.get<ProductCategory[]>('/public/product-categories'),
      api.get<Product[]>('/public/products'),
    ]).then(([cats, prods]) => {
      setCategories(cats)
      setProducts(prods)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  // Group products by category
  const grouped: GroupedMenu[] = categories.map(cat => ({
    ...cat,
    items: products.filter(p => p.category_id === cat.id),
  })).filter(g => g.items.length > 0)

  const displayProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category_id === activeCategory)

  function formatPrice(price: number) {
    if (!price) return 'Liên hệ'
    return price.toLocaleString('vi-VN') + 'đ'
  }

  if (fullPage) {
    return (
      <div>
        <section className="page-hero">
          <div className="wd-container">
            <div className="ph-eyebrow">Thực đơn</div>
            <h1 className="ph-title">Sản phẩm <em>của chúng tôi</em></h1>
            <p className="ph-sub">Hơn 200 loại bánh thủ công cao cấp — làm tươi mỗi ngày</p>
          </div>
        </section>

        <section className="sec-pad">
          <div className="wd-container">
            {/* Category filter */}
            <div className="d-flex gap-2 flex-wrap justify-content-center mb-5" data-reveal>
              <button
                className={activeCategory === 'all' ? 'btn-accent' : 'btn-ghost'}
                onClick={() => setActiveCategory('all')}
              >Tất cả</button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={activeCategory === cat.id ? 'btn-accent' : 'btn-ghost'}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)' }}>Đang tải sản phẩm...</div>
            ) : (
              <div className="row g-4">
                {displayProducts.map((p, i) => (
                  <div key={p.id} className={`col-sm-6 col-lg-3 reveal reveal-d${(i % 4) + 1}`} data-reveal>
                    <ProductCard product={p} formatPrice={formatPrice} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    )
  }

  // Home page: show featured + grouped
  const featured = products.filter(p => p.featured).slice(0, 8)
  const displayFeatured = featured.length > 0 ? featured : products.slice(0, 8)

  return (
    <section className="sec-pad" id="san-pham">
      <div className="wd-container">
        <div className="text-center mb-5" data-reveal>
          <div className="eyebrow">Thực đơn của chúng tôi</div>
          <h2 className="sec-title">Sản phẩm <em>nổi bật</em></h2>
          <p className="sec-sub">Từ bánh kem sinh nhật đến macaron Pháp — tất cả đều được làm thủ công mỗi ngày</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-3)' }}>Đang tải...</div>
        ) : grouped.length > 0 ? (
          grouped.map((g) => (
            <div key={g.id} className="mb-5">
              <div className="d-flex align-items-center gap-2 mb-4" data-reveal>
                <span style={{ fontSize: 22 }}>{g.icon}</span>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', margin: 0 }}>{g.name}</h3>
                {g.description && (
                  <span style={{ fontSize: 13, color: 'var(--text-3)', marginLeft: 8 }}>— {g.description}</span>
                )}
              </div>
              <div className="row g-4">
                {g.items.slice(0, 4).map((p, i) => (
                  <div key={p.id} className={`col-sm-6 col-lg-3 reveal reveal-d${(i % 4) + 1}`} data-reveal>
                    <ProductCard product={p} formatPrice={formatPrice} />
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="row g-4">
            {displayFeatured.map((p, i) => (
              <div key={p.id} className={`col-sm-6 col-lg-3 reveal reveal-d${(i % 4) + 1}`} data-reveal>
                <ProductCard product={p} formatPrice={formatPrice} />
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-5" data-reveal>
          <a href="/san-pham" className="btn-ghost">Xem tất cả sản phẩm →</a>
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product, formatPrice }: { product: Product; formatPrice: (price: number) => string }) {
  return (
    <div className="product-card">
      <div className="pc-img-wrap">
        <img
          className="pc-img"
          src={product.image || FALLBACK_IMG}
          alt={product.name}
          loading="lazy"
          onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG }}
        />
      </div>
      <div className="pc-body">
        {product.tag && product.tag in TAG_LABELS && (
          <span className={`pc-tag ${product.tag}`}>{TAG_LABELS[product.tag]}</span>
        )}
        <div className="pc-name">{product.name}</div>
        {product.description && <p className="pc-desc">{product.description}</p>}
        <div className="d-flex align-items-center justify-content-between">
          <div className="pc-price">{formatPrice(product.price)}</div>
          {product.price_note && (
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{product.price_note}</div>
          )}
        </div>
      </div>
    </div>
  )
}
