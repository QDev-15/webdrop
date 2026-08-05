import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useCart } from '../contexts/CartContext'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function CartPage() {
  const { items, subtotal, couponInfo, setCouponInfo, updateQty, removeItem } = useCart()
  const { settings } = useSite()
  useDocumentMeta({ title: 'Giỏ hàng — KidZone' })

  const [couponInput, setCouponInput] = useState(couponInfo?.code ?? '')
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError]   = useState('')

  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'
  const shippingFee       = Number(settings['shipping_fee'] || 0)
  const freeShipThreshold = Number(settings['free_shipping_threshold'] || 0)
  const effectiveShipping = freeShipThreshold > 0 && subtotal >= freeShipThreshold ? 0 : shippingFee
  const discount          = couponInfo?.discount ?? 0
  const total             = subtotal + effectiveShipping - discount

  const handleApplyCoupon = async () => {
    const code = couponInput.trim().toUpperCase()
    if (!code) { setCouponError('Vui lòng nhập mã giảm giá'); return }
    setCouponLoading(true); setCouponError('')
    try {
      const result = await api.post<{ code: string; type: 'percent' | 'fixed'; value: number; discount: number }>(
        '/public/coupons/validate',
        { code, subtotal }
      )
      setCouponInfo(result)
    } catch (err) {
      setCouponError(err instanceof Error ? err.message : 'Mã không hợp lệ')
      setCouponInfo(null)
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setCouponInfo(null)
    setCouponInput('')
    setCouponError('')
  }

  if (items.length === 0) {
    return (
      <div className="dc-page-wrap">
        <div className="dc-page-hero">
          <div className="dc-container">
            <h1>Giỏ hàng của bạn</h1>
          </div>
        </div>
        <div style={{ padding: '80px 0', textAlign: 'center' }}>
          <div className="dc-container">
            <div style={{ fontSize: 64, marginBottom: 24 }}>🛒</div>
            <h2 style={{ marginBottom: 16 }}>Giỏ hàng đang trống</h2>
            <p style={{ color: 'var(--text-2)', marginBottom: 32 }}>Hãy thêm một số sản phẩm để bắt đầu mua sắm!</p>
            <Link to="/san-pham" style={{ display: 'inline-block', padding: '12px 32px', background: 'var(--accent)', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
              Xem sản phẩm
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dc-page-wrap">
      <div className="dc-page-hero">
        <div className="dc-container">
          <h1>Giỏ hàng của bạn</h1>
        </div>
      </div>

      <div style={{ padding: '48px 0' }}>
        <div className="dc-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            {/* Items */}
            <div>
              <h2 style={{ marginBottom: 24 }}>Chi tiết đơn hàng</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {items.map((item, i) => (
                  <div key={i} style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 8, display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 16, alignItems: 'center' }}>
                    <Link to={`/san-pham/${item.slug}`}>
                      <img src={item.image} alt={item.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6 }} />
                    </Link>
                    <div>
                      <Link to={`/san-pham/${item.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h3 style={{ marginBottom: 4 }}>{item.name}</h3>
                      </Link>
                      <p style={{ color: 'var(--text-2)', fontSize: 14, marginBottom: 8 }}>{fmt(item.price)}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button onClick={() => updateQty(item.product_id, item.qty - 1)} style={{ padding: '4px 8px', background: 'none', border: '1px solid var(--border)', borderRadius: 4, cursor: 'pointer' }}>−</button>
                        <span style={{ minWidth: 30, textAlign: 'center', fontWeight: 600 }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.product_id, item.qty + 1)} style={{ padding: '4px 8px', background: 'none', border: '1px solid var(--border)', borderRadius: 4, cursor: 'pointer' }}>+</button>
                        <button onClick={() => removeItem(item.product_id)} style={{ marginLeft: 'auto', padding: '4px 8px', background: 'none', border: 'none', color: '#991b1b', cursor: 'pointer', fontSize: 12 }}>Xóa</button>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 600 }}>{fmt(item.price * item.qty)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/san-pham" style={{ display: 'inline-block', marginTop: 24, color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>← Tiếp tục mua sắm</Link>
            </div>

            {/* Summary */}
            <div>
              <div style={{ padding: 24, border: '1px solid var(--border)', borderRadius: 8, position: 'sticky', top: 80 }}>
                <h2 style={{ fontSize: 18, marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>Tóm tắt đơn hàng</h2>

                {/* Coupon input */}
                {couponInfo ? (
                  <div style={{ marginBottom: 16, padding: '10px 14px', background: 'var(--accent-light, #e8f4ef)', borderRadius: 8, border: '1px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--accent)', fontSize: 13 }}>🎉 {couponInfo.code}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-2)', marginLeft: 8 }}>
                        {couponInfo.type === 'percent' ? `−${couponInfo.value}%` : `−${fmt(couponInfo.value)}`}
                      </span>
                    </div>
                    <button onClick={handleRemoveCoupon} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: 16, lineHeight: 1 }}>✕</button>
                  </div>
                ) : (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="text"
                        value={couponInput}
                        onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError('') }}
                        onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder="Nhập mã giảm giá"
                        style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'monospace', letterSpacing: 0.5, outline: 'none' }}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                        style={{ padding: '8px 16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}
                      >
                        {couponLoading ? '...' : 'Áp dụng'}
                      </button>
                    </div>
                    {couponError && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 6 }}>{couponError}</p>}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span>Tạm tính</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span>Phí vận chuyển</span>
                  <span style={{ color: effectiveShipping === 0 ? 'var(--accent)' : 'inherit' }}>
                    {effectiveShipping === 0 ? '🎉 Miễn phí' : fmt(effectiveShipping)}
                  </span>
                </div>
                {couponInfo && discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, color: 'var(--accent)' }}>
                    <span>Giảm giá ({couponInfo.code})</span>
                    <span>−{fmt(discount)}</span>
                  </div>
                )}
                {effectiveShipping === 0 && freeShipThreshold > 0 && (
                  <p style={{ fontSize: 12, color: 'var(--accent)', marginBottom: 16 }}>✓ Bạn được miễn phí vận chuyển!</p>
                )}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginBottom: 24, display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 600 }}>
                  <span>Tổng cộng</span>
                  <span style={{ color: 'var(--accent)' }}>{fmt(total)}</span>
                </div>
                <Link to="/thanh-toan" style={{ display: 'block', textAlign: 'center', padding: '12px 24px', background: 'var(--accent)', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 600, marginBottom: 12 }}>
                  Tiến hành thanh toán
                </Link>
                {freeShipThreshold > 0 && subtotal < freeShipThreshold && (
                  <p style={{ fontSize: 12, color: 'var(--text-2)', textAlign: 'center' }}>
                    Thêm {fmt(freeShipThreshold - subtotal)} để được miễn phí vận chuyển
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
