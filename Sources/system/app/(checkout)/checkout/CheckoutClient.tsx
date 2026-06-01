'use client'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { templates } from '@/data/templates'

interface FormData {
  name: string; email: string; phone: string; note: string
  plan: string
}

interface Plan { id: string; label: string; price: number; desc: string; hot?: boolean }

function fmtPrice(n: number) { return n.toLocaleString('vi-VN') + 'đ' }

const DEFAULT_PLANS: Plan[] = [
  { id: 'starter', label: 'Gói A', price: 1200000, desc: 'Source code + tài liệu hướng dẫn' },
  { id: 'standard', label: 'Gói B', price: 2500000, desc: 'Cài đặt trọn gói · Hosting · Domain', hot: true },
  { id: 'premium', label: 'Gói C', price: 12000000, desc: 'Thiết kế riêng theo yêu cầu' },
]

export default function CheckoutClient({ plans = DEFAULT_PLANS }: { plans?: Plan[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const slug = searchParams.get('slug') ?? ''
  const template = templates.find(t => t.slug === slug) ?? templates[0]

  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>({ name: '', email: '', phone: '', note: '', plan: plans[1]?.id ?? plans[0]?.id ?? '' })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const selectedPlan = plans.find(p => p.id === form.plan) ?? plans[1]

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
    if (step === 2) { setStep(3); return }
    setStep(s => s + 1)
  }

  async function handleSubmitOrder() {
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, templateSlug: slug, plan: form.plan }),
      })
      const data = await res.json()
      if (!res.ok) { setSubmitError(data.error || 'Lỗi đặt hàng, vui lòng thử lại'); return }
      router.push(`/checkout/success?code=${data.code}`)
    } catch { setSubmitError('Lỗi kết nối, vui lòng thử lại') }
    finally { setSubmitting(false) }
  }

  const progress = step === 1 ? 33 : step === 2 ? 66 : 100

  return (
    <>
      <div className="prog-line"><div className="prog-fill" style={{ width: `${progress}%` }} /></div>
      <div className="stepper-bar">
        <div className="stepper">
          {[{n:1,label:'Thông tin'},{n:2,label:'Gói dịch vụ'},{n:3,label:'Thanh toán'}].map((s, i) => (
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

            {/* Step 1: Thông tin */}
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
                      <textarea className="form-control" rows={3} placeholder="Yêu cầu đặc biệt, ngành nghề, màu sắc mong muốn..."
                        value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
                    </div>
                  </div>
                  <button className="btn-primary-wd mt-4" style={{ width: '100%', padding: 13, fontSize: 14 }} onClick={handleNext}>
                    Tiếp tục → Chọn gói dịch vụ
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Gói dịch vụ */}
            {step === 2 && (
              <div className="panel">
                <div className="panel-head">
                  <div className="panel-title"><span className="panel-badge active">2</span>Chọn gói dịch vụ</div>
                  <span className="panel-edit" onClick={() => setStep(1)}>← Sửa thông tin</span>
                </div>
                <div className="panel-body">
                  <div className="d-flex flex-column gap-2">
                    {plans.map(p => (
                      <label key={p.id} style={{ cursor: 'pointer' }}>
                        <input type="radio" name="plan" value={p.id} checked={form.plan === p.id}
                          onChange={() => setForm(f => ({ ...f, plan: p.id }))} className="d-none" />
                        <div style={{
                          border: `2px solid ${form.plan === p.id ? 'var(--accent)' : 'var(--border)'}`,
                          borderRadius: 10, padding: '14px 16px', background: form.plan === p.id ? 'var(--accent-light)' : 'var(--surface)',
                          transition: 'all .15s',
                        }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>
                                {p.label} {p.hot && <span style={{ fontSize: 10, background: 'var(--accent)', color: '#fff', padding: '2px 8px', borderRadius: 10, marginLeft: 6 }}>Phổ biến</span>}
                              </div>
                              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2, fontWeight: 300 }}>{p.desc}</div>
                            </div>
                            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', flexShrink: 0 }}>{fmtPrice(p.price)}</div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <button className="btn-primary-wd mt-4" style={{ width: '100%', padding: 13, fontSize: 14 }} onClick={handleNext}>
                    Tiếp tục → Thanh toán
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Thanh toán */}
            {step === 3 && (
              <div className="panel">
                <div className="panel-head">
                  <div className="panel-title"><span className="panel-badge active">3</span>Thông tin thanh toán</div>
                  <span className="panel-edit" onClick={() => setStep(2)}>← Sửa gói</span>
                </div>
                <div className="panel-body">
                  <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-mid)', borderRadius: 10, padding: '16px 18px', marginBottom: 20 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--accent)', marginBottom: 8 }}>Chuyển khoản ngân hàng</div>
                    <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.8, fontWeight: 300 }}>
                      <div><strong style={{ color: 'var(--text)' }}>Ngân hàng:</strong> Vietcombank</div>
                      <div><strong style={{ color: 'var(--text)' }}>Số tài khoản:</strong> 1234 5678 9012</div>
                      <div><strong style={{ color: 'var(--text)' }}>Chủ tài khoản:</strong> NGUYEN HUU QUYNH</div>
                      <div><strong style={{ color: 'var(--text)' }}>Nội dung:</strong> WEBDROP {form.phone}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.7, marginBottom: 20 }}>
                    Sau khi chuyển khoản, chúng tôi sẽ xác nhận và liên hệ qua Zalo <strong>{form.phone}</strong> trong vòng 2 giờ làm việc (8:00–18:00, T2–T7).
                  </p>
                  {submitError && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 13px', marginBottom: 12, fontSize: 13, color: '#dc2626' }}>{submitError}</div>}
                  <button className="btn-primary-wd" style={{ width: '100%', padding: 13, fontSize: 14, opacity: submitting ? .7 : 1 }}
                    onClick={handleSubmitOrder} disabled={submitting}>
                    {submitting ? 'Đang gửi...' : '✓ Xác nhận đặt hàng'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="col-lg-5">
            <div className="checkout-summary">
              <img src={template.image} alt={template.name} className="sum-thumb" />
              <div className="sum-title">{template.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 14, fontWeight: 300 }}>{template.category} · Bootstrap 5.3</div>
              <hr style={{ borderColor: 'var(--border-light)', margin: '12px 0' }} />
              <div className="sum-row"><span>Gói {selectedPlan.label}</span><span>{fmtPrice(selectedPlan.price)}</span></div>
              <div className="sum-row total"><span>Tổng cộng</span><span>{fmtPrice(selectedPlan.price)}</span></div>
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
