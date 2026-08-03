import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useCart } from '../contexts/CartContext'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { fmtPrice, parsePadded, onImgError } from '../lib/format'
import ProductCard from '../components/ProductCard'

export default function CartPage() {
  const { items, subtotal, couponCode, couponDiscount, applyCoupon, clearCoupon, updateQty, removeItem } = useCart()
  const { settings, products } = useSite()
  const navigate = useNavigate()

  // ── Coupon state ────────────────────────────────────────────────────────────
  const [couponInput, setCouponInput] = useState(couponCode ?? '')
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')
  const couponInputRef = useRef<HTMLInputElement>(null)

  const handleApplyCoupon = async () => {
    const code = couponInput.trim().toUpperCase()
    if (!code) { setCouponError('Vui lòng nhập mã giảm giá'); return }
    setCouponLoading(true)
    setCouponError('')
    setCouponSuccess('')
    try {
      const res = await api.post<{ code: string; type: string; discount: number }>(
        '/public/coupons/validate',
        { code, subtotal }
      )
      applyCoupon(res.code, res.discount)
      setCouponSuccess(`Áp dụng thành công! Giảm ${fmtPrice(res.discount)}`)
    } catch (err) {
      setCouponError(err instanceof Error ? err.message : 'Mã không hợp lệ')
    } finally {
      setCouponLoading(false)
    }
  }

  const handleClearCoupon = () => {
    clearCoupon()
    setCouponInput('')
    setCouponError('')
    setCouponSuccess('')
    couponInputRef.current?.focus()
  }

  useDocumentMeta({
    title: `Giỏ Hàng — ${settings.site_name || 'LUMIÈRE Beauty'}`,
    description: `Xem và quản lý giỏ hàng của bạn tại ${settings.site_name || 'LUMIÈRE Beauty'}. Freeship đơn từ 500K, đổi trả 30 ngày.`,
  })

  const shippingFee = Number(settings.shipping_fee || 30000)
  const freeShipThreshold = Number(settings.free_shipping_threshold || 500000)
  const shipping = items.length === 0 ? 0 : (freeShipThreshold > 0 && subtotal >= freeShipThreshold ? 0 : shippingFee)
  const total = Math.max(0, subtotal + shipping - couponDiscount)

  const cartIds = items.map(i => i.product_id)
  const suggested = useMemo(
    () => products.filter(p => !cartIds.includes(p.id) && parsePadded(p.theme).includes('ban-chay')).slice(0, 4),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [products, items]
  )

  return (
    <main id="mp-main">
      <section className="mp-page-hero">
        <div className="wd-container">
          <nav aria-label="Breadcrumb">
            <ol className="mp-breadcrumb">
              <li><Link to="/">Trang chủ</Link></li>
              <li><span>Giỏ hàng</span></li>
            </ol>
          </nav>
          <h1 className="mp-page-hero-title">Giỏ Hàng</h1>
        </div>
      </section>

      <div className="wd-container">
        {items.length === 0 ? (
          <div className="mp-cart-empty" aria-live="polite" role="status">
            <div className="mp-empty-icon" aria-hidden="true">🛍️</div>
            <h2>Giỏ hàng của bạn đang trống</h2>
            <p>Hãy khám phá các sản phẩm mỹ phẩm tuyệt vời từ LUMIÈRE.</p>
            <Link to="/san-pham" className="mp-btn mp-btn-accent">Xem sản phẩm</Link>
          </div>
        ) : (
          <div className="mp-cart-wrap">
            <div className="mp-cart-layout">
              <div className="mp-cart-items-col">
                <div className="mp-cart-header-row" role="row" aria-label="Tiêu đề bảng giỏ hàng">
                  <span>Sản phẩm</span>
                  <span>Đơn giá</span>
                  <span>Số lượng</span>
                  <span>Thành tiền</span>
                  <span></span>
                </div>
                <div aria-label="Danh sách sản phẩm trong giỏ" aria-live="polite">
                  {items.map(item => (
                    <div className="mp-cart-item" data-item-id={item.product_id} role="row" key={item.product_id}>
                      <div className="mp-cart-item-product">
                        <img src={item.image} alt={item.name} className="mp-cart-item-img" loading="lazy" onError={onImgError} />
                        <div className="mp-cart-item-detail">
                          <div className="mp-cart-item-name">{item.name}</div>
                        </div>
                      </div>
                      <div className="mp-cart-item-price">{fmtPrice(item.price)}</div>
                      <div className="mp-cart-item-qty">
                        <button className="mp-qty-btn" aria-label={`Giảm số lượng ${item.name}`} onClick={() => updateQty(item.product_id, item.qty - 1)}>−</button>
                        <span className="mp-cart-item-qty-num" aria-live="polite">{item.qty}</span>
                        <button className="mp-qty-btn" aria-label={`Tăng số lượng ${item.name}`} onClick={() => updateQty(item.product_id, item.qty + 1)}>+</button>
                      </div>
                      <div className="mp-cart-item-subtotal">{fmtPrice(item.price * item.qty)}</div>
                      <button className="mp-cart-item-remove" aria-label={`Xóa ${item.name} khỏi giỏ`} onClick={() => removeItem(item.product_id)}>✕</button>
                    </div>
                  ))}
                </div>
                <div className="mp-cart-continue">
                  <Link to="/san-pham" className="mp-btn mp-btn-ghost">← Tiếp tục mua sắm</Link>
                </div>
              </div>

              <aside className="mp-cart-summary" aria-label="Tóm tắt đơn hàng">
                <h2 className="mp-cart-summary-title">Tóm tắt đơn hàng</h2>

                {/* ── Coupon input ── */}
                <div className="mp-coupon-wrap" style={{ marginBottom: 16 }}>
                  <label htmlFor="mp-coupon-input" style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                    Mã giảm giá
                  </label>
                  {couponCode ? (
                    <div className="mp-coupon-applied" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, background: 'var(--accent-light, #fdf2f2)', border: '1px solid var(--rose-gold, #c98a8a)' }}>
                      <span style={{ fontSize: 13, color: 'var(--rose-gold, #c98a8a)', fontWeight: 700, flex: 1 }}>
                        🎫 {couponCode} — Giảm {fmtPrice(couponDiscount)}
                      </span>
                      <button
                        onClick={handleClearCoupon}
                        aria-label="Xóa mã giảm giá"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2, #888)', fontSize: 16, lineHeight: 1, padding: '0 2px' }}
                      >✕</button>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <input
                          id="mp-coupon-input"
                          ref={couponInputRef}
                          type="text"
                          value={couponInput}
                          onChange={e => setCouponInput(e.target.value.toUpperCase())}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleApplyCoupon() } }}
                          placeholder="Nhập mã giảm giá"
                          style={{ flex: 1, padding: '8px 10px', border: '1px solid var(--border, #e8e5df)', borderRadius: 8, fontSize: 13 }}
                          aria-label="Mã giảm giá"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={couponLoading}
                          style={{ padding: '8px 14px', background: 'var(--rose-gold, #c98a8a)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                        >
                          {couponLoading ? '...' : 'Áp dụng'}
                        </button>
                      </div>
                      {couponError && <p style={{ fontSize: 12, color: 'var(--danger, #e24b4a)', marginTop: 5 }} role="alert">{couponError}</p>}
                      {couponSuccess && <p style={{ fontSize: 12, color: 'var(--rose-gold, #c98a8a)', marginTop: 5 }}>{couponSuccess}</p>}
                    </>
                  )}
                </div>

                <dl className="mp-cart-totals">
                  <div className="mp-cart-total-row">
                    <dt>Tạm tính</dt>
                    <dd>{fmtPrice(subtotal)}</dd>
                  </div>
                  <div className="mp-cart-total-row">
                    <dt>Phí vận chuyển</dt>
                    <dd>{shipping === 0 ? 'Miễn phí' : fmtPrice(shipping)}</dd>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="mp-cart-total-row" style={{ color: 'var(--rose-gold, #c98a8a)' }}>
                      <dt>Giảm giá ({couponCode})</dt>
                      <dd>−{fmtPrice(couponDiscount)}</dd>
                    </div>
                  )}
                  <div className="mp-cart-total-row mp-cart-total-row--grand">
                    <dt>Tổng cộng</dt>
                    <dd>{fmtPrice(total)}</dd>
                  </div>
                </dl>
                <p className="mp-cart-ship-note" aria-live="polite" style={shipping === 0 ? { color: 'var(--accent)' } : undefined}>
                  {shipping > 0
                    ? `Mua thêm ${fmtPrice(freeShipThreshold - subtotal)} để được miễn phí vận chuyển.`
                    : '✓ Bạn được miễn phí vận chuyển!'}
                </p>
                <button className="mp-btn mp-btn-accent mp-btn-full" aria-label="Tiến hành thanh toán" onClick={() => navigate('/thanh-toan')}>
                  Thanh toán →
                </button>
                <div className="mp-cart-secure">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  Thanh toán bảo mật · Hàng chính hãng
                </div>
              </aside>
            </div>
          </div>
        )}

        {suggested.length > 0 && (
          <section className="mp-related" aria-labelledby="mpSuggestedTitle" data-reveal>
            <div className="mp-sec-header">
              <div className="mp-sec-header-left">
                <div className="mp-eyebrow">Gợi ý</div>
                <h2 id="mpSuggestedTitle" className="mp-sec-title">Bạn Có Thể Thích</h2>
              </div>
              <Link to="/san-pham" className="mp-sec-viewall">Xem thêm →</Link>
            </div>
            <div className="mp-grid" role="list">
              {suggested.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
