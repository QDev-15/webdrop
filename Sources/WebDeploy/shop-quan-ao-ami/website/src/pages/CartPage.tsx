import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useCart } from '../contexts/CartContext'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { fmtPrice, onImgError } from '../lib/format'

export default function CartPage() {
  const { items, subtotal, couponCode, couponDiscount, applyCoupon, clearCoupon, updateQty, removeItem, clear } = useCart()
  const { settings } = useSite()

  useDocumentMeta({
    title: `Giỏ hàng — ${settings.site_name || 'AMI Fashion'}`,
    description: `Xem giỏ hàng và thanh toán đơn hàng tại ${settings.site_name || 'AMI Fashion'}.`,
  })

  const shippingFee = Number(settings.shipping_fee || 0)
  const freeShipThreshold = Number(settings.free_shipping_threshold || 0)
  const effectiveShipping = items.length === 0 ? 0 : (freeShipThreshold > 0 && subtotal >= freeShipThreshold ? 0 : shippingFee)
  const total = Math.max(0, subtotal + effectiveShipping - couponDiscount)

  const [couponInput, setCouponInput] = useState(couponCode || '')
  const [couponError, setCouponError] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)

  const handleClear = () => {
    if (confirm('Xóa toàn bộ giỏ hàng?')) clear()
  }

  const handleApplyCoupon = async () => {
    const code = couponInput.trim().toUpperCase()
    if (!code) { setCouponError('Vui lòng nhập mã giảm giá'); return }
    setCouponLoading(true)
    setCouponError('')
    try {
      const res = await api.post<{ code: string; type: string; discount: number }>('/public/coupons/validate', {
        code,
        subtotal,
      })
      applyCoupon(res.code, res.discount)
      setCouponInput(res.code)
      setCouponError('')
    } catch (err) {
      setCouponError(err instanceof Error ? err.message : 'Mã giảm giá không hợp lệ')
      clearCoupon()
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    clearCoupon()
    setCouponInput('')
    setCouponError('')
  }

  return (
    <main className="am-page-body">
      <div className="am-container am-cart-wrap">
        <div className="am-page-hero" style={{ borderBottom: 'none', paddingBottom: 24 }}>
          <h1>Giỏ hàng</h1>
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22, color: 'var(--text-3)', marginBottom: 24 }}>Giỏ hàng của bạn đang trống.</p>
            <Link to="/san-pham" className="am-link-btn">Tiếp tục mua sắm →</Link>
          </div>
        ) : (
          <div className="row g-5">
            <div className="col-lg-8">
              <table className="am-cart-table w-100">
                <thead>
                  <tr>
                    <th colSpan={2}>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th style={{ textAlign: 'right' }}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr className="am-cart-item" key={`${item.product_id}-${item.color ?? ''}-${item.size ?? ''}`}>
                      <td style={{ width: 90, paddingRight: 16 }}>
                        <img src={item.image} alt={item.name} className="am-cart-thumb" onError={onImgError} />
                      </td>
                      <td>
                        <div className="am-cart-item-name">{item.name}</div>
                        <div className="am-cart-item-meta">
                          {item.color || ''}{item.size ? ` · Size ${item.size}` : ''}
                        </div>
                        <div style={{ marginTop: 8, fontSize: 14, fontWeight: 400, color: 'var(--text)' }}>{fmtPrice(item.price)}</div>
                      </td>
                      <td>
                        <div className="am-qty-wrap">
                          <button className="am-qty-btn" type="button" onClick={() => updateQty(item.product_id, item.qty - 1, item.color, item.size)}>−</button>
                          <input type="number" className="am-qty-val" value={item.qty} min={1} max={99} aria-label="Số lượng" onChange={e => updateQty(item.product_id, Math.max(1, Math.min(99, Number(e.target.value) || 1)), item.color, item.size)} />
                          <button className="am-qty-btn" type="button" onClick={() => updateQty(item.product_id, item.qty + 1, item.color, item.size)}>+</button>
                        </div>
                        <button className="am-cart-remove" type="button" style={{ marginTop: 8 }} onClick={() => removeItem(item.product_id, item.color, item.size)}>Xóa</button>
                      </td>
                      <td style={{ textAlign: 'right', fontSize: 14, fontWeight: 400 }}>{fmtPrice(item.price * item.qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <Link to="/san-pham" className="am-link-btn">← Tiếp tục mua sắm</Link>
                <button type="button" onClick={handleClear} style={{ background: 'none', border: 'none', fontSize: 12, letterSpacing: 1, color: 'var(--text-3)', textDecoration: 'underline', textUnderlineOffset: 2, cursor: 'pointer' }}>Xóa giỏ hàng</button>
              </div>
            </div>

            <div className="col-lg-4">
              {/* Coupon */}
              <div className="am-cart-coupon" style={{ marginBottom: 16, padding: '16px', border: '1px solid var(--border)', borderRadius: 8 }}>
                <p style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 10 }}>Mã giảm giá</p>
                {couponCode ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                    <span style={{ fontWeight: 600, color: 'var(--sage, #6b8067)', fontSize: 14 }}>
                      ✓ {couponCode} — −{fmtPrice(couponDiscount)}
                    </span>
                    <button type="button" onClick={handleRemoveCoupon} style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--text-3)', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 2 }}>Bỏ</button>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="text"
                        value={couponInput}
                        onChange={e => setCouponInput(e.target.value.toUpperCase())}
                        onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder="Nhập mã giảm giá"
                        style={{ flex: 1, padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13, fontFamily: 'var(--sans)' }}
                        aria-label="Mã giảm giá"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                        style={{ padding: '8px 14px', background: 'var(--sage, #6b8067)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, cursor: couponLoading ? 'wait' : 'pointer', fontFamily: 'var(--sans)', whiteSpace: 'nowrap' }}
                      >
                        {couponLoading ? '...' : 'Áp dụng'}
                      </button>
                    </div>
                    {couponError && <p style={{ fontSize: 12, color: '#e24b4a', marginTop: 6, marginBottom: 0 }}>{couponError}</p>}
                  </>
                )}
              </div>

              {/* Order summary */}
              <div className="am-cart-summary">
                <p style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 20 }}>Tổng đơn hàng</p>
                <div className="am-summary-row">
                  <span>Tạm tính</span>
                  <span>{fmtPrice(subtotal)}</span>
                </div>
                <div className="am-summary-row">
                  <span>Phí vận chuyển</span>
                  <span>{effectiveShipping === 0 ? 'Miễn phí' : fmtPrice(effectiveShipping)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="am-summary-row" style={{ color: 'var(--sage, #6b8067)' }}>
                    <span>Giảm giá ({couponCode})</span>
                    <span>−{fmtPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="am-summary-total">
                  <span>Tổng cộng</span>
                  <span>{fmtPrice(total)}</span>
                </div>
                <Link to="/thanh-toan" className="am-btn-primary" style={{ marginTop: 20, display: 'block', textAlign: 'center' }}>Tiến hành thanh toán</Link>
                <p style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'center', marginTop: 12 }}>
                  Miễn phí ship đơn từ {fmtPrice(freeShipThreshold || 599000)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
