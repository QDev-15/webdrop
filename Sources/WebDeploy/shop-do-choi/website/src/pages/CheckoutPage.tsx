import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useCart } from '../contexts/CartContext'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

// Trang thanh toán TĨNH — template gốc KHÔNG có trang này (nút "Thanh toán ngay" chỉ là href="#"),
// nên tự thiết kế nhất quán bằng CSS riêng (shop-checkout.css) — không phụ thuộc prefix của site.
// Đường dẫn khuyến nghị: /thanh-toan (giữ nguyên các route khác của site tự quyết định).

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
  payment_method: string
  payment_status: string
  sepay?: { bank_code: string; account_number: string; account_name: string; amount: number; content: string }
}

export default function CheckoutPage() {
  useDocumentMeta({ title: 'Thanh toán — KidZone Shop Đồ Chơi' })

  const { items, subtotal, couponInfo, clear } = useCart()
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
  const shippingFee       = Number(settings['shipping_fee'] || 0)
  const freeShipThreshold = Number(settings['free_shipping_threshold'] || 0)
  const effectiveShipping = freeShipThreshold > 0 && subtotal >= freeShipThreshold ? 0 : shippingFee
  const discount          = couponInfo?.discount ?? 0
  const total             = subtotal + effectiveShipping - discount

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
        coupon_code: couponInfo?.code ?? '',
        items: items.map(i => ({ product_id: i.product_id, qty: i.qty })),
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
      <div className="shop-checkout-wrap">
        <div className="shop-checkout-container" style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🛒</div>
          <h1 className="shop-checkout-title">Giỏ hàng đang trống</h1>
          <p className="shop-checkout-muted" style={{ marginBottom: 32 }}>Vui lòng chọn sản phẩm trước khi thanh toán.</p>
          <Link to="/" className="shop-checkout-btn shop-checkout-btn-primary">Tiếp tục mua sắm</Link>
        </div>
      </div>
    )
  }

  if (result) {
    return (
      <div className="shop-checkout-wrap">
        <div className="shop-checkout-container">
          <div className="shop-checkout-summary" style={{ maxWidth: 560, margin: '0 auto' }}>
            {result.payment_method === 'cod' || paidConfirmed ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                  <h2 className="shop-checkout-summary-title" style={{ border: 'none', marginBottom: 4 }}>
                    {paidConfirmed ? 'Thanh toán thành công!' : 'Đặt hàng thành công!'}
                  </h2>
                  <p className="shop-checkout-muted" style={{ fontSize: 14 }}>Mã đơn hàng: <strong>{result.order_code}</strong></p>
                </div>
                <p className="shop-checkout-muted" style={{ fontSize: 14, textAlign: 'center', marginBottom: 20 }}>
                  {result.payment_method === 'cod'
                    ? 'Cảm ơn bạn đã đặt hàng! Chúng tôi sẽ liên hệ xác nhận và giao hàng sớm nhất.'
                    : 'Chúng tôi đã nhận được thanh toán của bạn. Đơn hàng đang được xử lý.'}
                </p>
                <Link to="/" className="shop-checkout-btn shop-checkout-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Tiếp tục mua sắm</Link>
              </>
            ) : (
              <>
                <h2 className="shop-checkout-summary-title">Quét mã để thanh toán</h2>
                <p style={{ fontSize: 14, marginBottom: 16 }} className="shop-checkout-muted">
                  Mã đơn hàng <strong>{result.order_code}</strong> — số tiền <strong>{fmt(result.total)}</strong>
                </p>
                {result.sepay?.bank_code && result.sepay?.account_number ? (
                  <div style={{ textAlign: 'center' }}>
                    <img
                      src={`https://img.vietqr.io/image/${result.sepay.bank_code}-${result.sepay.account_number}-compact2.png?amount=${result.sepay.amount}&addInfo=${encodeURIComponent(result.sepay.content)}&accountName=${encodeURIComponent(result.sepay.account_name)}`}
                      alt="Mã QR chuyển khoản"
                      style={{ maxWidth: 280, width: '100%', borderRadius: 12, border: '1px solid var(--border, #e5e5e5)', margin: '0 auto' }}
                    />
                    <div style={{ marginTop: 16, fontSize: 14, textAlign: 'left' }} className="shop-checkout-muted">
                      <div className="shop-checkout-summary-row"><span>Ngân hàng</span><span>{result.sepay.bank_code}</span></div>
                      <div className="shop-checkout-summary-row"><span>Số tài khoản</span><span>{result.sepay.account_number}</span></div>
                      <div className="shop-checkout-summary-row"><span>Chủ tài khoản</span><span>{result.sepay.account_name}</span></div>
                      <div className="shop-checkout-summary-row"><span>Nội dung chuyển khoản</span><span>{result.sepay.content}</span></div>
                    </div>
                    <p style={{ fontSize: 13, marginTop: 16 }} className="shop-checkout-muted">
                      Đang chờ xác nhận thanh toán — trang sẽ tự cập nhật khi nhận được tiền.
                    </p>
                  </div>
                ) : (
                  <p className="shop-checkout-muted" style={{ fontSize: 14 }}>
                    Vui lòng liên hệ shop để được hướng dẫn chuyển khoản cho đơn hàng {result.order_code}.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  const noMethodAvailable = methods !== null && !methods.cod_enabled && !methods.sepay_enabled

  return (
    <div className="shop-checkout-wrap">
      <div className="shop-checkout-container">
        <h1 className="shop-checkout-title">Thanh toán</h1>

        <div className="shop-checkout-layout">
          <div>
            {error && <div className="shop-checkout-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="shop-checkout-row">
                <div className="shop-checkout-field">
                  <label htmlFor="co-name">Họ tên *</label>
                  <input id="co-name" type="text" value={form.customer_name} onChange={e => set('customer_name', e.target.value)} placeholder="Nguyễn Văn A" required />
                </div>
                <div className="shop-checkout-field">
                  <label htmlFor="co-phone">Số điện thoại *</label>
                  <input id="co-phone" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901 234 567" required />
                </div>
              </div>
              <div className="shop-checkout-field">
                <label htmlFor="co-email">Email</label>
                <input id="co-email" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
              </div>
              <div className="shop-checkout-field">
                <label htmlFor="co-address">Địa chỉ giao hàng *</label>
                <textarea id="co-address" rows={2} value={form.address} onChange={e => set('address', e.target.value)} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" required />
              </div>
              <div className="shop-checkout-field">
                <label htmlFor="co-note">Ghi chú</label>
                <textarea id="co-note" rows={2} value={form.note} onChange={e => set('note', e.target.value)} placeholder="Ghi chú cho đơn hàng (không bắt buộc)" />
              </div>

              <div className="shop-checkout-field">
                <label>Phương thức thanh toán *</label>
                {noMethodAvailable ? (
                  <p className="shop-checkout-error" style={{ marginTop: 8 }}>Cửa hàng tạm ngừng nhận đơn online — vui lòng liên hệ trực tiếp để đặt hàng.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {methods?.cod_enabled && (
                      <label className="shop-checkout-payment-opt">
                        <input type="radio" name="payment_method" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                        <span><strong>Thanh toán khi nhận hàng (COD)</strong> — trả tiền mặt cho shipper</span>
                      </label>
                    )}
                    {methods?.sepay_enabled && (
                      <label className="shop-checkout-payment-opt">
                        <input type="radio" name="payment_method" checked={paymentMethod === 'sepay'} onChange={() => setPaymentMethod('sepay')} />
                        <span><strong>Chuyển khoản trước qua SePay</strong> — quét mã QR, xác nhận tự động</span>
                      </label>
                    )}
                  </div>
                )}
              </div>

              <button type="submit" className="shop-checkout-submit-btn" disabled={submitting || noMethodAvailable}>
                {submitting ? 'Đang xử lý...' : `Đặt hàng · ${fmt(total)}`}
              </button>
            </form>
          </div>

          <aside>
            <div className="shop-checkout-summary">
              <h2 className="shop-checkout-summary-title">Đơn hàng của bạn</h2>
              {items.map(item => (
                <div className="shop-checkout-summary-row" key={`${item.product_id}-${item.color ?? ''}-${item.size ?? ''}`}>
                  <span>{item.name}{item.color ? ` (${item.color}${item.size ? `, ${item.size}` : ''})` : ''} × {item.qty}</span>
                  <span>{fmt(item.price * item.qty)}</span>
                </div>
              ))}
              <div className="shop-checkout-summary-row" style={{ borderTop: '1px solid var(--border, #e5e5e5)', paddingTop: 14, marginTop: 4 }}>
                <span>Tạm tính</span><span>{fmt(subtotal)}</span>
              </div>
              <div className="shop-checkout-summary-row">
                <span>Phí vận chuyển</span>
                <span style={{ color: effectiveShipping === 0 ? 'var(--accent, #16a34a)' : undefined }}>{effectiveShipping === 0 ? 'Miễn phí' : fmt(effectiveShipping)}</span>
              </div>
              {couponInfo && discount > 0 && (
                <div className="shop-checkout-summary-row" style={{ color: 'var(--accent, #16a34a)' }}>
                  <span>Giảm giá ({couponInfo.code})</span>
                  <span>−{fmt(discount)}</span>
                </div>
              )}
              <div className="shop-checkout-summary-row shop-checkout-summary-total">
                <span>Tổng cộng</span><span>{fmt(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
