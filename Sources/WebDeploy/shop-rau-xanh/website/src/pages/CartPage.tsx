import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useCart } from '../contexts/CartContext'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface CouponValidateResult { code: string; type: 'percent' | 'fixed'; discount: number }

export default function CartPage() {
  const { items, subtotal, updateQty, removeItem, couponCode, setCouponCode } = useCart()
  const { settings, products } = useSite()

  useDocumentMeta({
    title: 'Giỏ hàng — Vườn Xanh',
    description: 'Xem lại giỏ hàng rau củ quả hữu cơ của bạn tại Vườn Xanh trước khi tiến hành thanh toán.',
  })
  const [couponInput, setCouponInput] = useState('')
  const [couponMsg, setCouponMsg] = useState('')
  const [couponError, setCouponError] = useState('')
  const [discount, setDiscount] = useState(0)
  const [checkingCoupon, setCheckingCoupon] = useState(false)
  const [updated, setUpdated] = useState(false)

  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'
  const shippingFee = Number(settings.shipping_fee || 0)
  const freeShipThreshold = Number(settings.free_shipping_threshold || 0)
  const effectiveShipping = freeShipThreshold > 0 && subtotal >= freeShipThreshold ? 0 : shippingFee
  const total = Math.max(0, subtotal + effectiveShipping - discount)

  const related = products.filter(p => !items.some(i => i.product_id === p.id)).slice(0, 4)

  // Re-check mã đã áp dụng mỗi khi subtotal đổi (thêm/xóa sản phẩm có thể làm mã không còn hợp lệ, vd dưới min_order).
  useEffect(() => {
    if (!couponCode) { setDiscount(0); return }
    api.post<CouponValidateResult>('/public/coupons/validate', { code: couponCode, subtotal })
      .then(r => { setDiscount(r.discount); setCouponMsg(`Đã áp dụng mã "${r.code}" — giảm ${fmt(r.discount)}.`); setCouponError('') })
      .catch(err => { setDiscount(0); setCouponCode(null); setCouponMsg(''); setCouponError(err instanceof Error ? err.message : 'Mã giảm giá không còn hợp lệ') })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [couponCode, subtotal])

  const applyCoupon = async () => {
    const code = couponInput.trim().toUpperCase()
    if (!code) return
    setCheckingCoupon(true)
    setCouponError('')
    try {
      const r = await api.post<CouponValidateResult>('/public/coupons/validate', { code, subtotal })
      setCouponCode(r.code)
      setDiscount(r.discount)
      setCouponMsg(`Đã áp dụng mã "${r.code}" — giảm ${fmt(r.discount)}.`)
      setCouponInput('')
    } catch (err) {
      setCouponMsg('')
      setCouponError(err instanceof Error ? err.message : 'Mã giảm giá không hợp lệ')
    } finally {
      setCheckingCoupon(false)
    }
  }

  const removeCoupon = () => {
    setCouponCode(null)
    setDiscount(0)
    setCouponMsg('')
    setCouponError('')
  }

  const handleUpdateCart = () => {
    setUpdated(true)
    setTimeout(() => setUpdated(false), 2000)
  }

  if (items.length === 0) {
    return (
      <main>
        <div className="rx-container rx-cart-wrap" style={{ textAlign: 'center' }}>
          <i className="bi bi-basket2" style={{ fontSize: 56, color: 'var(--text-3)' }} />
          <h1 className="rx-cart-title" style={{ marginTop: 24 }}>Giỏ hàng đang trống</h1>
          <p style={{ color: 'var(--text-2)', marginBottom: 32 }}>Hãy khám phá rau củ quả hữu cơ của Vườn Xanh để bắt đầu đặt hàng.</p>
          <Link to="/san-pham" className="rx-btn rx-btn-primary">Khám phá ngay <i className="bi bi-arrow-right ms-1" /></Link>
        </div>
      </main>
    )
  }

  return (
    <main>
      <div className="rx-container rx-cart-wrap">
        <nav className="rx-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Trang chủ</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span><span>Giỏ hàng</span>
        </nav>
        <h1 className="rx-cart-title">Giỏ hàng của bạn <span style={{ fontFamily: 'var(--sans)', fontStyle: 'normal', fontSize: 16, color: 'var(--text-3)', fontWeight: 400 }}>({items.reduce((s, i) => s + i.qty, 0)} sản phẩm)</span></h1>

        <div className="rx-cart-layout">
          <div>
            <div className="rx-cart-head">
              <span>Sản phẩm</span><span>Đơn giá</span><span>Số lượng</span><span>Tạm tính</span><span />
            </div>

            {items.map(item => (
              <div className="rx-cart-item" key={`${item.product_id}-${item.color ?? ''}-${item.size ?? ''}`}>
                <div className="rx-cart-prod">
                  <div className="rx-cart-thumb"><img src={item.image} alt={item.name} loading="lazy" /></div>
                  <div>
                    <div className="rx-cart-prod-name">{item.name}</div>
                  </div>
                </div>
                <div className="rx-cart-price">{fmt(item.price)}</div>
                <div className="rx-cart-qty">
                  <button type="button" onClick={() => updateQty(item.product_id, item.qty - 1, item.color, item.size)} aria-label="Giảm số lượng">−</button>
                  <input
                    type="text" value={item.qty} readOnly aria-label={`Số lượng ${item.name}`}
                  />
                  <button type="button" onClick={() => updateQty(item.product_id, item.qty + 1, item.color, item.size)} aria-label="Tăng số lượng">+</button>
                </div>
                <div className="rx-cart-subtotal">{fmt(item.price * item.qty)}</div>
                <button className="rx-remove-btn" aria-label="Xóa sản phẩm" onClick={() => removeItem(item.product_id, item.color, item.size)}>
                  <i className="bi bi-trash" />
                </button>
              </div>
            ))}

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <Link to="/san-pham" className="rx-btn rx-btn-ghost"><i className="bi bi-arrow-left" /> Tiếp tục mua sắm</Link>
              <button type="button" className="rx-btn rx-btn-outline" onClick={handleUpdateCart}>
                {updated ? <><i className="bi bi-check-circle me-1" /> Đã cập nhật</> : <><i className="bi bi-arrow-repeat me-1" /> Cập nhật giỏ hàng</>}
              </button>
            </div>
          </div>

          <aside className="rx-order-summary">
            <h3 className="rx-summary-title">Tóm tắt đơn hàng</h3>
            <div className="rx-summary-row"><span>Tạm tính</span><span>{fmt(subtotal)}</span></div>
            <div className="rx-summary-row">
              <span>Phí giao hàng</span>
              <span style={{ color: effectiveShipping === 0 ? 'var(--accent)' : undefined }}>{effectiveShipping === 0 ? 'Miễn phí' : fmt(effectiveShipping)}</span>
            </div>
            {discount > 0 && (
              <div className="rx-summary-row"><span>Giảm giá ({couponCode})</span><span style={{ color: 'var(--accent)' }}>−{fmt(discount)}</span></div>
            )}

            {couponCode ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, fontSize: 12, color: 'var(--text-2)', margin: '18px 0' }}>
                <span>Mã <strong>{couponCode}</strong> đã áp dụng</span>
                <button type="button" onClick={removeCoupon} style={{ background: 'none', border: 'none', color: 'var(--sale)', cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}>Gỡ mã</button>
              </div>
            ) : (
              <div className="rx-coupon-input">
                <input type="text" value={couponInput} onChange={e => setCouponInput(e.target.value)} placeholder="Nhập mã giảm giá" aria-label="Mã giảm giá" disabled={checkingCoupon} />
                <button type="button" onClick={applyCoupon} disabled={checkingCoupon}>{checkingCoupon ? 'Đang kiểm tra...' : 'Áp dụng'}</button>
              </div>
            )}
            {couponMsg && <p style={{ fontSize: 12, color: 'var(--accent)', marginTop: -10, marginBottom: 12 }}>{couponMsg}</p>}
            {couponError && <p style={{ fontSize: 12, color: 'var(--sale)', marginTop: -10, marginBottom: 12 }}>{couponError}</p>}

            <div className="rx-summary-row total"><span>Tổng cộng</span><span>{fmt(total)}</span></div>

            <Link to="/thanh-toan" className="rx-btn-checkout">
              <i className="bi bi-lock-fill" /> Tiến hành thanh toán
            </Link>

            <div className="rx-secure-badges">
              <span className="rx-secure-badge"><i className="bi bi-shield-check" /> Thanh toán an toàn</span>
              <span className="rx-secure-badge"><i className="bi bi-truck" /> Giao trong ngày nội thành</span>
              <span className="rx-secure-badge"><i className="bi bi-arrow-repeat" /> Đổi trả trong 24h</span>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <div style={{ marginTop: 64 }}>
            <div className="rx-eyebrow" data-reveal>Có thể bạn cũng thích</div>
            <h2 className="rx-sec-title" data-reveal data-delay="1">Rau củ quả <strong>khác đang có</strong></h2>
            <div className="rx-related-grid" style={{ marginTop: 32 }}>
              {related.map((p, i) => (
                <div className="rx-prod-card" data-reveal data-delay={String((i % 4) + 1)} key={p.id}>
                  <div className="rx-prod-thumb">
                    <Link to={`/san-pham/${p.slug}`}><img src={p.image} alt={p.name} loading="lazy" /></Link>
                    {p.badge && <div className={`rx-prod-badge${p.is_new ? ' new' : p.price_sale ? ' sale' : ''}`}>{p.badge}</div>}
                  </div>
                  <div className="rx-prod-info">
                    <div className="rx-prod-cat">{p.category_name}</div>
                    <h3 className="rx-prod-name"><Link to={`/san-pham/${p.slug}`}>{p.name}</Link></h3>
                    <div className="rx-prod-footer">
                      <span className="rx-prod-price-new">{fmt(p.price_sale || p.price)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
