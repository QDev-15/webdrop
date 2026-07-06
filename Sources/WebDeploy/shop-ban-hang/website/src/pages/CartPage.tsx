// import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useSite } from '../contexts/SiteContext'

export default function CartPage() {
  const { items, subtotal, updateQty, removeItem } = useCart()
  const { settings, products } = useSite()
  // const [coupon, setCoupon] = useState('')
  // const [couponMsg, setCouponMsg] = useState('')

  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'
  const shippingFee = Number(settings['shipping_fee'] || 0)
  const freeShipThreshold = Number(settings['free_shipping_threshold'] || 0)
  const effectiveShipping = freeShipThreshold > 0 && subtotal >= freeShipThreshold ? 0 : shippingFee
  const total = subtotal + effectiveShipping
  const remainingForFreeShip = freeShipThreshold - subtotal

  const related = products.filter(p => !items.some(i => i.product_id === p.id) && p.status === 'published').slice(0, 4)

  // const applyCoupon = () => {
  //   if (!coupon.trim()) return
  //   setCouponMsg('Tính năng mã giảm giá sẽ sớm ra mắt — cảm ơn bạn đã quan tâm!')
  // }

  if (items.length === 0) {
    return (
      <div className="sb-cart-wrap">
        <div className="sb-container-sm">
          <div className="sb-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>›</span>
            <span>Giỏ hàng</span>
          </div>
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 24 }}>🛒</div>
            <h1 className="sb-cart-title">Giỏ hàng của bạn</h1>
            <p style={{ color: 'var(--text-2)', fontWeight: 300, marginBottom: 32, fontSize: 16 }}>
              Giỏ hàng đang trống. Hãy khám phá các sản phẩm hữu cơ tuyệt vời của chúng tôi!
            </p>
            <Link to="/san-pham" className="sb-btn sb-btn-primary">Khám phá sản phẩm</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="sb-cart-wrap">
      <div className="sb-container">
        <nav className="sb-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span>›</span>
          <span>Giỏ hàng</span>
        </nav>

        <div className="sb-cart-layout">
          <div>
            <h1 className="sb-cart-title">Giỏ hàng của bạn</h1>

            <div className="sb-cart-head">
              <span>Sản phẩm</span>
              <span>Đơn giá</span>
              <span>Số lượng</span>
              <span>Tạm tính</span>
              <span></span>
            </div>

            {items.map(item => (
              <div className="sb-cart-item" key={`${item.product_id}-${item.color ?? ''}`}>
                <div className="sb-cart-prod">
                  <div className="sb-cart-thumb">
                    {item.image ? <img src={item.image} alt={item.name} loading="lazy" /> : (
                      <div style={{ width: '100%', height: '100%', background: 'var(--cream-deep)' }} />
                    )}
                  </div>
                  <div>
                    <div className="sb-cart-prod-name">{item.name}</div>
                    {item.color && <div className="sb-cart-prod-var">Màu: {item.color}</div>}
                  </div>
                </div>
                <div className="sb-cart-price">{fmt(item.price)}</div>
                <div>
                  <div className="sb-cart-qty" role="group" aria-label="Số lượng">
                    <button onClick={() => updateQty(item.product_id, item.qty - 1, item.color)} aria-label="Giảm số lượng">−</button>
                    <input
                      type="number" value={item.qty} min={1} max={99}
                      aria-label={`Số lượng ${item.name}`}
                      onChange={e => updateQty(item.product_id, Math.max(1, parseInt(e.target.value) || 1), item.color)}
                    />
                    <button onClick={() => updateQty(item.product_id, item.qty + 1, item.color)} aria-label="Tăng số lượng">+</button>
                  </div>
                </div>
                <div className="sb-cart-subtotal">{fmt(item.price * item.qty)}</div>
                <button className="sb-remove-btn" aria-label="Xóa sản phẩm khỏi giỏ" onClick={() => removeItem(item.product_id, item.color)}>
                  <i className="bi bi-x" />
                </button>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, flexWrap: 'wrap', gap: 12 }}>
              <Link to="/san-pham" className="sb-btn sb-btn-ghost">
                <i className="bi bi-arrow-left me-1" />
                Tiếp tục mua sắm
              </Link>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 36, padding: 24, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-2)' }}>
                <i className="bi bi-shield-lock-fill" style={{ color: 'var(--sage)', fontSize: 18 }} />
                <div><strong style={{ display: 'block', fontWeight: 500, color: 'var(--text)' }}>Thanh toán bảo mật</strong>SSL 256-bit encryption</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-2)' }}>
                <i className="bi bi-truck" style={{ color: 'var(--sage)', fontSize: 18 }} />
                <div><strong style={{ display: 'block', fontWeight: 500, color: 'var(--text)' }}>Miễn phí vận chuyển</strong>Đơn hàng từ {fmt(freeShipThreshold)}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-2)' }}>
                <i className="bi bi-arrow-repeat" style={{ color: 'var(--sage)', fontSize: 18 }} />
                <div><strong style={{ display: 'block', fontWeight: 500, color: 'var(--text)' }}>Đổi trả dễ dàng</strong>Trong vòng {settings['return_days'] || '30'} ngày</div>
              </div>
            </div>
          </div>

          <aside>
            <div className="sb-order-summary">
              <h2 className="sb-summary-title">Tóm tắt đơn hàng</h2>

              <div className="sb-summary-row">
                <span>Tạm tính ({items.reduce((s, i) => s + i.qty, 0)} sản phẩm)</span>
                <span>{fmt(subtotal)}</span>
              </div>
              <div className="sb-summary-row">
                <span>Phí vận chuyển</span>
                <span style={{ color: effectiveShipping === 0 ? 'var(--sage)' : undefined }}>{effectiveShipping === 0 ? 'Miễn phí' : fmt(effectiveShipping)}</span>
              </div>
              {remainingForFreeShip > 0 && freeShipThreshold > 0 && (
                <div className="sb-summary-row" style={{ fontSize: 12 }}>
                  <span>Mua thêm {fmt(remainingForFreeShip)} để freeship</span>
                </div>
              )}

              {/* <div className="sb-coupon-input">
                <input type="text" value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Nhập mã giảm giá" aria-label="Mã giảm giá" />
                <button type="button" onClick={applyCoupon}>Áp dụng</button>
              </div>
              {couponMsg && <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: -12, marginBottom: 12 }}>{couponMsg}</p>} */}

              <div className="sb-summary-row total">
                <span>Tổng cộng</span>
                <span>{fmt(total)}</span>
              </div>

              <Link to="/thanh-toan" className="sb-btn-checkout">
                <i className="bi bi-lock-fill" />
                Thanh toán ngay
              </Link>

              <div className="sb-secure-badges">
                <div className="sb-secure-badge"><i className="bi bi-shield-check" /> Bảo mật</div>
                <div className="sb-secure-badge"><i className="bi bi-truck" /> Giao hàng toàn quốc</div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16, justifyContent: 'center' }}>
                <span className="sb-pay-badge">COD</span>
                <span className="sb-pay-badge">Chuyển khoản</span>
              </div>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <div style={{ marginTop: 64 }}>
            <div className="sb-eyebrow" data-reveal>Gợi ý thêm</div>
            <h2 className="sb-sec-title" data-reveal data-delay="1">Bạn cũng có thể thích</h2>
            <div className="sb-related-grid" style={{ marginTop: 32 }}>
              {related.map(p => (
                <Link key={p.id} to={`/san-pham/${p.slug}`} className="sb-prod-card">
                  <div className="sb-prod-img">
                    {p.image ? <img src={p.image} alt={p.name} loading="lazy" /> : <div style={{ aspectRatio: '1', background: 'var(--cream-deep)' }} />}
                    {p.badge && <div className="sb-prod-badge">{p.badge}</div>}
                  </div>
                  <div className="sb-prod-info">
                    <div className="sb-prod-cat">{p.category_name}</div>
                    <div className="sb-prod-name">{p.name}</div>
                    <div className="sb-prod-price"><span className="sb-prod-price-new">{fmt(p.price_sale || p.price)}</span></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
