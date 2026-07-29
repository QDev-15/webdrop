import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { products } = useSite()
  const { addItem } = useCart()
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)

  const product = products.find(p => p.slug === slug)
  useDocumentMeta({ title: product ? `${product.name} — KidZone` : 'Sản phẩm' })

  if (!product) {
    return (
      <div className="dc-page-wrap" style={{ padding: '64px 0', textAlign: 'center' }}>
        <div className="dc-container">
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h1>Sản phẩm không tìm thấy</h1>
          <p style={{ marginBottom: 24 }}>Xin lỗi, sản phẩm bạn tìm kiếm không tồn tại.</p>
          <Link to="/san-pham" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>← Quay lại trang sản phẩm</Link>
        </div>
      </div>
    )
  }

  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'
  const relatedProducts = products
    .filter(p => p.category_slug === product.category_slug && p.id !== product.id)
    .slice(0, 4)

  const handleBuyNow = () => {
    addItem({ product_id: product.id, name: product.name, slug: product.slug, image: product.image, price: product.price_sale || product.price }, qty)
    navigate('/gio-hang')
  }

  const handleAddCart = () => {
    addItem({ product_id: product.id, name: product.name, slug: product.slug, image: product.image, price: product.price_sale || product.price }, qty)
    setQty(1)
  }

  return (
    <div className="dc-page-wrap">
      <div className="dc-container" style={{ padding: '48px 0' }}>
        <Link to="/san-pham" style={{ color: 'var(--accent)', textDecoration: 'none', marginBottom: 32, display: 'inline-block' }}>← Quay lại</Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 64 }}>
          {/* Image */}
          <div>
            <div style={{ position: 'relative', paddingBottom: '100%', overflow: 'hidden', background: '#f5f5f5', borderRadius: 12 }}>
              <img src={product.image} alt={product.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              {product.price_sale && (
                <span style={{ position: 'absolute', top: 16, right: 16, background: '#e24b4a', color: 'white', padding: '8px 16px', borderRadius: 8, fontSize: 16, fontWeight: 600 }}>
                  -{Math.round((1 - (product.price_sale / product.price)) * 100)}%
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            <div style={{ marginBottom: 24 }}>
              {product.is_new && <span style={{ display: 'inline-block', background: 'var(--accent)', color: 'white', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, marginRight: 8 }}>Mới</span>}
              {product.is_featured && <span style={{ display: 'inline-block', background: '#f59e0b', color: 'white', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>Nổi bật</span>}
            </div>

            <h1 style={{ marginBottom: 12 }}>{product.name}</h1>
            <p style={{ color: 'var(--text-2)', marginBottom: 20 }}>{product.category_name}</p>

            {/* Price */}
            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{ fontSize: 28, fontWeight: 600, color: 'var(--accent)' }}>
                {fmt(product.price_sale || product.price)}
              </span>
              {product.price_sale && (
                <span style={{ fontSize: 18, color: 'var(--text-3)', textDecoration: 'line-through' }}>
                  {fmt(product.price)}
                </span>
              )}
            </div>

            {/* Info */}
            <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '16px 0', marginBottom: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <span style={{ color: 'var(--text-2)', fontSize: 13 }}>Độ tuổi</span>
                  <p style={{ fontWeight: 600 }}>{product.age_group || 'Phù hợp mọi độ tuổi'}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--text-2)', fontSize: 13 }}>Tình trạng</span>
                  <p style={{ fontWeight: 600 }}>{product.in_stock > 0 ? `Còn ${product.in_stock} sản phẩm` : 'Hết hàng'}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <p style={{ lineHeight: 1.6, marginBottom: 24, color: 'var(--text-2)' }}>{product.description}</p>

            {/* Quantity & Action */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
              <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 8 }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer' }}>−</button>
                <input type="number" value={qty} onChange={e => setQty(Math.max(1, Math.min(99, Number(e.target.value))))} style={{ width: 60, textAlign: 'center', border: 'none', outline: 'none' }} />
                <button onClick={() => setQty(Math.min(99, qty + 1))} style={{ padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer' }}>+</button>
              </div>
              <button onClick={handleAddCart} style={{ flex: 1, padding: '12px 24px', background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
                Thêm vào giỏ
              </button>
              <button onClick={handleBuyNow} style={{ flex: 1, padding: '12px 24px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
                Mua ngay
              </button>
            </div>

            {product.in_stock === 0 && (
              <div style={{ padding: 16, background: '#fee2e2', color: '#991b1b', borderRadius: 8, marginBottom: 24 }}>
                ⚠️ Sản phẩm hiện tạm hết hàng. Vui lòng quay lại sau hoặc liên hệ shop để đặt hàng.
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section data-reveal style={{ paddingBottom: 48 }}>
            <h2 style={{ marginBottom: 32 }}>Sản phẩm tương tự</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
              {relatedProducts.map(p => (
                <Link key={p.id} to={`/san-pham/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                    <div style={{ position: 'relative', paddingBottom: '100%', overflow: 'hidden', background: '#f5f5f5' }}>
                      <img src={p.image} alt={p.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: 10 }}>
                      <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, lineHeight: 1.3 }}>{p.name}</h3>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>{fmt(p.price_sale || p.price)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
