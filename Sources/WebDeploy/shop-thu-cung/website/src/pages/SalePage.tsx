import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useCart } from '../contexts/CartContext'
import { useSite, type Product } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

function formatVND(n: number) { return n.toLocaleString('vi-VN') + '₫' }

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const step = Math.ceil(target / 60) || 1
    let cur = 0
    const t = setInterval(() => {
      cur = Math.min(cur + step, target)
      setValue(cur)
      if (cur >= target) clearInterval(t)
    }, 25)
    return () => clearInterval(t)
  }, [target])
  return <>{value}{suffix}</>
}

export default function SalePage() {
  const { categories } = useSite()
  const { addItem } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [added, setAdded] = useState<number | null>(null)

  useDocumentMeta({
    title: 'Khuyến mãi — Pet Haus',
    description: 'Khuyến mãi Pet Haus — giảm giá đến 20% cho hàng loạt sản phẩm thú cưng chính hãng.',
  })

  useEffect(() => {
    api.getPaged<Product[]>('/public/products?sale=1&per_page=100').then(({ data }) => setProducts(data)).catch(() => {})
  }, [])

  const CAT_LABELS: Record<string, string> = {}
  categories.forEach(c => { CAT_LABELS[c.slug] = c.name })

  const quickAdd = (p: Product) => {
    addItem({ product_id: p.id, name: p.name, slug: p.slug, image: p.image, price: p.price_sale ?? p.price })
    setAdded(p.id)
    setTimeout(() => setAdded(null), 1500)
  }

  return (
    <>
      <section className="tc-page-header">
        <div className="tc-container tc-page-header-inner">
          <div className="tc-eyebrow">Ưu đãi giới hạn</div>
          <h1>Khuyến mãi <span style={{ color: 'var(--accent)' }}>giảm đến 20%</span></h1>
          <p>Áp dụng cho sản phẩm chọn lọc mỗi ngày — số lượng có hạn, cập nhật liên tục.</p>
        </div>
      </section>

      <section className="tc-sec-sm">
        <div className="tc-container">
          <div className="tc-stat-bar" data-reveal>
            <div className="tc-stats-grid">
              <div><div className="tc-stat-num"><Counter target={20} suffix="%" /></div><div className="tc-stat-label">Giảm tối đa</div></div>
              <div><div className="tc-stat-num"><Counter target={products.length || 8} /></div><div className="tc-stat-label">Sản phẩm đang sale</div></div>
              <div><div className="tc-stat-num"><Counter target={400} suffix="K" /></div><div className="tc-stat-label">Miễn phí ship từ</div></div>
              <div><div className="tc-stat-num"><Counter target={24} suffix="h" /></div><div className="tc-stat-label">Cập nhật ưu đãi mới</div></div>
            </div>
          </div>
        </div>
      </section>

      <div className="tc-catalog-section">
        <div className="tc-container">
          <div className="tc-sec-header tc-split" data-reveal>
            <div>
              <div className="tc-eyebrow" style={{ color: 'var(--accent-h)' }}>Đang giảm giá</div>
              <h2 className="tc-sec-title">Ưu đãi <em>hôm nay</em></h2>
            </div>
            <div className="tc-result-count">{products.length} sản phẩm đang giảm giá</div>
          </div>
          <div className="tc-product-grid">
            {products.map(p => (
              <div className="tc-prod-card" key={p.id}>
                <Link to={`/san-pham/${p.slug}`} className="tc-prod-img-wrap">
                  <img src={p.image} alt={p.name} loading="lazy" />
                  {p.price_sale && <span className="tc-badge tc-badge-sale">-{Math.round((1 - p.price_sale / p.price) * 100)}%</span>}
                </Link>
                <div className="tc-prod-body">
                  <div className="tc-prod-cat">{CAT_LABELS[p.category_slug] ?? p.category_name}</div>
                  <h3 className="tc-prod-name"><Link to={`/san-pham/${p.slug}`}>{p.name}</Link></h3>
                  <div className="tc-prod-rating"><span className="tc-stars">{'★'.repeat(Math.round(p.rating))}</span><span>{p.rating}</span></div>
                  <div className="tc-prod-price">
                    <span className="tc-price sale">{formatVND(p.price_sale ?? p.price)}</span>
                    <span className="tc-price-orig">{formatVND(p.price)}</span>
                  </div>
                  <div className="tc-prod-actions">
                    <button className="tc-btn-cart" onClick={() => quickAdd(p)}>{added === p.id ? '✓ Đã thêm' : 'Thêm vào giỏ'}</button>
                    <Link to={`/san-pham/${p.slug}`} className="tc-btn-detail">Chi tiết</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
