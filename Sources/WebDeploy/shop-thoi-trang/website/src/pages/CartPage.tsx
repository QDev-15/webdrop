import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

export default function CartPage() {
  const { items, subtotal, coupon, updateQty, removeItem, clear, setCoupon } = useCart()
  const { settings, products } = useSite()
  const [couponInput, setCouponInput] = useState('')
  const [couponMsg, setCouponMsg] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)
  const [applying, setApplying] = useState(false)

  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'
  const shippingFee = Number(settings.shipping_fee || 0)
  const freeShipThreshold = Number(settings.free_shipping_threshold || 0)
  const effectiveShipping = freeShipThreshold > 0 && subtotal >= freeShipThreshold ? 0 : shippingFee
  const discount = coupon?.discount ?? 0
  const total = Math.max(0, subtotal + effectiveShipping - discount)
  const remainingForFreeShip = freeShipThreshold - subtotal

  const related = products.filter(p => !items.some(i => i.product_id === p.id)).slice(0, 3)

  const applyCoupon = async () => {
    if (!couponInput.trim()) return
    setApplying(true)
    setCouponMsg(null)
    try {
      const data = await api.post<{ code: string; discount: number }>('/public/coupons/validate', { code: couponInput.trim(), subtotal })
      setCoupon({ code: data.code, discount: data.discount })
      setCouponMsg({ type: 'ok', text: `Đã áp dụng mã ${data.code} — giảm ${fmt(data.discount)}` })
    } catch (err) {
      setCoupon(null)
      setCouponMsg({ type: 'error', text: err instanceof Error ? err.message : 'Mã giảm giá không hợp lệ' })
    } finally {
      setApplying(false)
    }
  }

  if (items.length === 0) {
    return (
      <section className="st-sec" aria-label="Giỏ hàng trống">
        <div className="st-container-sm" style={{ textAlign: 'center', paddingTop: 80, paddingBottom: 40 }}>
          <i className="bi bi-bag-x" style={{ fontSize: 56, color: 'var(--text-3)' }} />
          <h1 className="st-page-title" style={{ color: 'var(--text)', marginTop: 24 }}>Giỏ Hàng Trống</h1>
          <p className="st-sec-sub" style={{ margin: '0 auto 32px' }}>Giỏ hàng của bạn chưa có sản phẩm nào — hãy khám phá bộ sưu tập của chúng tôi!</p>
          <Link to="/san-pham" className="st-btn st-btn-primary st-btn-lg">Khám Phá Ngay <i className="bi bi-arrow-right" /></Link>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="st-page-hero" aria-label="Tiêu đề trang">
        <div className="st-container">
          <nav className="st-breadcrumb mb-3" aria-label="Điều hướng">
            <Link to="/">Trang chủ</Link>
            <span className="st-breadcrumb-sep">/</span>
            <span>Giỏ hàng</span>
          </nav>
          <h1 className="st-page-title">Giỏ Hàng</h1>
          <p style={{ color: 'rgba(255,255,255,.45)', fontSize: 14, fontWeight: 600, marginTop: 6 }}>
            {items.reduce((s, i) => s + i.qty, 0)} sản phẩm trong giỏ hàng của bạn
          </p>
        </div>
      </section>

      <section className="st-sec" aria-label="Giỏ hàng">
        <div className="st-container">
          <div className="st-cart-layout">
            <div>
              <div className="st-cart-table-wrap">
                <table className="st-cart-table">
                  <thead>
                    <tr>
                      <th style={{ minWidth: 260 }}>Sản phẩm</th>
                      <th>Giá</th>
                      <th>Số lượng</th>
                      <th>Tổng</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <tr key={`${item.product_id}-${item.color ?? ''}-${item.size ?? ''}`}>
                        <td>
                          <div className="st-cart-item-wrap">
                            <img className="st-cart-img" src={item.image} alt={item.name} loading="lazy" />
                            <div>
                              <div className="st-cart-name"><Link to={`/san-pham/${item.slug}`}>{item.name}</Link></div>
                              <div className="st-cart-meta">
                                {item.color && <>Màu: {item.color}<br /></>}
                                {item.size && <>Size: {item.size}</>}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td><div className="st-cart-price">{fmt(item.price)}</div></td>
                        <td>
                          <div className="st-qty-ctrl">
                            <button type="button" onClick={() => updateQty(item.product_id, item.qty - 1, item.color, item.size)} aria-label="Giảm số lượng"><i className="bi bi-dash" /></button>
                            <input type="number" value={item.qty} min={1} max={99} style={{ width: 40, height: 40 }} aria-label={`Số lượng ${item.name}`}
                              onChange={e => updateQty(item.product_id, Math.max(1, parseInt(e.target.value) || 1), item.color, item.size)} />
                            <button type="button" onClick={() => updateQty(item.product_id, item.qty + 1, item.color, item.size)} aria-label="Tăng số lượng"><i className="bi bi-plus" /></button>
                          </div>
                        </td>
                        <td><div className="st-cart-price">{fmt(item.price * item.qty)}</div></td>
                        <td>
                          <button className="st-cart-del" type="button" onClick={() => removeItem(item.product_id, item.color, item.size)} aria-label="Xóa sản phẩm">
                            <i className="bi bi-x-lg" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <Link to="/san-pham" className="st-btn st-btn-outline"><i className="bi bi-chevron-left" /> Tiếp tục mua sắm</Link>
                <button type="button" className="st-btn st-btn-outline" style={{ borderColor: 'var(--sale)', color: 'var(--sale)' }} onClick={clear}>
                  <i className="bi bi-trash3" /> Xóa giỏ hàng
                </button>
              </div>

              <div className="d-flex gap-4 flex-wrap mt-5 pt-4" style={{ borderTop: '1px solid var(--border-light)' }}>
                <div className="st-trust-item"><i className="bi bi-truck" style={{ color: 'var(--accent)', fontSize: 18 }} /><span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>Freeship đơn trên {fmt(freeShipThreshold)}</span></div>
                <div className="st-trust-item"><i className="bi bi-shield-check" style={{ color: 'var(--accent)', fontSize: 18 }} /><span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>Thanh toán bảo mật 100%</span></div>
                <div className="st-trust-item"><i className="bi bi-arrow-repeat" style={{ color: 'var(--accent)', fontSize: 18 }} /><span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>Đổi trả trong {settings.return_days || 14} ngày</span></div>
              </div>
            </div>

            <div className="st-cart-summary">
              <div className="st-sum-title">Tóm Tắt Đơn Hàng</div>

              <div className="st-sum-row">
                <span>Tạm tính ({items.reduce((s, i) => s + i.qty, 0)} sản phẩm)</span>
                <span>{fmt(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="st-sum-row">
                  <span>Giảm giá ({coupon?.code})</span>
                  <span style={{ color: 'var(--sale)' }}>-{fmt(discount)}</span>
                </div>
              )}
              <div className="st-sum-row">
                <span>Phí vận chuyển</span>
                <span style={{ color: effectiveShipping === 0 ? 'var(--accent)' : undefined, fontWeight: effectiveShipping === 0 ? 700 : undefined }}>
                  {effectiveShipping === 0 ? 'MIỄN PHÍ' : fmt(effectiveShipping)}
                </span>
              </div>
              {remainingForFreeShip > 0 && freeShipThreshold > 0 && (
                <p style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: -6, marginBottom: 12 }}>Mua thêm {fmt(remainingForFreeShip)} để được miễn phí vận chuyển</p>
              )}

              <div className="st-divider" />

              <div style={{ marginBottom: 6 }}>
                <label htmlFor="stCoupon" className="st-form-label">Mã giảm giá</label>
              </div>
              <div className="st-coupon-row">
                <input type="text" id="stCoupon" value={couponInput} onChange={e => setCouponInput(e.target.value.toUpperCase())} placeholder="Nhập mã giảm giá..." aria-label="Mã giảm giá" />
                <button type="button" onClick={applyCoupon} disabled={applying}>{applying ? '...' : 'Áp Dụng'}</button>
              </div>
              {couponMsg && (
                <p style={{ fontSize: 12, marginTop: -14, marginBottom: 16, color: couponMsg.type === 'ok' ? 'var(--accent)' : 'var(--sale)' }}>{couponMsg.text}</p>
              )}

              <div className="st-sum-total">
                <span className="st-sum-total-label">Tổng Cộng</span>
                <span className="st-sum-total-val">{fmt(total)}</span>
              </div>

              <Link to="/thanh-toan" className="st-btn st-btn-primary st-btn-lg w-100 justify-content-center mt-4">
                Tiến hành thanh toán <i className="bi bi-arrow-right" />
              </Link>

              <p className="st-checkout-note">
                Bằng cách đặt hàng, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật của chúng tôi.
              </p>

              <div className="d-flex justify-content-center gap-2 mt-4 flex-wrap">
                <span className="st-pay-badge" style={{ background: 'var(--bg)' }}>VNPAY</span>
                <span className="st-pay-badge" style={{ background: 'var(--bg)' }}>MoMo</span>
                <span className="st-pay-badge" style={{ background: 'var(--bg)' }}>ZaloPay</span>
                <span className="st-pay-badge" style={{ background: 'var(--bg)' }}>COD</span>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div className="st-sec-sm" style={{ marginTop: 16 }}>
              <div className="d-flex align-items-end justify-content-between mb-4 flex-wrap gap-3">
                <div>
                  <div className="st-eyebrow">Gợi Ý</div>
                  <h2 className="st-sec-title mb-0">Bạn Có Thể Thích</h2>
                </div>
                <Link to="/san-pham" className="st-btn st-btn-outline">Xem thêm <i className="bi bi-arrow-right" /></Link>
              </div>
              <div className="st-prods-grid">
                {related.map(p => (
                  <div className="st-prod-card" data-reveal key={p.id}>
                    <div className="st-prod-thumb">
                      <Link to={`/san-pham/${p.slug}`}><img src={p.image} alt={p.name} loading="lazy" /></Link>
                      <div className="st-prod-actions"><Link to={`/san-pham/${p.slug}`} aria-label="Xem chi tiết">Xem chi tiết</Link></div>
                    </div>
                    <div className="st-prod-info">
                      <div className="st-prod-name"><Link to={`/san-pham/${p.slug}`}>{p.name}</Link></div>
                      <div className="st-prod-price"><span className="st-price-current">{fmt(p.price_sale || p.price)}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
