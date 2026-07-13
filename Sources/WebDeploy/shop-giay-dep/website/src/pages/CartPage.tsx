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
    setTimeout(() => setUpdated(false), 2000)
  }

  if (items.length === 0) {
    return (
      <main>
        <div className="gd-cart-wrap">
          <div className="gd-container" style={{ textAlign: 'center' }}>
            <i className="bi bi-bag-x" style={{ fontSize: 56, color: 'var(--text-3)' }} />
            <h1 className="gd-cart-title" style={{ marginTop: 24 }}>Giỏ hàng đang trống</h1>
            <p style={{ color: 'var(--text-2)', marginBottom: 32 }}>Hãy khám phá bộ sưu tập giày dép của chúng tôi để tìm đôi giày yêu thích.</p>
            <Link to="/san-pham" className="gd-btn gd-btn-primary">Khám phá ngay <i className="bi bi-arrow-right ms-1" /></Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main>
      <div className="gd-cart-wrap">
        <div className="gd-container">
          <nav className="gd-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Trang chủ</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span><span>Giỏ hàng</span>
          </nav>

          <div className="gd-cart-layout">
            <div>
              <h1 className="gd-cart-title">Giỏ hàng của bạn</h1>

              <div className="gd-cart-head">
                <span>Sản phẩm</span><span>Đơn giá</span><span>Số lượng</span><span>Tạm tính</span><span />
              </div>

              {items.map(item => (
                <div className="gd-cart-item" key={`${item.product_id}-${item.color ?? ''}-${item.size ?? ''}`}>
                  <div className="gd-cart-prod">
                    <div className="gd-cart-thumb"><img src={item.image} alt={item.name} loading="lazy" /></div>
                    <div>
                      <div className="gd-cart-prod-name">{item.name}</div>
                      {(item.color || item.size) && (
                        <div className="gd-cart-prod-var">
                          {item.color && <>Màu: {item.color}</>}{item.color && item.size && ' · '}{item.size && <>Size: {item.size}</>}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="gd-cart-price">{fmt(item.price)}</div>
                  <div className="gd-cart-qty" role="group" aria-label="Số lượng">
                    <button type="button" onClick={() => updateQty(item.product_id, item.qty - 1, item.color, item.size)} aria-label="Giảm số lượng">−</button>
                    <input
                      type="number" value={item.qty} min={1} max={99} aria-label={`Số lượng ${item.name}`}
                      onChange={e => updateQty(item.product_id, Math.max(1, parseInt(e.target.value) || 1), item.color, item.size)}
                    />
                    <button type="button" onClick={() => updateQty(item.product_id, item.qty + 1, item.color, item.size)} aria-label="Tăng số lượng">+</button>
                  </div>
                  <div className="gd-cart-subtotal">{fmt(item.price * item.qty)}</div>
                  <button className="gd-remove-btn" aria-label="Xóa sản phẩm khỏi giỏ" onClick={() => removeItem(item.product_id, item.color, item.size)}>
                    <i className="bi bi-x" />
                  </button>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, flexWrap: 'wrap', gap: 12 }}>
                <Link to="/san-pham" className="gd-btn gd-btn-ghost"><i className="bi bi-arrow-left me-1" />Tiếp tục mua sắm</Link>
                <button type="button" className="gd-btn gd-btn-cyan" onClick={handleUpdateCart}>
                  {updated ? <><i className="bi bi-check-circle me-1" />Đã cập nhật</> : <><i className="bi bi-arrow-repeat me-1" />Cập nhật giỏ hàng</>}
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 36, padding: 24, background: 'var(--surface)', borderRadius: 4, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-2)' }}>
                  <i className="bi bi-shield-lock-fill" style={{ color: 'var(--accent)', fontSize: 18 }} />
                  <div><strong style={{ display: 'block', color: 'var(--text)' }}>Thanh toán bảo mật</strong>SSL 256-bit encryption</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-2)' }}>
                  <i className="bi bi-truck" style={{ color: 'var(--accent)', fontSize: 18 }} />
                  <div><strong style={{ display: 'block', color: 'var(--text)' }}>Miễn phí vận chuyển</strong>Đơn hàng từ {fmt(freeShipThreshold)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-2)' }}>
                  <i className="bi bi-arrow-repeat" style={{ color: 'var(--accent)', fontSize: 18 }} />
                  <div><strong style={{ display: 'block', color: 'var(--text)' }}>Đổi size dễ dàng</strong>Trong vòng {settings.return_days || 15} ngày</div>
                </div>
              </div>
            </div>

            <aside>
              <div className="gd-order-summary">
                <h2 className="gd-summary-title">Tóm tắt đơn hàng</h2>
                <div className="gd-summary-row"><span>Tạm tính ({items.reduce((s, i) => s + i.qty, 0)} sản phẩm)</span><span>{fmt(subtotal)}</span></div>
                <div className="gd-summary-row">
                  <span>Phí vận chuyển</span>
                  <span style={{ color: effectiveShipping === 0 ? 'var(--accent)' : undefined }}>{effectiveShipping === 0 ? 'Miễn phí' : fmt(effectiveShipping)}</span>
                </div>
                {discount > 0 && (
                  <div className="gd-summary-row"><span>Giảm giá ({couponCode})</span><span style={{ color: 'var(--accent)' }}>−{fmt(discount)}</span></div>
                )}
                {couponCode ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, fontSize: 12, color: 'var(--text-2)', marginBottom: 12 }}>
                    <span>Mã <strong>{couponCode}</strong> đã áp dụng</span>
                    <button type="button" onClick={removeCoupon} style={{ background: 'none', border: 'none', color: 'var(--sale)', cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}>Gỡ mã</button>
                  </div>
                ) : (
                  <div className="gd-coupon-input">
                    <input type="text" value={couponInput} onChange={e => setCouponInput(e.target.value)} placeholder="Nhập mã giảm giá" aria-label="Mã giảm giá" disabled={checkingCoupon} />
                    <button type="button" onClick={applyCoupon} disabled={checkingCoupon}>{checkingCoupon ? 'Đang kiểm tra...' : 'Áp dụng'}</button>
                  </div>
                )}
                {couponMsg && <p style={{ fontSize: 12, color: 'var(--accent)', marginTop: -10, marginBottom: 12 }}>{couponMsg}</p>}
                {couponError && <p style={{ fontSize: 12, color: 'var(--sale)', marginTop: -10, marginBottom: 12 }}>{couponError}</p>}
                <div className="gd-summary-row total"><span>Tổng cộng</span><span>{fmt(total)}</span></div>
                <Link to="/thanh-toan" className="gd-btn-checkout"><i className="bi bi-lock-fill" />Thanh toán ngay</Link>
                <div className="gd-secure-badges">
                  <div className="gd-secure-badge"><i className="bi bi-shield-check" /> Bảo mật</div>
                  <div className="gd-secure-badge"><i className="bi bi-credit-card" /> VISA / MasterCard</div>
                  <div className="gd-secure-badge"><i className="bi bi-phone" /> MoMo / ZaloPay</div>
                </div>
              </div>
            </aside>
          </div>

          {related.length > 0 && (
            <div style={{ marginTop: 64 }}>
              <div className="gd-eyebrow" data-reveal>Gợi ý thêm</div>
              <h2 className="gd-sec-title" data-reveal data-delay="1">Bạn cũng có thể thích</h2>
              <div className="gd-related-grid" style={{ marginTop: 32 }}>
                {related.map((p, i) => (
                  <div className="gd-prod-card" data-reveal data-delay={String((i % 4) + 1)} key={p.id}>
                    <div className="gd-prod-thumb">
                      <Link to={`/san-pham/${p.slug}`}><img src={p.image} alt={p.name} loading="lazy" /></Link>
                      {p.badge && <div className={`gd-prod-badge${p.is_new ? ' new' : p.price_sale ? ' sale' : ''}`}>{p.badge}</div>}
                    </div>
                    <div className="gd-prod-info">
                      <div className="gd-prod-cat">{p.category_name}</div>
                      <h3 className="gd-prod-name"><Link to={`/san-pham/${p.slug}`}>{p.name}</Link></h3>
                      <div className="gd-prod-footer">
                        <span className="gd-prod-price-new">{fmt(p.price_sale || p.price)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
