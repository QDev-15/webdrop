import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

function fmt(n: number) {
  return n.toLocaleString('vi-VN') + 'đ'
}

export default function CartPage() {
  useDocumentMeta({
    title: 'Giỏ hàng — NovaTech',
    description: 'Xem lại giỏ hàng và tiến hành thanh toán các sản phẩm laptop, PC gaming, linh kiện máy tính tại NovaTech.',
  })

  const { items, subtotal, updateQty, removeItem, couponCode, couponDiscount, applyCoupon, clearCoupon } = useCart()
  const { settings, products } = useSite()
  const [couponInput, setCouponInput] = useState('')
  const [couponMsg, setCouponMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [couponLoading, setCouponLoading] = useState(false)

  const shippingFee = Number(settings['shipping_fee'] || 0)
  const freeShipThreshold = Number(settings['free_shipping_threshold'] || 0)
  const effectiveShipping = freeShipThreshold > 0 && subtotal >= freeShipThreshold ? 0 : shippingFee
  const total = Math.max(0, subtotal + effectiveShipping - couponDiscount)

  const handleApplyCoupon = async () => {
    const code = couponInput.trim()
    if (!code) return
    setCouponLoading(true)
    setCouponMsg(null)
    const result = await applyCoupon(code)
    setCouponLoading(false)
    if (result.ok) {
      setCouponInput('')
      setCouponMsg({ text: `Đã áp dụng mã giảm giá thành công!`, ok: true })
    } else {
      setCouponMsg({ text: result.error ?? 'Mã giảm giá không hợp lệ', ok: false })
    }
  }

  const handleClearCoupon = () => {
    clearCoupon()
    setCouponInput('')
    setCouponMsg(null)
  }

  const related = products.filter(p => !items.some(i => i.product_id === p.id)).slice(0, 4)

  if (items.length === 0) {
    return (
      <main>
        <div className="mt-cart-wrap">
          <div className="mt-container">
            <nav className="mt-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Trang chủ</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span><span>Giỏ hàng</span>
            </nav>
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 56, marginBottom: 20 }}><i className="bi bi-bag-x" /></div>
              <h1 className="mt-cart-title">Giỏ hàng của bạn đang trống</h1>
              <Link to="/san-pham" className="mt-btn mt-btn-primary" style={{ marginTop: 12 }}>
                <i className="bi bi-cpu" /> Khám phá sản phẩm
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main>
      <div className="mt-cart-wrap">
        <div className="mt-container">
          <nav className="mt-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Trang chủ</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span><span>Giỏ hàng</span>
          </nav>

          <div className="mt-cart-layout">
            <div>
              <h1 className="mt-cart-title">Giỏ hàng của bạn</h1>

              <div className="mt-cart-head">
                <span>Sản phẩm</span><span>Đơn giá</span><span>Số lượng</span><span>Tạm tính</span><span></span>
              </div>

              {items.map(item => (
                <div className="mt-cart-item" key={`${item.product_id}-${item.color ?? ''}-${item.size ?? ''}`}>
                  <div className="mt-cart-prod">
                    <div className="mt-cart-thumb"><img src={item.image} alt={item.name} loading="lazy" /></div>
                    <div>
                      <div className="mt-cart-prod-name">{item.name}</div>
                      {(item.size || item.color) && (
                        <div className="mt-cart-prod-var">
                          {item.size ? `Cấu hình: ${item.size}` : ''}{item.size && item.color ? ' · ' : ''}{item.color ? `Màu: ${item.color}` : ''}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-cart-price">{fmt(item.price)}</div>
                  <div className="mt-cart-qty" role="group" aria-label="Số lượng">
                    <button onClick={() => updateQty(item.product_id, item.qty - 1, item.color, item.size)} aria-label="Giảm số lượng">−</button>
                    <input type="number" value={item.qty} min={1} max={99} readOnly aria-label={`Số lượng ${item.name}`} />
                    <button onClick={() => updateQty(item.product_id, item.qty + 1, item.color, item.size)} aria-label="Tăng số lượng">+</button>
                  </div>
                  <div className="mt-cart-subtotal">{fmt(item.price * item.qty)}</div>
                  <button className="mt-remove-btn" aria-label="Xóa sản phẩm khỏi giỏ" onClick={() => removeItem(item.product_id, item.color, item.size)}>
                    <i className="bi bi-x" />
                  </button>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, flexWrap: 'wrap', gap: 12 }}>
                <Link to="/san-pham" className="mt-btn mt-btn-ghost"><i className="bi bi-arrow-left me-1" />Tiếp tục mua sắm</Link>
              </div>

              <div className="mt-trust-strip">
                <div className="mt-trust-strip-item">
                  <i className="bi bi-shield-lock-fill" />
                  <div><strong>Thanh toán bảo mật</strong>SSL 256-bit encryption</div>
                </div>
                <div className="mt-trust-strip-item">
                  <i className="bi bi-truck" />
                  <div><strong>Miễn phí vận chuyển</strong>Đơn hàng từ {fmt(freeShipThreshold || 5000000)}</div>
                </div>
                <div className="mt-trust-strip-item">
                  <i className="bi bi-patch-check-fill" />
                  <div><strong>Bảo hành chính hãng</strong>Lên đến {settings['warranty_months'] || '24'} tháng</div>
                </div>
              </div>
            </div>

            <aside>
              <div className="mt-order-summary">
                <h2 className="mt-summary-title">Tóm tắt đơn hàng</h2>
                <div className="mt-summary-row"><span>Tạm tính ({items.length} sản phẩm)</span><span>{fmt(subtotal)}</span></div>
                <div className="mt-summary-row"><span>Phí vận chuyển</span><span style={{ color: effectiveShipping === 0 ? 'var(--accent)' : undefined }}>{effectiveShipping === 0 ? 'Miễn phí' : fmt(effectiveShipping)}</span></div>
                {couponCode ? (
                  <div className="mt-summary-row" style={{ color: 'var(--accent)' }}>
                    <span>
                      Mã <strong>{couponCode}</strong>
                      <button
                        type="button"
                        onClick={handleClearCoupon}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', marginLeft: 6, fontSize: 13, padding: 0 }}
                        aria-label="Xóa mã giảm giá"
                      >✕</button>
                    </span>
                    <span>−{fmt(couponDiscount)}</span>
                  </div>
                ) : (
                  <>
                    <div className="mt-coupon-input">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={e => setCouponInput(e.target.value.toUpperCase())}
                        onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder="Nhập mã giảm giá"
                        aria-label="Mã giảm giá"
                        disabled={couponLoading}
                      />
                      <button type="button" onClick={handleApplyCoupon} disabled={couponLoading || !couponInput.trim()}>
                        {couponLoading ? '...' : 'Áp dụng'}
                      </button>
                    </div>
                    {couponMsg && (
                      <p style={{ fontSize: 12, color: couponMsg.ok ? 'var(--accent)' : 'var(--danger, #e24b4a)', marginTop: -8, marginBottom: 8 }}>
                        {couponMsg.text}
                      </p>
                    )}
                  </>
                )}
                <div className="mt-summary-row total"><span>Tổng cộng</span><span>{fmt(total)}</span></div>
                <Link to="/thanh-toan" className="mt-btn-checkout"><i className="bi bi-lock-fill" />Thanh toán ngay</Link>
                <div className="mt-secure-badges">
                  <div className="mt-secure-badge"><i className="bi bi-shield-check" /> Bảo mật</div>
                  <div className="mt-secure-badge"><i className="bi bi-credit-card" /> VISA / MasterCard</div>
                  <div className="mt-secure-badge"><i className="bi bi-phone" /> MoMo / ZaloPay</div>
                </div>
              </div>
            </aside>
          </div>

          {related.length > 0 && (
            <div style={{ marginTop: 64 }}>
              <div className="mt-eyebrow" data-reveal>Gợi ý thêm</div>
              <h2 className="mt-sec-title" data-reveal data-delay="1">Bạn cũng có thể thích</h2>
              <div className="mt-related-grid" style={{ marginTop: 32 }}>
                {related.map(p => (
                  <div className="mt-prod-card" data-reveal key={p.id}>
                    <div className="mt-prod-thumb">
                      <Link to={`/san-pham/${p.slug}`}><img src={p.image} alt={p.name} loading="lazy" /></Link>
                      {p.badge && <div className={'mt-prod-badge' + (p.is_new ? ' new' : '')}>{p.badge}</div>}
                    </div>
                    <div className="mt-prod-info">
                      <div className="mt-prod-cat">{p.category_name}</div>
                      <h3 className="mt-prod-name"><Link to={`/san-pham/${p.slug}`}>{p.name}</Link></h3>
                      <div className="mt-prod-footer">
                        <span className="mt-prod-price-new">{fmt(p.price_sale || p.price)}</span>
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
