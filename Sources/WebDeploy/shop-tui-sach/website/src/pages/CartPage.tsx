import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useCart } from '../contexts/CartContext'
import { useSite } from '../contexts/SiteContext'

interface CouponValidateResult { code: string; type: 'percent' | 'fixed'; discount: number }

export default function CartPage() {
  const { items, subtotal, updateQty, removeItem, couponCode, setCouponCode } = useCart()
  const { settings, products } = useSite()
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
    setTimeout(() => setUpdated(false), 1400)
  }

  if (items.length === 0) {
    return (
      <section className="sec-pad">
        <div className="ts-container" style={{ textAlign: 'center' }}>
          <i className="bi bi-bag-x" style={{ fontSize: 56, color: 'var(--text-3)' }} />
          <h1 style={{ marginTop: 24, fontSize: 'clamp(2.2rem,4vw,3.2rem)' }}>Giỏ hàng đang trống</h1>
          <p style={{ color: 'var(--text-2)', marginBottom: 32 }}>Hãy khám phá bộ sưu tập túi da của chúng tôi để tìm sản phẩm yêu thích.</p>
          <Link to="/san-pham" className="ts-btn solid">Khám phá ngay</Link>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="ts-page-header">
        <div className="ts-container">
          <h1>Giỏ hàng của bạn</h1>
          <div className="ts-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>/</span>
            <span className="current">Giỏ hàng</span>
          </div>
        </div>
      </section>

      <section className="sec-pad">
        <div className="ts-container">
          <div className="ts-cart-layout">

            <div>
              <div className="ts-cart-head-row d-none d-md-flex" style={{ justifyContent: 'space-between', paddingBottom: 14, borderBottom: '1px solid var(--border)', fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-3)' }}>
                <span>Sản phẩm</span>
                <span>Tổng</span>
              </div>

              {items.map(item => (
                <div className="ts-cart-item" key={`${item.product_id}-${item.color ?? ''}-${item.size ?? ''}`}>
                  <div className="ts-cart-item-img">
                    <img src={item.image} alt={item.name} loading="lazy" />
                  </div>
                  <div>
                    <div className="ts-cart-item-name">{item.name}</div>
                    {(item.color || item.size) && (
                      <div className="ts-cart-item-variant">
                        {item.color && <>Màu: {item.color}</>}{item.color && item.size && ' · '}{item.size && <>Size: {item.size}</>}
                      </div>
                    )}
                  </div>
                  <div className="ts-cart-item-price">{fmt(item.price)}</div>
                  <div className="ts-qty-stepper">
                    <button type="button" onClick={() => updateQty(item.product_id, item.qty - 1, item.color, item.size)} aria-label={`Giảm số lượng ${item.name}`}>−</button>
                    <input type="text" value={item.qty} readOnly aria-label={`Số lượng ${item.name}`} />
                    <button type="button" onClick={() => updateQty(item.product_id, item.qty + 1, item.color, item.size)} aria-label={`Tăng số lượng ${item.name}`}>+</button>
                  </div>
                  <div className="ts-cart-item-subtotal">{fmt(item.price * item.qty)}</div>
                  <button className="ts-cart-remove" onClick={() => removeItem(item.product_id, item.color, item.size)} aria-label={`Xóa ${item.name} khỏi giỏ hàng`}>
                    <i className="bi bi-trash3" />
                  </button>
                </div>
              ))}

              <div className="ts-cart-toolbar">
                <Link to="/san-pham" className="ts-btn">← Tiếp tục mua sắm</Link>
                <button type="button" className="ts-btn" onClick={handleUpdateCart}>{updated ? 'Đã cập nhật ✓' : 'Cập nhật giỏ hàng'}</button>
              </div>

              <div className="ts-trust-strip">
                <div className="item"><i className="bi bi-shield-check" /> Thanh toán an toàn</div>
                <div className="item"><i className="bi bi-truck" /> Giao hàng toàn quốc</div>
                <div className="item"><i className="bi bi-arrow-repeat" /> Đổi trả trong {settings.return_days || 30} ngày</div>
              </div>
            </div>

            <aside className="ts-order-summary">
              <h2>Tổng đơn hàng</h2>
              <div className="ts-order-row"><span>Tạm tính</span><span>{fmt(subtotal)}</span></div>
              <div className="ts-order-row">
                <span>Phí vận chuyển</span>
                <span>{effectiveShipping === 0 ? 'Miễn phí' : fmt(effectiveShipping)}</span>
              </div>
              <div className="ts-order-row"><span>Giảm giá</span><span>{discount > 0 ? `−${fmt(discount)}` : '−0đ'}</span></div>

              {couponCode ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, fontSize: 12, color: 'var(--text-2)', margin: '14px 0' }}>
                  <span>Mã <strong>{couponCode}</strong> đã áp dụng</span>
                  <button type="button" onClick={removeCoupon} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}>Gỡ mã</button>
                </div>
              ) : (
                <div className="ts-coupon-row">
                  <label htmlFor="ts-coupon-input" className="visually-hidden">Mã giảm giá</label>
                  <input type="text" id="ts-coupon-input" value={couponInput} onChange={e => setCouponInput(e.target.value)} placeholder="Nhập mã giảm giá" disabled={checkingCoupon} />
                  <button type="button" className="ts-btn sm" onClick={applyCoupon} disabled={checkingCoupon}>{checkingCoupon ? 'Đang kiểm tra...' : 'Áp dụng'}</button>
                </div>
              )}
              {couponMsg && <p style={{ fontSize: 12, color: 'var(--accent)', marginTop: -6, marginBottom: 12 }}>{couponMsg}</p>}
              {couponError && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: -6, marginBottom: 12 }}>{couponError}</p>}

              <div className="ts-order-row total"><span>Tổng cộng</span><span>{fmt(total)}</span></div>

              <Link to="/thanh-toan" className="ts-btn solid block" style={{ marginTop: 24 }}>Tiến hành thanh toán</Link>
              <div className="ts-secure-note"><i className="bi bi-lock" /> Thanh toán được mã hóa &amp; bảo mật</div>
            </aside>

          </div>

          {related.length > 0 && (
            <div style={{ marginTop: 96 }}>
              <div className="ts-sec-head" data-reveal>
                <div className="ts-eyebrow">Gợi ý cho bạn</div>
                <h2 className="ts-sec-title">Có thể bạn <em>cũng thích</em></h2>
              </div>
              <div className="ts-products-grid">
                {related.map(p => (
                  <Link to={`/san-pham/${p.slug}`} className="ts-card" data-reveal key={p.id}>
                    <div className="ts-card-media">
                      {p.badge && <span className={`ts-card-tag${p.price_sale ? ' sale' : ''}`}>{p.badge}</span>}
                      <button type="button" className="ts-card-wish" aria-label="Thêm vào yêu thích" onClick={e => e.preventDefault()}><i className="bi bi-heart" /></button>
                      <img src={p.image} alt={p.name} loading="lazy" />
                    </div>
                    <span className="ts-card-cat">{p.category_name}</span>
                    <h3 className="ts-card-name">{p.name}</h3>
                    <div className="ts-card-price">
                      {fmt(p.price_sale || p.price)}
                      {!!p.price_sale && <del>{fmt(p.price)}</del>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
