import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { useSite } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { products } = useSite()
  const { addItem } = useCart()

  const product = products.find((p: typeof products[0]) => p.slug === slug)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useDocumentMeta({ title: product?.name || 'Chi tiết sản phẩm', description: product?.name || '' })

  if (!product) {
    return (
      <div className="tt-page-wrap">
        <div className="tt-container" style={{ padding: '80px 0', textAlign: 'center' }}>
          <h1>Không tìm thấy sản phẩm</h1>
          <p style={{ marginBottom: 20 }}>Sản phẩm bạn tìm kiếm không tồn tại</p>
          <Link to="/" className="tt-btn-primary">Quay lại trang chủ</Link>
        </div>
      </div>
    )
  }

  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'
  const price = product.price_sale || product.price
  const discount = product.price_sale ? Math.round((1 - product.price_sale / product.price) * 100) : 0

  const handleAddCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        product_id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.image,
        price: price,
      })
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="tt-page-wrap">
      <div className="tt-container" style={{ padding: '40px 0' }}>
        <div className="tt-detail-wrap">
          {/* Image gallery */}
          <div className="tt-detail-gallery">
            <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: 8 }} />
          </div>

          {/* Product info */}
          <div className="tt-detail-body">
            <h1 className="tt-detail-title">{product.name}</h1>

            {/* Rating and sold */}
            <div style={{ display: 'flex', gap: 20, marginBottom: 20, fontSize: 14, color: 'var(--text-2)' }}>
              <div>
                <span className="tt-stars">{'★'.repeat(Math.floor(product.review_count || 0))}</span>
                <span style={{ marginLeft: 8 }}>({product.review_count || 0} đánh giá)</span>
              </div>
              <div>{product.sold_count || 0} đã bán</div>
            </div>

            {/* Price */}
            <div style={{ marginBottom: 32, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 12 }}>
                <span style={{ fontSize: 32, fontWeight: 600, color: 'var(--accent)' }}>
                  {fmt(price)}
                </span>
                {product.price_sale && (
                  <>
                    <span style={{ fontSize: 18, color: 'var(--text-3)', textDecoration: 'line-through' }}>
                      {fmt(product.price)}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 600, background: 'var(--accent-light)', color: 'var(--accent)', padding: '4px 10px', borderRadius: 6 }}>
                      -{discount}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Size options */}
            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 12, fontWeight: 600 }}>Size</label>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      style={{
                        padding: '8px 14px',
                        border: '1px solid var(--border)',
                        background: 'white',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color if exists */}
            {product.color && (
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 12, fontWeight: 600 }}>Màu sắc</label>
                <div style={{ color: 'var(--text-2)' }}>{product.color}</div>
              </div>
            )}

            {/* Quantity and buttons */}
            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', marginBottom: 12, fontWeight: 600 }}>Số lượng</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid var(--border)',
                    background: 'white',
                    borderRadius: 6,
                    cursor: 'pointer',
                  }}
                >
                  −
                </button>
                <input
                  type="number"
                  value={qty}
                  onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{
                    width: 60,
                    padding: '8px',
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    textAlign: 'center',
                  }}
                />
                <button
                  onClick={() => setQty(qty + 1)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid var(--border)',
                    background: 'white',
                    borderRadius: 6,
                    cursor: 'pointer',
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to cart button */}
            <button
              onClick={handleAddCart}
              style={{
                width: '100%',
                padding: '14px 20px',
                background: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: 16,
                transition: 'all .2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {added ? '✓ Đã thêm vào giỏ' : `Thêm vào giỏ · ${fmt(price * qty)}`}
            </button>

            {/* Product benefits */}
            <div style={{ padding: '20px', background: 'var(--warm)', borderRadius: 8, marginTop: 20 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                <span>🚚</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Miễn phí vận chuyển</div>
                  <div style={{ fontSize: 13, color: 'var(--text-2)' }}>Với đơn hàng từ 500.000đ</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                <span>🔄</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Đổi size miễn phí</div>
                  <div style={{ fontSize: 13, color: 'var(--text-2)' }}>Trong 30 ngày nếu không vừa</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span>✓</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Bảo hành 12 tháng</div>
                  <div style={{ fontSize: 13, color: 'var(--text-2)' }}>Lỗi từ nhà sản xuất</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
