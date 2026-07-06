'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBankInfo } from '@/lib/hooks/useBankInfo'

const BASE_PRICE = 59000
function fmtPrice(n: number) { return n.toLocaleString('vi-VN') + 'đ' }

interface Form { name: string; email: string; phone: string }
interface DiscountResult { type: string; value: number; discountAmount: number; finalPrice: number; isFree: boolean }

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 13px', border: '1px solid var(--border)', borderRadius: 8,
  fontSize: 14, fontFamily: 'var(--sans)', outline: 'none', boxSizing: 'border-box',
  color: 'var(--text)', background: 'var(--surface)',
}

const FEATURES = [
  '10 mẫu CV: Classic, Minimal, Creative, Dark, Executive...',
  'Điền thông tin một lần — đổi mẫu bất cứ lúc nào',
  'Link CV riêng để gửi cho nhà tuyển dụng',
  'Cập nhật nội dung không giới hạn',
  'Export PDF & DOCX khi cần',
]

export default function CvCheckoutClient() {
  const router = useRouter()
  const bank = useBankInfo()
  const [form, setForm] = useState<Form>({ name: '', email: '', phone: '' })
  const [errors, setErrors] = useState<Partial<Form>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Discount state
  const [discountInput, setDiscountInput]       = useState('')
  const [appliedCode, setAppliedCode]           = useState<string | null>(null)
  const [discountInfo, setDiscountInfo]         = useState<DiscountResult | null>(null)
  const [discountError, setDiscountError]       = useState('')
  const [discountChecking, setDiscountChecking] = useState(false)

  const finalPrice = discountInfo?.finalPrice ?? BASE_PRICE
  const isFree     = discountInfo?.isFree ?? false

  async function applyDiscount() {
    if (!discountInput.trim()) return
    setDiscountChecking(true); setDiscountError('')
    try {
      const res = await fetch('/api/discounts/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: discountInput.trim().toUpperCase(), price: BASE_PRICE }),
      })
      const data = await res.json()
      if (!res.ok) { setDiscountError(data.error || 'Mã không hợp lệ'); return }
      setAppliedCode(discountInput.trim().toUpperCase()); setDiscountInfo(data)
    } catch { setDiscountError('Lỗi kết nối, vui lòng thử lại') }
    finally { setDiscountChecking(false) }
  }

  function clearDiscount() {
    setDiscountInput(''); setAppliedCode(null); setDiscountInfo(null); setDiscountError('')
  }

  function validate() {
    const e: Partial<Form> = {}
    if (!form.name.trim()) e.name = 'Vui lòng nhập họ tên'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email không hợp lệ (dùng để đăng nhập CV Manager)'
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 9) e.phone = 'Số điện thoại không hợp lệ'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true); setSubmitError('')
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, purchaseType: 'cv', discountCode: appliedCode }),
      })
      const data = await res.json()
      if (!res.ok) { setSubmitError(data.error || 'Lỗi đặt hàng, vui lòng thử lại'); return }
      router.push(`/checkout/pending?code=${data.code}&type=cv&amount=${finalPrice}`)
    } catch {
      setSubmitError('Lỗi kết nối, vui lòng thử lại')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="checkout-body">
      <div className="row g-4">
        {/* Left — form */}
        <div className="col-lg-7">
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">
                <span className="panel-badge active">1</span>
                Thông tin đăng ký
              </div>
            </div>
            <div className="panel-body">
              <p style={{ fontSize: 13.5, color: 'var(--text-2)', marginBottom: 20, lineHeight: 1.65 }}>
                Email của bạn sẽ là tài khoản đăng nhập CV Manager. Sau khi thanh toán, mật khẩu tạm được gửi về email này.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Họ và tên <span className="req">*</span></label>
                    <input
                      style={{ ...inputStyle, borderColor: errors.name ? 'var(--danger)' : undefined }}
                      placeholder="Nguyễn Văn An"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    />
                    {errors.name && <div className="err-msg">{errors.name}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email <span className="req">*</span></label>
                    <input
                      type="email"
                      style={{ ...inputStyle, borderColor: errors.email ? 'var(--danger)' : undefined }}
                      placeholder="email@example.com"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    />
                    {errors.email && <div className="err-msg">{errors.email}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Số điện thoại / Zalo <span className="req">*</span></label>
                    <input
                      type="tel"
                      style={{ ...inputStyle, borderColor: errors.phone ? 'var(--danger)' : undefined }}
                      placeholder="0901 234 567"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    />
                    {errors.phone && <div className="err-msg">{errors.phone}</div>}
                  </div>
                </div>

                {/* Mã khuyến mại */}
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 8 }}>🏷️ Mã khuyến mại (nếu có)</div>
                  {!appliedCode ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        value={discountInput}
                        onChange={e => setDiscountInput(e.target.value.toUpperCase())}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyDiscount())}
                        placeholder="Nhập mã giảm giá"
                        style={{ ...inputStyle, letterSpacing: 1 }}
                      />
                      <button
                        type="button"
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
                          {isFree && <strong style={{ marginLeft: 6 }}>🎁 MIỄN PHÍ</strong>}
                        </span>
                      </div>
                      <button type="button" onClick={clearDiscount} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>✕ Xóa</button>
                    </div>
                  )}
                  {discountError && <div style={{ fontSize: 12, color: 'var(--danger)', marginTop: 6 }}>{discountError}</div>}
                </div>

                {/* Bank info — ẩn khi miễn phí */}
                {!isFree && (
                  <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-mid)', borderRadius: 10, padding: '14px 18px', margin: '16px 0 4px' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 8 }}>Phương thức thanh toán</div>
                    <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.8 }}>
                      <div><strong style={{ color: 'var(--text)' }}>Ngân hàng:</strong> {bank.bankName}</div>
                      <div><strong style={{ color: 'var(--text)' }}>Số TK:</strong> {bank.accountNo} — {bank.accountName}</div>
                      <div><strong style={{ color: 'var(--text)' }}>Số tiền:</strong> <strong style={{ color: 'var(--accent)', fontSize: 15 }}>{fmtPrice(finalPrice)}</strong></div>
                      <div><strong style={{ color: 'var(--text)' }}>Nội dung:</strong> <em>Mã đơn hàng (hiển thị sau khi đặt)</em></div>
                    </div>
                  </div>
                )}

                {isFree && (
                  <div style={{ background: '#e8f4ef', border: '1px solid #2d9b73', borderRadius: 10, padding: '14px 18px', margin: '16px 0 4px', fontSize: 13, color: '#1a6b52', lineHeight: 1.75 }}>
                    <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 14 }}>🎁 Đơn hàng miễn phí 100%</div>
                    Mã khuyến mại áp dụng thành công. Nhấn nút bên dưới để nhận tài khoản ngay — không cần chuyển khoản.
                  </div>
                )}

                {submitError && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 13px', marginTop: 12, fontSize: 13, color: '#dc2626' }}>
                    {submitError}
                  </div>
                )}
                <button
                  type="submit"
                  className="btn-primary-wd"
                  style={{ width: '100%', padding: 13, fontSize: 14, marginTop: 16, opacity: submitting ? .7 : 1 }}
                  disabled={submitting}
                >
                  {submitting ? 'Đang xử lý...' : isFree ? '🎁 Nhận miễn phí →' : 'Đặt hàng & Xem hướng dẫn thanh toán →'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right — summary */}
        <div className="col-lg-5">
          <div className="checkout-summary">
            <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📄</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>CV Builder — Trọn gói</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Tất cả 5 mẫu thiết kế</div>
            </div>
            <hr style={{ borderColor: 'var(--border-light)', margin: '4px 0 16px' }} />

            <div style={{ marginBottom: 16 }}>
              {FEATURES.map(f => (
                <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                  <span style={{ color: 'var(--accent)', fontSize: 13, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>{f}</span>
                </div>
              ))}
            </div>

            <hr style={{ borderColor: 'var(--border-light)', margin: '12px 0' }} />
            <div className="sum-row">
              <span>CV Builder trọn gói</span>
              <span style={{ textDecoration: discountInfo ? 'line-through' : 'none', color: discountInfo ? 'var(--text-3)' : undefined }}>{fmtPrice(BASE_PRICE)}</span>
            </div>
            {discountInfo && (
              <div className="sum-row" style={{ color: 'var(--accent)' }}>
                <span>🏷️ Giảm giá ({appliedCode})</span>
                <span>−{fmtPrice(discountInfo.discountAmount)}</span>
              </div>
            )}
            <div className="sum-row total">
              <span>Tổng cộng</span>
              <span style={{ color: isFree ? 'var(--accent)' : undefined }}>{isFree ? 'Miễn phí 🎁' : fmtPrice(finalPrice)}</span>
            </div>

            <div style={{ marginTop: 14, padding: '12px 14px', background: 'var(--accent-light)', borderRadius: 8, fontSize: 12.5, color: 'var(--accent)', lineHeight: 1.7, border: '1px solid var(--accent-mid)' }}>
              ⚡ Tự động xác nhận qua Sepay — nhận email đăng nhập trong vài giây sau khi chuyển khoản
            </div>

            <div style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 300, marginTop: 12, lineHeight: 1.6 }}>
              🛡️ Hoàn tiền 100% trong 7 ngày nếu không hài lòng
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
