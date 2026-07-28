'use client'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { templates } from '@/data/templates'
import { useBankInfo } from '@/lib/hooks/useBankInfo'
import CartCheckoutClient from './CartCheckoutClient'

interface FormData {
  name: string; email: string; phone: string; note: string
}

type PurchaseType = 'template' | 'website'

interface DiscountResult {
  type: string; value: number; discountAmount: number; finalPrice: number; isFree: boolean
}

function fmtPrice(n: number) { return n.toLocaleString('vi-VN') + 'đ' }

export default function CheckoutClient({
  hasWebsite,
  templatePrice,
  websitePrice,
}: {
  hasWebsite: boolean
  templatePrice: number
  websitePrice?: number
}) {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const slug         = searchParams.get('slug') ?? ''
  const template     = templates.find(t => t.slug === slug)
  const bank          = useBankInfo()

  // Không có ?slug= → checkout từ giỏ hàng (nhiều sản phẩm) thay vì mua ngay 1 sản phẩm
  if (!slug) {
    return <CartCheckoutClient />
  }

  const [step, setStep]                 = useState(1)
  const [purchaseType, setPurchaseType] = useState<PurchaseType>('template')
  const [form, setForm]                 = useState<FormData>({ name: '', email: '', phone: '', note: '' })
  const [errors, setErrors]             = useState<Partial<FormData>>({})
  const [submitting, setSubmitting]     = useState(false)
  const [submitError, setSubmitError]   = useState('')

  // Discount state
  const [discountInput, setDiscountInput]   = useState('')
  const [appliedCode, setAppliedCode]       = useState<string | null>(null)
  const [discountInfo, setDiscountInfo]     = useState<DiscountResult | null>(null)
  const [discountError, setDiscountError]   = useState('')
  const [discountChecking, setDiscountChecking] = useState(false)

  const basePrice = purchaseType === 'website' && hasWebsite && websitePrice ? websitePrice : templatePrice
  const price = discountInfo?.finalPrice ?? basePrice
  const isFree = discountInfo?.isFree ?? false

  // Khi purchaseType thay đổi → giá thay đổi → clear discount
  useEffect(() => {
    setAppliedCode(null); setDiscountInfo(null); setDiscountInput(''); setDiscountError('')
  }, [purchaseType])

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
    if (step === 2 && !validate()) return
    setStep(s => s + 1)
  }

  async function handleSubmitOrder() {
    setSubmitting(true); setSubmitError('')
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, templateSlug: slug, purchaseType, discountCode: appliedCode }),
      })
      const data = await res.json()
      if (!res.ok) { setSubmitError(data.error || 'Lỗi đặt hàng, vui lòng thử lại'); return }
      router.push(`/checkout/pending?code=${data.code}&type=${purchaseType}&slug=${encodeURIComponent(slug)}&amount=${price}`)
    } catch { setSubmitError('Lỗi kết nối, vui lòng thử lại') }
    finally { setSubmitting(false) }
  }

  const progress = step === 1 ? 33 : step === 2 ? 66 : 100

  const STEPS = [
    { n: 1, label: 'Loại sản phẩm' },
    { n: 2, label: 'Thông tin' },
    { n: 3, label: 'Thanh toán' },
  ]

  return (
    <>
      <div className="prog-line"><div className="prog-fill" style={{ width: `${progress}%` }} /></div>
      <div className="stepper-bar">
        <div className="stepper">
          {STEPS.map((s, i) => (
            <div key={s.n} className="d-flex align-items-center" style={{ flex: i < 2 ? 1 : 0 }}>
              <div className="step-item" onClick={() => step > s.n && setStep(s.n)}>
                <div className={`step-num ${step > s.n ? 'done' : step === s.n ? 'active' : 'idle'}`}>
                  {step > s.n ? '✓' : s.n}
                </div>
                <span className={`step-label ${step > s.n ? 'done' : step === s.n ? 'active' : 'idle'}`}>{s.label}</span>
              </div>
              {i < 2 && <div className={`step-connector${step > s.n ? ' done' : ''}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="checkout-body">
        <div className="row g-4">
          <div className="col-lg-7">

            {/* ── Step 1: Loại sản phẩm ── */}
            {step === 1 && (
              <div className="panel">
                <div className="panel-head">
                  <div className="panel-title"><span className="panel-badge active">1</span>Chọn loại sản phẩm</div>
                </div>
                <div className="panel-body">
                  {!hasWebsite && (
                    <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-mid)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: 'var(--accent)' }}>
                      Template này chỉ có bản HTML/CSS. Liên hệ nếu muốn phiên bản website đầy đủ.
                    </div>
                  )}
                  <div className="d-flex flex-column gap-3">

                    {/* Option A: Template */}
                    <label style={{ cursor: 'pointer' }}>
                      <input type="radio" name="purchaseType" value="template" checked={purchaseType === 'template'}
                        onChange={() => setPurchaseType('template')} className="d-none" />
                      <div style={{
                        border: `2px solid ${purchaseType === 'template' ? 'var(--accent)' : 'var(--border)'}`,
                        borderRadius: 12, padding: '18px 20px',
                        background: purchaseType === 'template' ? 'var(--accent-light)' : 'var(--surface)',
                        transition: 'all .15s',
                      }}>
                        <div className="d-flex justify-content-between align-items-flex-start gap-3">
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                              <span style={{ fontSize: 20 }}>📦</span>
                              <span style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text)' }}>Mua file template</span>
                            </div>
                            <div style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.75 }}>
                              Nhận file ZIP chứa HTML + CSS + JS<br />
                              Mở thẳng trên trình duyệt, không cần hosting<br />
                              <span style={{ color: 'var(--accent)', fontWeight: 500 }}>⚡ Download ngay sau thanh toán</span>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{fmtPrice(templatePrice)}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>1 lần duy nhất</div>
                          </div>
                        </div>
                        <div className="d-flex gap-2 mt-3 flex-wrap">
                          {['HTML/CSS/JS', 'Bootstrap 5.3', 'Responsive', 'Chỉnh sửa tự do'].map(tag => (
                            <span key={tag} style={{ fontSize: 11, background: purchaseType === 'template' ? 'rgba(26,107,82,.12)' : 'var(--warm2)', color: purchaseType === 'template' ? 'var(--accent)' : 'var(--text-3)', padding: '2px 8px', borderRadius: 4, fontWeight: 500 }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </label>

                    {/* Option B: Website Gói B — chỉ hiện nếu template có websitePrice */}
                    {hasWebsite && websitePrice && (
                      <label style={{ cursor: 'pointer' }}>
                        <input type="radio" name="purchaseType" value="website" checked={purchaseType === 'website'}
                          onChange={() => setPurchaseType('website')} className="d-none" />
                        <div style={{
                          border: `2px solid ${purchaseType === 'website' ? 'var(--accent)' : 'var(--border)'}`,
                          borderRadius: 12, padding: '18px 20px',
                          background: purchaseType === 'website' ? 'var(--accent-light)' : 'var(--surface)',
                          transition: 'all .15s',
                          position: 'relative',
                        }}>
                          <div style={{ position: 'absolute', top: -10, right: 16, background: 'var(--accent)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 10px', borderRadius: 10, textTransform: 'uppercase', letterSpacing: '.5px' }}>
                            Phổ biến
                          </div>
                          <div className="d-flex justify-content-between align-items-flex-start gap-3">
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                <span style={{ fontSize: 20 }}>🌐</span>
                                <span style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text)' }}>Mua website đầy đủ <span style={{ fontSize: 11, background: '#eff6ff', color: '#1d4ed8', padding: '1px 6px', borderRadius: 4, marginLeft: 4, fontWeight: 500 }}>Gói B</span></span>
                              </div>
                              <div style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.75 }}>
                                Nhận <strong>web.zip</strong> (website) + <strong>admin.zip</strong> (quản trị)<br />
                                Upload lên hosting PHP là chạy ngay<br />
                                <span style={{ color: 'var(--accent)', fontWeight: 500 }}>⚡ Download ngay sau thanh toán</span>
                              </div>
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{websitePrice ? fmtPrice(websitePrice) : ''}</div>
                              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>1 lần duy nhất</div>
                            </div>
                          </div>
                          <div className="d-flex gap-2 mt-3 flex-wrap">
                            {['PHP + React', 'SQLite DB', 'Admin panel', 'Hướng dẫn cài đặt'].map(tag => (
                              <span key={tag} style={{ fontSize: 11, background: purchaseType === 'website' ? 'rgba(26,107,82,.12)' : 'var(--warm2)', color: purchaseType === 'website' ? 'var(--accent)' : 'var(--text-3)', padding: '2px 8px', borderRadius: 4, fontWeight: 500 }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </label>
                    )}

                  </div>
                  <button className="btn-primary-wd mt-4" style={{ width: '100%', padding: 13, fontSize: 14 }} onClick={handleNext}>
                    Tiếp tục → Nhập thông tin
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 2: Thông tin ── */}
            {step === 2 && (
              <div className="panel">
                <div className="panel-head">
                  <div className="panel-title"><span className="panel-badge active">2</span>Thông tin của bạn</div>
                  <span className="panel-edit" onClick={() => setStep(1)}>← Đổi loại</span>
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
                      <textarea className="form-control" rows={3} placeholder="Yêu cầu đặc biệt, màu sắc mong muốn..."
                        value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
                    </div>
                  </div>
                  <button className="btn-primary-wd mt-4" style={{ width: '100%', padding: 13, fontSize: 14 }} onClick={handleNext}>
                    Tiếp tục → Thanh toán
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 3: Thanh toán ── */}
            {step === 3 && (
              <div className="panel">
                <div className="panel-head">
                  <div className="panel-title"><span className="panel-badge active">3</span>Thanh toán</div>
                  <span className="panel-edit" onClick={() => setStep(2)}>← Sửa thông tin</span>
                </div>
                <div className="panel-body">

                  {/* ── Mã khuyến mại ── */}
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

                  {/* ── Bank info — ẩn khi miễn phí ── */}
                  {!isFree && (
                    <>
                      <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-mid)', borderRadius: 10, padding: '16px 18px', marginBottom: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--accent)', marginBottom: 8 }}>Chuyển khoản ngân hàng</div>
                        <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.8, fontWeight: 300 }}>
                          <div><strong style={{ color: 'var(--text)' }}>Ngân hàng:</strong> {bank.bankName}</div>
                          <div><strong style={{ color: 'var(--text)' }}>Số tài khoản:</strong> {bank.accountNo}</div>
                          <div><strong style={{ color: 'var(--text)' }}>Chủ tài khoản:</strong> {bank.accountName}</div>
                          <div><strong style={{ color: 'var(--text)' }}>Nội dung:</strong> <em>Hiển thị sau khi đặt hàng</em></div>
                          <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(26,107,82,.15)' }}>
                            <strong style={{ color: 'var(--text)' }}>Số tiền:</strong>{' '}
                            <strong style={{ color: 'var(--accent)', fontSize: 15 }}>{fmtPrice(price)}</strong>
                          </div>
                        </div>
                      </div>
                      <div style={{ background: 'var(--warm)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', marginBottom: 18, fontSize: 13, color: 'var(--text-2)', lineHeight: 1.75 }}>
                        <div style={{ fontWeight: 500, marginBottom: 4, color: 'var(--text)' }}>⚡ Tự động xác nhận qua Sepay</div>
                        Sau khi chuyển khoản đúng nội dung, hệ thống tự xác nhận trong <strong>vài giây</strong> và chuyển bạn đến trang tải về ngay lập tức.
                      </div>
                    </>
                  )}

                  {isFree && (
                    <div style={{ background: '#e8f4ef', border: '1px solid #2d9b73', borderRadius: 10, padding: '14px 18px', marginBottom: 18, fontSize: 13, color: '#1a6b52', lineHeight: 1.75 }}>
                      <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 14 }}>🎁 Đơn hàng miễn phí 100%</div>
                      Mã khuyến mại áp dụng thành công. Nhấn nút bên dưới để nhận sản phẩm ngay — không cần chuyển khoản.
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
              {template && <img src={template.image} alt={template.name} className="sum-thumb" />}
              <div className="sum-title">{template?.name ?? 'Template'}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 14, fontWeight: 300 }}>{template?.category ?? ''}{template ? ' · Bootstrap 5.3' : ''}</div>
              <hr style={{ borderColor: 'var(--border-light)', margin: '12px 0' }} />

              <div className="sum-row">
                <span>{purchaseType === 'template' ? 'File template ZIP' : 'Website Gói B (web + admin)'}</span>
                <span style={{ textDecoration: discountInfo ? 'line-through' : 'none', color: discountInfo ? 'var(--text-3)' : undefined }}>{fmtPrice(basePrice)}</span>
              </div>
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

              <div style={{ marginTop: 14, padding: '12px 14px', background: 'var(--warm)', borderRadius: 8, fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.7 }}>
                {purchaseType === 'template' ? (
                  <>📦 Nhận: <strong>1 file ZIP</strong> — HTML/CSS/JS<br />⚡ Download ngay sau đặt hàng</>
                ) : (
                  <>🌐 Nhận: <strong>web.zip</strong> + <strong>admin.zip</strong><br />⚡ Download ngay sau đặt hàng<br />📖 Kèm hướng dẫn cài đặt chi tiết</>
                )}
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
