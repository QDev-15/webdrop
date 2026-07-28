'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'

interface FormData {
  name: string; email: string; phone: string; note: string
}

interface DiscountResult {
  type: string; value: number; discountAmount: number; finalPrice: number; isFree: boolean
}

function fmtPrice(n: number) { return n.toLocaleString('vi-VN') + 'đ' }

export default function CartCheckoutClient() {
  const router = useRouter()
  const cart    = useCart()

  const [step, setStep]             = useState(1)
  const [form, setForm]             = useState<FormData>({ name: '', email: '', phone: '', note: '' })
  const [errors, setErrors]         = useState<Partial<FormData>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const [discountInput, setDiscountInput]     = useState('')
  const [appliedCode, setAppliedCode]         = useState<string | null>(null)
  const [discountInfo, setDiscountInfo]       = useState<DiscountResult | null>(null)
  const [discountError, setDiscountError]     = useState('')
  const [discountChecking, setDiscountChecking] = useState(false)

  const basePrice = cart.subtotal
  const price   = discountInfo?.finalPrice ?? basePrice
  const isFree  = discountInfo?.isFree ?? false

  async function applyDiscount() {
    if (!discountInput.trim()) return
    setDiscountChecking(true); setDiscountError('')
    try {
      const res = await fetch('/api/discounts/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: discountInput.trim().toUpperCase(), price: basePrice }),
      })
      const data = await res.json()
      if (!res.ok) { setDiscountError(data.error || 'Mã không hợp lệ'); return }
      setAppliedCode(discountInput.trim().toUpperCase())
      setDiscountInfo(data)
    } catch { setDiscountError('Lỗi kết nối, vui lòng thử lại') }
    finally { setDiscountChecking(false) }
  }

  function clearDiscount() {
    setDiscountInput(''); setAppliedCode(null); setDiscountInfo(null); setDiscountError('')
  }

  const validate = () => {
    const e: Partial<FormData> = {}
    if (!form.name.trim()) e.name = 'Vui lòng nhập họ tên'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email không hợp lệ'
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 9) e.phone = 'Số điện thoại không hợp lệ'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (step === 1 && !validate()) return
    setStep(s => s + 1)
  }

  async function handleSubmitOrder() {
    setSubmitting(true); setSubmitError('')
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: cart.items.map(i => ({ slug: i.slug, purchaseType: i.purchaseType })),
          discountCode: appliedCode,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setSubmitError(data.error || 'Lỗi đặt hàng, vui lòng thử lại'); return }
      cart.clearCart()
      router.push(`/checkout/pending?code=${data.code}&amount=${price}`)
    } catch { setSubmitError('Lỗi kết nối, vui lòng thử lại') }
    finally { setSubmitting(false) }
  }

  if (cart.hydrated && cart.items.length === 0) {
    return (
      <div className="checkout-body">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🛒</div>
          <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 20 }}>Giỏ hàng của bạn đang trống.</p>
          <Link href="/templates" className="btn-primary-wd" style={{ display: 'inline-block', padding: '12px 28px', textDecoration: 'none' }}>
            Khám phá thư viện mẫu →
          </Link>
        </div>
      </div>
    )
  }

  const progress = step === 1 ? 50 : 100
  const STEPS = [
    { n: 1, label: 'Thông tin' },
    { n: 2, label: 'Thanh toán' },
  ]

  return (
    <>
      <div className="prog-line"><div className="prog-fill" style={{ width: `${progress}%` }} /></div>
      <div className="stepper-bar">
        <div className="stepper">
          {STEPS.map((s, i) => (
            <div key={s.n} className="d-flex align-items-center" style={{ flex: i < 1 ? 1 : 0 }}>
              <div className="step-item" onClick={() => step > s.n && setStep(s.n)}>
                <div className={`step-num ${step > s.n ? 'done' : step === s.n ? 'active' : 'idle'}`}>
                  {step > s.n ? '✓' : s.n}
                </div>
                <span className={`step-label ${step > s.n ? 'done' : step === s.n ? 'active' : 'idle'}`}>{s.label}</span>
              </div>
              {i < 1 && <div className={`step-connector${step > s.n ? ' done' : ''}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="checkout-body">
        <div className="row g-4">
          <div className="col-lg-7">

            {/* ── Step 1: Thông tin ── */}
            {step === 1 && (
              <div className="panel">
                <div className="panel-head">
                  <div className="panel-title"><span className="panel-badge active">1</span>Thông tin của bạn</div>
                </div>
                <div className="panel-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Họ và tên <span className="req">*</span></label>
                      <input className={`form-control${errors.name ? ' is-invalid' : ''}`} placeholder="Nguyễn Văn An"
                        value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                      {errors.name && <div className="err-msg">{errors.name}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email <span className="req">*</span></label>
                      <input type="email" className={`form-control${errors.email ? ' is-invalid' : ''}`} placeholder="email@example.com"
                        value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                      {errors.email && <div className="err-msg">{errors.email}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Số điện thoại / Zalo <span className="req">*</span></label>
                      <input type="tel" className={`form-control${errors.phone ? ' is-invalid' : ''}`} placeholder="0901 234 567"
                        value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                      {errors.phone && <div className="err-msg">{errors.phone}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label">Ghi chú (tùy chọn)</label>
                      <textarea className="form-control" rows={3} placeholder="Yêu cầu đặc biệt..."
                        value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
                    </div>
                  </div>
                  <button className="btn-primary-wd mt-4" style={{ width: '100%', padding: 13, fontSize: 14 }} onClick={handleNext}>
                    Tiếp tục → Thanh toán
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 2: Thanh toán ── */}
            {step === 2 && (
              <div className="panel">
                <div className="panel-head">
                  <div className="panel-title"><span className="panel-badge active">2</span>Thanh toán</div>
                  <span className="panel-edit" onClick={() => setStep(1)}>← Sửa thông tin</span>
                </div>
                <div className="panel-body">

                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 8 }}>🏷️ Mã khuyến mại (nếu có)</div>
                    {!appliedCode ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          value={discountInput}
                          onChange={e => setDiscountInput(e.target.value.toUpperCase())}
                          onKeyDown={e => e.key === 'Enter' && applyDiscount()}
                          placeholder="Nhập mã giảm giá"
                          style={{ flex: 1, padding: '10px 13px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', letterSpacing: 1 }}
                        />
                        <button
                          onClick={applyDiscount}
                          disabled={discountChecking || !discountInput.trim()}
                          style={{ padding: '10px 16px', background: 'var(--text)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: discountChecking ? .6 : 1, whiteSpace: 'nowrap' }}
                        >
                          {discountChecking ? '...' : 'Áp dụng'}
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--accent-light)', border: '1px solid var(--accent-mid)', borderRadius: 8, padding: '10px 14px' }}>
                        <div>
                          <span style={{ fontWeight: 700, color: 'var(--accent)', letterSpacing: 1 }}>{appliedCode}</span>
                          <span style={{ fontSize: 12, color: 'var(--accent)', marginLeft: 10 }}>
                            −{fmtPrice(discountInfo!.discountAmount)}
                            {discountInfo!.isFree && <strong style={{ marginLeft: 6 }}>🎁 MIỄN PHÍ</strong>}
                          </span>
                        </div>
                        <button onClick={clearDiscount} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>✕ Xóa</button>
                      </div>
                    )}
                    {discountError && <div style={{ fontSize: 12, color: 'var(--danger)', marginTop: 6 }}>{discountError}</div>}
                  </div>

                  {!isFree && (
                    <div style={{ background: 'var(--warm)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', marginBottom: 18, fontSize: 13, color: 'var(--text-2)', lineHeight: 1.75 }}>
                      <div style={{ fontWeight: 500, marginBottom: 4, color: 'var(--text)' }}>⚡ Tự động xác nhận qua Sepay</div>
                      Thông tin chuyển khoản sẽ hiển thị ở bước tiếp theo. Sau khi chuyển đúng nội dung, hệ thống tự xác nhận trong <strong>vài giây</strong>.
                    </div>
                  )}

                  {isFree && (
                    <div style={{ background: '#e8f4ef', border: '1px solid #2d9b73', borderRadius: 10, padding: '14px 18px', marginBottom: 18, fontSize: 13, color: '#1a6b52', lineHeight: 1.75 }}>
                      <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 14 }}>🎁 Đơn hàng miễn phí 100%</div>
                      Mã khuyến mại áp dụng thành công. Nhấn nút bên dưới để nhận sản phẩm ngay.
                    </div>
                  )}

                  {submitError && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 13px', marginBottom: 12, fontSize: 13, color: '#dc2626' }}>
                      {submitError}
                    </div>
                  )}
                  <button className="btn-primary-wd" style={{ width: '100%', padding: 13, fontSize: 14, opacity: submitting ? .7 : 1 }}
                    onClick={handleSubmitOrder} disabled={submitting}>
                    {submitting ? 'Đang xử lý...' : isFree ? '🎁 Nhận miễn phí →' : '✓ Xác nhận đặt hàng'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Summary sidebar ── */}
          <div className="col-lg-5">
            <div className="checkout-summary">
              <div className="sum-title">Giỏ hàng ({cart.items.length} sản phẩm)</div>
              <hr style={{ borderColor: 'var(--border-light)', margin: '12px 0' }} />

              {cart.items.map(item => (
                <div key={item.slug} className="sum-row" style={{ alignItems: 'flex-start' }}>
                  <span style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>{item.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
                      {item.purchaseType === 'website' ? '🌐 Website + Admin' : '📦 File template'}
                    </span>
                  </span>
                  <span>{fmtPrice(item.purchaseType === 'website' && item.websitePrice ? item.websitePrice : item.price)}</span>
                </div>
              ))}

              <hr style={{ borderColor: 'var(--border-light)', margin: '12px 0' }} />
              {discountInfo && (
                <div className="sum-row" style={{ color: 'var(--accent)' }}>
                  <span>🏷️ Giảm giá ({appliedCode})</span>
                  <span>−{fmtPrice(discountInfo.discountAmount)}</span>
                </div>
              )}
              <div className="sum-row total">
                <span>Tổng cộng</span>
                <span style={{ color: isFree ? 'var(--accent)' : undefined }}>{isFree ? 'Miễn phí 🎁' : fmtPrice(price)}</span>
              </div>

              <div style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 300, marginTop: 12, lineHeight: 1.6 }}>
                🛡️ Hoàn tiền 100% trong 7 ngày nếu không hài lòng
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
