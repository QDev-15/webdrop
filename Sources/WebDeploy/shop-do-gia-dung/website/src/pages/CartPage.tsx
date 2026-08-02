import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Crect fill='%23f5ede0' width='160' height='160'/%3E%3C/svg%3E"

export default function CartPage() {
  const { items, removeItem, updateQty, clear, count, coupon, setCoupon } = useCart()
  const { settings } = useSite()
  const navigate = useNavigate()

  const [couponInput, setCouponInput] = useState(coupon?.code ?? '')
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState('')

  useDocumentMeta({
    title: `Giỏ hàng (${count}) – Shop Đồ Gia Dụng`,
    description: 'Xem lại giỏ hàng của bạn trước khi thanh toán.',
  })

  const shippingFee    = Number(settings.shipping_fee || 50000)
  const freeThreshold  = Number(settings.free_shipping_threshold || 500000)

  const subtotal       = items.reduce((s, i) => s + i.price * i.qty, 0)
  const discount       = coupon?.discount ?? 0
  const actualShipping = subtotal - discount >= freeThreshold ? 0 : shippingFee
  const total          = subtotal - discount + actualShipping

  const handleApplyCoupon = async () => {
    const code = couponInput.trim().toUpperCase()
    if (!code) return
    setCouponLoading(true); setCouponError('')
    try {
      const res = await fetch('/api/public/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      })
      const data = await res.json()
      if (!res.ok) { setCouponError(data.message || 'Mã không hợp lệ'); return }
      setCoupon({ code, type: data.type, value: data.value, discount: data.discount })
    } catch {
      setCouponError('Không thể kiểm tra mã — vui lòng thử lại')
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setCoupon(null)
    setCouponInput('')
    setCouponError('')
  }

  if (items.length === 0) {
    return (
      <>
        <div className="dg-page-hero">
          <div className="dg-container">
            <p className="dg-page-hero__label">Mua sắm</p>
            <h1 className="dg-page-hero__title">Giỏ hàng</h1>
          </div>
        </div>
        <div className="dg-container" style={{ padding: '0 clamp(16px,4vw,64px)' }}>
          <div className="dg-cart-empty">
            <div className="dg-cart-empty__icon">🛒</div>
            <p className="dg-cart-empty__text">Giỏ hàng của bạn đang trống</p>
            <Link to="/san-pham" className="dg-btn dg-btn--primary dg-btn--lg">Tiếp tục mua sắm</Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="dg-page-hero">
        <div className="dg-container">
          <p className="dg-page-hero__label">Mua sắm</p>
          <h1 className="dg-page-hero__title">Giỏ hàng ({count} sản phẩm)</h1>
        </div>
      </div>

      <div className="dg-container" style={{ padding: '32px clamp(16px,4vw,64px) 64px' }}>
        <div className="dg-cart-layout">
          {/* Items */}
          <div>
            <table className="dg-cart-table">
              <thead>
                <tr>
                  <th colSpan={2}>Sản phẩm</th>
                  <th>Đơn giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={`${item.product_id}-${item.color}-${item.size}`}>
                    <td style={{ padding: '16px 0' }}>
                      <div className="dg-cart-item__img">
                        <img
                          src={item.image || ''}
                          alt={item.name}
                          onError={e => { (e.target as HTMLImageElement).src = FALLBACK }}
                        />
                      </div>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <p className="dg-cart-item__name">{item.name}</p>
                      {item.color && <p className="dg-cart-item__cat">Màu: {item.color}</p>}
                      {item.size  && <p className="dg-cart-item__cat">Kích cỡ: {item.size}</p>}
                    </td>
                    <td style={{ fontSize: 15, fontWeight: 600, color: 'var(--accent)', padding: '16px 0', whiteSpace: 'nowrap' }}>
                      {item.price.toLocaleString('vi-VN')}đ
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <div className="dg-qty">
                        <button className="dg-qty__btn" onClick={() => updateQty(item.product_id, item.qty - 1, item.color, item.size)}>−</button>
                        <span className="dg-qty__val">{item.qty}</span>
                        <button className="dg-qty__btn" onClick={() => updateQty(item.product_id, item.qty + 1, item.color, item.size)}>+</button>
                      </div>
                    </td>
                    <td style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', padding: '16px 0', whiteSpace: 'nowrap' }}>
                      {(item.price * item.qty).toLocaleString('vi-VN')}đ
                    </td>
                    <td style={{ padding: '16px 0 16px 12px' }}>
                      <button
                        className="dg-cart-item__remove"
                        onClick={() => removeItem(item.product_id, item.color, item.size)}
                        title="Xóa sản phẩm"
                      >✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/san-pham" className="dg-btn dg-btn--ghost">← Tiếp tục mua sắm</Link>
              <button
                className="dg-btn dg-btn--ghost"
                style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                onClick={clear}
              >
                🗑 Xóa tất cả
              </button>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="dg-cart-summary">
              <h2 className="dg-cart-summary__title">Tóm tắt đơn hàng</h2>

              <div className="dg-cart-summary__row">
                <span>Tạm tính ({count} sản phẩm)</span>
                <span>{subtotal.toLocaleString('vi-VN')}đ</span>
              </div>

              {/* Coupon */}
              {coupon ? (
                <div className="dg-coupon-applied">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>
                      🏷 Mã: <strong>{coupon.code}</strong>
                    </span>
                    <button
                      onClick={handleRemoveCoupon}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: 18, lineHeight: 1 }}
                      title="Xóa mã giảm giá"
                    >✕</button>
                  </div>
                  <div className="dg-cart-summary__row" style={{ borderBottom: 'none', paddingTop: 4 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Giảm giá</span>
                    <span style={{ color: 'var(--danger)', fontWeight: 600 }}>−{discount.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              ) : (
                <div className="dg-coupon-row">
                  <input
                    className="dg-coupon-input"
                    type="text"
                    placeholder="Nhập mã giảm giá..."
                    value={couponInput}
                    onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError('') }}
                    onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                  />
                  <button
                    className="dg-coupon-btn"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponInput.trim()}
                  >
                    {couponLoading ? '...' : 'Áp dụng'}
                  </button>
                  {couponError && <p className="dg-coupon-error">{couponError}</p>}
                </div>
              )}

              <div className="dg-cart-summary__row">
                <span>Phí vận chuyển</span>
                <span>
                  {actualShipping === 0
                    ? <span style={{ color: 'var(--sage)', fontWeight: 600 }}>Miễn phí</span>
                    : `${actualShipping.toLocaleString('vi-VN')}đ`
                  }
                </span>
              </div>

              {subtotal - discount < freeThreshold && (
                <p style={{ fontSize: 13, color: 'var(--text-3)', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                  Mua thêm <strong>{Math.max(0, freeThreshold - subtotal + discount).toLocaleString('vi-VN')}đ</strong> để được miễn phí giao hàng
                </p>
              )}

              <div className="dg-cart-summary__row dg-cart-summary__row--total" style={{ borderBottom: 'none', paddingTop: 14 }}>
                <span>Tổng cộng</span>
                <span style={{ color: 'var(--accent)' }}>{total.toLocaleString('vi-VN')}đ</span>
              </div>

              <button
                className="dg-btn dg-btn--primary dg-btn--lg"
                style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}
                onClick={() => navigate('/thanh-toan')}
              >
                Thanh toán ngay →
              </button>

              <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', marginTop: 14 }}>
                🔒 Thanh toán an toàn & bảo mật
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
