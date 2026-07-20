import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useCart } from '../contexts/CartContext'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface CouponValidateResult { code: string; type: 'percent' | 'fixed'; discount: number }

export default function CartPage() {
  useDocumentMeta({
    title: 'Giỏ Hàng — Tươi Mỗi Ngày',
    description: 'Xem lại giỏ hàng, áp dụng mã giảm giá và tiến hành thanh toán đơn thực phẩm sạch của bạn.',
  })
  const { items, subtotal, updateQty, removeItem, couponCode, setCouponCode } = useCart()
  const { settings } = useSite()
  const [couponInput, setCouponInput] = useState('')
  const [couponMsg, setCouponMsg] = useState('')
  const [couponError, setCouponError] = useState('')
  const [discount, setDiscount] = useState(0)
  const [checkingCoupon, setCheckingCoupon] = useState(false)

  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'
  const shippingFee = Number(settings.shipping_fee || 0)
  const freeShipThreshold = Number(settings.free_shipping_threshold || 0)
  const effectiveShipping = freeShipThreshold > 0 && subtotal >= freeShipThreshold ? 0 : shippingFee
  const total = Math.max(0, subtotal + effectiveShipping - discount)

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

  if (items.length === 0) {
    return (
      <div className="tp-container tp-cart-wrap" style={{ textAlign: 'center' }}>
        <i className="bi bi-bag" style={{ fontSize: 56, color: 'var(--accent-light)' }} />
        <h1 className="tp-page-title" style={{ marginTop: 24 }}>Giỏ hàng đang trống</h1>
        <p style={{ color: 'var(--text-2)', marginBottom: 32 }}>Hãy khám phá các sản phẩm thực phẩm sạch của chúng tôi để bắt đầu đặt hàng.</p>
        <Link to="/san-pham" className="tp-btn tp-btn-primary">Khám phá ngay <i className="bi bi-arrow-right" /></Link>
      </div>
    )
  }

  return (
    <div className="tp-container tp-cart-wrap">
      <div className="tp-breadcrumb" style={{ marginBottom: 24 }}>
        <Link to="/">Trang chủ</Link>
        <i className="bi bi-chevron-right" style={{ fontSize: 10 }} />
        <span>Giỏ hàng</span>
      </div>
      <h1 className="tp-page-title" style={{ marginBottom: 32 }}>Giỏ hàng của bạn</h1>

      <div className="tp-cart-layout">
        <div className="tp-cart-table-wrap">
          <table className="tp-cart-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Tạm tính</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={`${item.product_id}-${item.color ?? ''}-${item.size ?? ''}`}>
                  <td>
                    <div className="tp-cart-item-wrap">
                      <img className="tp-cart-img" src={item.image} alt={item.name} />
                      <div>
                        <Link to={`/san-pham/${item.slug}`} className="tp-cart-name" style={{ display: 'block' }}>{item.name}</Link>
                      </div>
                    </div>
                  </td>
                  <td className="tp-cart-price">{fmt(item.price)}</td>
                  <td>
                    <div className="tp-cart-qty">
                      <button aria-label="Giảm số lượng" onClick={() => updateQty(item.product_id, item.qty - 1, item.color, item.size)}>−</button>
                      <input type="text" value={item.qty} readOnly aria-label={`Số lượng ${item.name}`} />
                      <button aria-label="Tăng số lượng" onClick={() => updateQty(item.product_id, item.qty + 1, item.color, item.size)}>+</button>
                    </div>
                  </td>
                  <td className="tp-cart-price">{fmt(item.price * item.qty)}</td>
                  <td><button className="tp-cart-del" aria-label="Xóa sản phẩm" onClick={() => removeItem(item.product_id, item.color, item.size)}><i className="bi bi-trash" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/san-pham" className="tp-btn tp-btn-ghost" style={{ marginTop: 24 }}>
            <i className="bi bi-arrow-left" /> Tiếp tục mua sắm
          </Link>
        </div>

        <aside className="tp-order-summary">
          <div className="tp-summary-title">Tóm tắt đơn hàng</div>
          <div className="tp-summary-row"><span>Tạm tính</span><span>{fmt(subtotal)}</span></div>
          <div className="tp-summary-row">
            <span>Phí giao hàng lạnh</span>
            <span>{effectiveShipping === 0 ? 'Miễn phí' : fmt(effectiveShipping)}</span>
          </div>
          {discount > 0 && (
            <div className="tp-summary-row"><span>Giảm giá ({couponCode})</span><span>−{fmt(discount)}</span></div>
          )}

          {couponCode ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, fontSize: 12, color: 'var(--text-2)', margin: '20px 0' }}>
              <span>Mã <strong>{couponCode}</strong> đã áp dụng</span>
              <button type="button" onClick={removeCoupon} style={{ background: 'none', border: 'none', color: 'var(--sale)', cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}>Gỡ mã</button>
            </div>
          ) : (
            <div className="tp-coupon-row">
              <input type="text" value={couponInput} onChange={e => setCouponInput(e.target.value)} placeholder="Mã giảm giá" aria-label="Mã giảm giá" disabled={checkingCoupon} />
              <button type="button" onClick={applyCoupon} disabled={checkingCoupon}>{checkingCoupon ? 'Đang kiểm tra...' : 'Áp dụng'}</button>
            </div>
          )}
          {couponMsg && <p style={{ fontSize: 12, color: 'var(--accent)', marginTop: -8, marginBottom: 12 }}>{couponMsg}</p>}
          {couponError && <p style={{ fontSize: 12, color: 'var(--sale)', marginTop: -8, marginBottom: 12 }}>{couponError}</p>}

          <div className="tp-summary-total">
            <span className="tp-summary-total-label">Tổng cộng</span>
            <span className="tp-summary-total-val">{fmt(total)}</span>
          </div>

          <Link to="/thanh-toan" className="tp-btn tp-btn-primary tp-btn-full" style={{ marginTop: 20 }}>
            Tiến hành thanh toán <i className="bi bi-arrow-right" />
          </Link>
          <p className="tp-secure-note"><i className="bi bi-shield-check" /> Thanh toán an toàn · Giao hàng đúng hẹn</p>
        </aside>
      </div>
    </div>
  )
}
