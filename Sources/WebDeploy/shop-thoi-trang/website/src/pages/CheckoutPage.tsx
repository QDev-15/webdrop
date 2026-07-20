import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useCart } from '../contexts/CartContext'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface PaymentMethods {
  cod_enabled: boolean
  sepay_enabled: boolean
  sepay_bank_code: string
  sepay_account_number: string
  sepay_account_name: string
}

interface OrderResult {
  order_code: string
  total: number
  discount: number
  payment_method: string
  payment_status: string
  sepay?: { bank_code: string; account_number: string; account_name: string; amount: number; content: string }
}

export default function CheckoutPage() {
  useDocumentMeta({
    title: 'Thanh Toán — Nova Store',
    description: 'Hoàn tất đơn hàng của bạn tại Nova Store — thanh toán nhanh chóng và an toàn.',
  })
  const { items, subtotal, coupon, clear } = useCart()
  const { settings } = useSite()

  const [methods, setMethods] = useState<PaymentMethods | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'sepay'>('cod')
  const [form, setForm] = useState({ customer_name: '', phone: '', email: '', address: '', note: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<OrderResult | null>(null)
  const [paidConfirmed, setPaidConfirmed] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'
  const shippingFee = Number(settings.shipping_fee || 0)
  const freeShipThreshold = Number(settings.free_shipping_threshold || 0)
  const effectiveShipping = freeShipThreshold > 0 && subtotal >= freeShipThreshold ? 0 : shippingFee
  const discount = coupon?.discount ?? 0
  const total = Math.max(0, subtotal + effectiveShipping - discount)

  useEffect(() => {
    api.get<PaymentMethods>('/public/payment-methods')
      .then(m => {
        setMethods(m)
        if (!m.cod_enabled && m.sepay_enabled) setPaymentMethod('sepay')
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!result || result.payment_method !== 'sepay' || result.payment_status === 'paid') return
    pollRef.current = setInterval(async () => {
      try {
        const status = await api.get<{ payment_status: string }>(`/public/orders/${result.order_code}/status`)
        if (status.payment_status === 'paid') {
          setPaidConfirmed(true)
          if (pollRef.current) clearInterval(pollRef.current)
        }
      } catch { /* ignore — thử lại lượt sau */ }
    }, 4000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [result])

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.customer_name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ giao hàng')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const order = await api.post<OrderResult>('/public/orders', {
        ...form,
        payment_method: paymentMethod,
        coupon_code: coupon?.code || '',
        items: items.map(i => ({ product_id: i.product_id, qty: i.qty, color: i.color || '', size: i.size || '' })),
      })
      setResult(order)
      clear()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đặt hàng thất bại, vui lòng thử lại')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0 && !result) {
    return (
      <section className="st-sec" aria-label="Giỏ hàng trống">
        <div className="st-container-sm" style={{ textAlign: 'center', paddingTop: 80, paddingBottom: 40 }}>
          <h1 className="st-page-title" style={{ color: 'var(--text)' }}>Giỏ Hàng Đang Trống</h1>
          <p className="st-sec-sub" style={{ margin: '0 auto 32px' }}>Vui lòng chọn sản phẩm trước khi thanh toán.</p>
          <Link to="/san-pham" className="st-btn st-btn-primary st-btn-lg">Khám Phá Sản Phẩm</Link>
        </div>
      </section>
    )
  }

  if (result) {
    return (
      <section className="st-sec" aria-label="Kết quả đặt hàng">
        <div className="st-container-sm">
          <div className="st-cart-summary" style={{ maxWidth: 560, margin: '0 auto', position: 'static' }}>
            {result.payment_method === 'cod' || paidConfirmed ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <i className="bi bi-check-circle" style={{ fontSize: 48, color: 'var(--accent)' }} />
                  <h2 className="st-sum-title" style={{ border: 'none', marginTop: 12, marginBottom: 4 }}>
                    {paidConfirmed ? 'Thanh Toán Thành Công!' : 'Đặt Hàng Thành Công!'}
                  </h2>
                  <p style={{ color: 'var(--text-2)', fontSize: 14 }}>Mã đơn hàng: <strong>{result.order_code}</strong></p>
                </div>
                <p style={{ color: 'var(--text-2)', fontSize: 14, textAlign: 'center', marginBottom: 20 }}>
                  {result.payment_method === 'cod'
                    ? 'Cảm ơn bạn đã đặt hàng! Chúng tôi sẽ liên hệ xác nhận và giao hàng sớm nhất.'
                    : 'Chúng tôi đã nhận được thanh toán của bạn. Đơn hàng đang được xử lý.'}
                </p>
                <Link to="/san-pham" className="st-btn st-btn-primary w-100 justify-content-center">Tiếp Tục Mua Sắm</Link>
              </>
            ) : (
              <>
                <h2 className="st-sum-title">Quét Mã Để Thanh Toán</h2>
                <p style={{ fontSize: 14, color: 'var(--text-2)', margin: '16px 0' }}>
                  Mã đơn hàng <strong>{result.order_code}</strong> — số tiền <strong>{fmt(result.total)}</strong>
                </p>
                {result.sepay?.bank_code && result.sepay?.account_number ? (
                  <div className="st-qr-box">
                    <img
                      src={`https://img.vietqr.io/image/${result.sepay.bank_code}-${result.sepay.account_number}-compact2.png?amount=${result.sepay.amount}&addInfo=${encodeURIComponent(result.sepay.content)}&accountName=${encodeURIComponent(result.sepay.account_name)}`}
                      alt="Mã QR chuyển khoản"
                      style={{ maxWidth: 240, width: '100%' }}
                    />
                    <div style={{ marginTop: 16, fontSize: 13, color: 'var(--text-2)', textAlign: 'left' }}>
                      <div className="st-sum-row"><span>Ngân hàng</span><span>{result.sepay.bank_code}</span></div>
                      <div className="st-sum-row"><span>Số tài khoản</span><span>{result.sepay.account_number}</span></div>
                      <div className="st-sum-row"><span>Chủ tài khoản</span><span>{result.sepay.account_name}</span></div>
                      <div className="st-sum-row"><span>Nội dung CK</span><span>{result.sepay.content}</span></div>
                    </div>
                    <p style={{ fontSize: 12.5, color: 'var(--text-3)', marginTop: 16 }}>
                      <i className="bi bi-arrow-repeat" /> Đang chờ xác nhận thanh toán — trang sẽ tự cập nhật khi nhận được tiền.
                    </p>
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-2)', fontSize: 14 }}>Vui lòng liên hệ shop để được hướng dẫn chuyển khoản cho đơn hàng {result.order_code}.</p>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    )
  }

  const noMethodAvailable = methods !== null && !methods.cod_enabled && !methods.sepay_enabled

  return (
    <>
      <section className="st-page-hero" aria-label="Tiêu đề trang">
        <div className="st-container">
          <nav className="st-breadcrumb mb-3" aria-label="Điều hướng">
            <Link to="/">Trang chủ</Link>
            <span className="st-breadcrumb-sep">/</span>
            <Link to="/gio-hang">Giỏ hàng</Link>
            <span className="st-breadcrumb-sep">/</span>
            <span>Thanh toán</span>
          </nav>
          <h1 className="st-page-title">Thanh Toán</h1>
        </div>
      </section>

      <section className="st-sec" aria-label="Thanh toán">
        <div className="st-container">
          {error && (
            <div style={{ color: 'var(--sale)', background: 'var(--sale-light)', border: '1px solid var(--sale)', padding: '10px 16px', marginBottom: 24, fontSize: 14 }}>{error}</div>
          )}

          <div className="st-checkout-layout">
            <form onSubmit={handleSubmit}>
              <div className="st-checkout-section">
                <div className="st-checkout-section-title">Thông tin giao hàng</div>
                <div className="st-form-row">
                  <div className="st-form-group">
                    <label className="st-form-label" htmlFor="co-name">Họ và tên *</label>
                    <input id="co-name" type="text" className="st-form-input" value={form.customer_name} onChange={e => set('customer_name', e.target.value)} placeholder="Nguyễn Văn A" required />
                  </div>
                  <div className="st-form-group">
                    <label className="st-form-label" htmlFor="co-phone">Số điện thoại *</label>
                    <input id="co-phone" type="tel" className="st-form-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901 234 567" required />
                  </div>
                </div>
                <div className="st-form-group">
                  <label className="st-form-label" htmlFor="co-email">Email</label>
                  <input id="co-email" type="email" className="st-form-input" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
                </div>
                <div className="st-form-group">
                  <label className="st-form-label" htmlFor="co-address">Địa chỉ giao hàng *</label>
                  <textarea id="co-address" className="st-form-input" rows={2} value={form.address} onChange={e => set('address', e.target.value)} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" required />
                </div>
                <div className="st-form-group">
                  <label className="st-form-label" htmlFor="co-note">Ghi chú</label>
                  <textarea id="co-note" className="st-form-input" rows={2} value={form.note} onChange={e => set('note', e.target.value)} placeholder="Ghi chú cho đơn hàng (không bắt buộc)" />
                </div>
              </div>

              <div className="st-checkout-section">
                <div className="st-checkout-section-title">Phương thức thanh toán</div>
                {noMethodAvailable ? (
                  <p style={{ color: 'var(--sale)', fontSize: 14 }}>Cửa hàng tạm ngừng nhận đơn online — vui lòng liên hệ trực tiếp để đặt hàng.</p>
                ) : (
                  <>
                    {methods?.cod_enabled && (
                      <label className={`st-pay-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
                        <input type="radio" name="payment_method" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                        <span>
                          <span className="st-pay-option-title">Thanh toán khi nhận hàng (COD)</span>
                          <span className="st-pay-option-desc" style={{ display: 'block' }}>Trả tiền mặt cho shipper khi nhận hàng</span>
                        </span>
                      </label>
                    )}
                    {methods?.sepay_enabled && (
                      <label className={`st-pay-option ${paymentMethod === 'sepay' ? 'active' : ''}`}>
                        <input type="radio" name="payment_method" checked={paymentMethod === 'sepay'} onChange={() => setPaymentMethod('sepay')} />
                        <span>
                          <span className="st-pay-option-title">Chuyển khoản trước qua SePay</span>
                          <span className="st-pay-option-desc" style={{ display: 'block' }}>Quét mã QR, xác nhận tự động</span>
                        </span>
                      </label>
                    )}
                  </>
                )}
              </div>

              <button type="submit" className="st-btn st-btn-primary st-btn-lg w-100 justify-content-center" disabled={submitting || noMethodAvailable}>
                {submitting ? 'Đang xử lý...' : `Đặt Hàng · ${fmt(total)}`}
              </button>
            </form>

            <aside>
              <div className="st-cart-summary" style={{ position: 'static' }}>
                <div className="st-sum-title">Đơn Hàng Của Bạn</div>
                {items.map(item => (
                  <div className="st-sum-row" key={`${item.product_id}-${item.color ?? ''}-${item.size ?? ''}`}>
                    <span>{item.name}{[item.color, item.size].filter(Boolean).length ? ` (${[item.color, item.size].filter(Boolean).join(', ')})` : ''} × {item.qty}</span>
                    <span>{fmt(item.price * item.qty)}</span>
                  </div>
                ))}
                <div className="st-divider" />
                <div className="st-sum-row"><span>Tạm tính</span><span>{fmt(subtotal)}</span></div>
                {discount > 0 && (
                  <div className="st-sum-row"><span>Giảm giá ({coupon?.code})</span><span style={{ color: 'var(--sale)' }}>-{fmt(discount)}</span></div>
                )}
                <div className="st-sum-row">
                  <span>Phí vận chuyển</span>
                  <span style={{ color: effectiveShipping === 0 ? 'var(--accent)' : undefined }}>{effectiveShipping === 0 ? 'Miễn phí' : fmt(effectiveShipping)}</span>
                </div>
                <div className="st-sum-total">
                  <span className="st-sum-total-label">Tổng cộng</span>
                  <span className="st-sum-total-val">{fmt(total)}</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
