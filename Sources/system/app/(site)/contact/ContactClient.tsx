'use client'
import { useState, FormEvent, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

const faqs = [
  { q: 'Thời gian hoàn thành bao lâu?', a: 'Landing page 1 trang: 2–3 ngày. Website nhiều trang: 5–7 ngày. Gói Theo Yêu cầu: thỏa thuận theo scope.' },
  { q: 'Tôi có thể tự chỉnh nội dung không?', a: 'Có. Mọi template đều đi kèm hướng dẫn chỉnh nội dung cơ bản. Bạn chỉ cần sửa text và thay ảnh trong file HTML.' },
  { q: 'Có hỗ trợ sau bàn giao không?', a: 'Hỗ trợ miễn phí 30 ngày đầu. Sau đó có thể đăng ký gói bảo trì tháng từ 500.000đ.' },
  { q: 'Giá bao gồm những gì?', a: 'Bao gồm file source, hướng dẫn chỉnh sửa, và hỗ trợ cài đặt (với Gói Web cơ bản). Hosting và domain tính riêng.' },
]

interface ContactInfo {
  address:      string
  phone:        string
  email:        string
  zalo:         string
  workingHours: string
}

export default function ContactClient({ info }: { info: ContactInfo }) {
  const searchParams = useSearchParams()
  const [form, setForm]           = useState({ name: '', phone: '', email: '', service: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [openFaq, setOpenFaq]     = useState<number | null>(null)

  useEffect(() => {
    const subject = searchParams.get('subject')
    if (subject !== 'Goi-C') return
    const tname = searchParams.get('tname') || searchParams.get('template') || ''
    const price  = searchParams.get('price')
    const priceStr = price ? Number(price).toLocaleString('vi-VN') + 'đ' : ''
    const preMessage = [
      `Tôi muốn tư vấn về dịch vụ Website theo yêu cầu (Gói C).`,
      tname  ? `Template tham khảo: ${tname}` : '',
      priceStr ? `Ngân sách tham khảo: từ ${priceStr}` : '',
      `\nYêu cầu cụ thể: `,
    ].filter(Boolean).join('\n')
    setForm(f => ({ ...f, service: 'Gói Theo Yêu cầu', message: preMessage }))
  }, [searchParams])

  const zaloPhone = info.zalo || info.phone
  const zaloUrl   = `https://zalo.me/${zaloPhone.replace(/\s/g, '')}`

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true); setSubmitError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) { setSubmitError('Gửi thất bại, vui lòng thử lại sau'); return }
      setSubmitted(true)
    } catch { setSubmitError('Lỗi kết nối, vui lòng thử lại') }
    finally { setSubmitting(false) }
  }

  const contactItems = [
    { icon: '📍', label: 'Địa chỉ',           val: info.address || 'Việt Nam' },
    { icon: '📞', label: 'Zalo / Điện thoại', val: info.phone   || '—' },
    { icon: '✉️', label: 'Email',              val: info.email   || '—' },
    { icon: '🕐', label: 'Giờ hỗ trợ',        val: info.workingHours },
  ]

  return (
    <>
      {/* Contact grid */}
      <section className="sec-pad">
        <div className="wd-container">
          <div className="row g-5">
            {/* Info */}
            <div className="col-lg-4 reveal">
              <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Thông tin liên hệ</h2>
              <p style={{ fontSize: 14, fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.75, marginBottom: 28 }}>
                Chúng tôi sẵn sàng lắng nghe và tư vấn giải pháp phù hợp nhất cho bạn.
              </p>
              {contactItems.map(i => (
                <div key={i.label} style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--accent-light)', border: '1px solid rgba(26,107,82,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>{i.icon}</div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 2 }}>{i.label}</div>
                    <div style={{ fontSize: 14, color: 'var(--text)' }}>{i.val}</div>
                  </div>
                </div>
              ))}
              <a href={zaloUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 20px', background: '#0068FF', color: '#fff', borderRadius: 9, fontSize: 14, fontWeight: 500, textDecoration: 'none', marginTop: 8 }}>
                💬 Chat Zalo ngay
              </a>
            </div>

            {/* Form */}
            <div className="col-lg-8 reveal reveal-d1">
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 'clamp(20px,4vw,36px)' }}>
                {submitted ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{ fontSize: 40, marginBottom: 14 }}>✅</div>
                    <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Đã gửi thành công!</div>
                    <p style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 300 }}>Chúng tôi sẽ liên hệ lại trong 2 giờ làm việc.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Gửi yêu cầu tư vấn</div>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 5 }}>Họ và tên <span style={{ color: 'var(--danger)' }}>*</span></label>
                        <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nguyễn Văn A"
                          style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 13, fontFamily: 'var(--sans)', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div className="col-md-6">
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 5 }}>Số điện thoại <span style={{ color: 'var(--danger)' }}>*</span></label>
                        <input required type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="0901 234 567"
                          style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 13, fontFamily: 'var(--sans)', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div className="col-md-6">
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 5 }}>Email</label>
                        <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com"
                          style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 13, fontFamily: 'var(--sans)', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div className="col-md-6">
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 5 }}>Dịch vụ quan tâm</label>
                        <select value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 13, fontFamily: 'var(--sans)', outline: 'none' }}>
                          <option value="">— Chọn dịch vụ —</option>
                          <option>Gói Template</option>
                          <option>Gói Web cơ bản</option>
                          <option>Gói Theo Yêu cầu</option>
                          <option>Khác</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 5 }}>Nội dung</label>
                        <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={4} placeholder="Mô tả yêu cầu, ngành nghề, ngân sách..."
                          style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 13, fontFamily: 'var(--sans)', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                      </div>
                      <div className="col-12">
                        {submitError && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 13px', marginBottom: 12, fontSize: 13, color: '#dc2626' }}>{submitError}</div>}
                        <button type="submit" disabled={submitting}
                          style={{ width: '100%', padding: 13, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 500, fontFamily: 'var(--sans)', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? .7 : 1 }}>
                          {submitting ? 'Đang gửi...' : 'Gửi yêu cầu →'}
                        </button>
                        <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', marginTop: 10 }}>
                          Phản hồi trong <strong>2 giờ làm việc</strong>. Thông tin của bạn được bảo mật.
                        </p>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '0 0 clamp(64px,10vw,100px)', background: 'var(--warm)' }}>
        <div className="wd-container" style={{ maxWidth: 720 }}>
          <div className="text-center reveal" style={{ paddingTop: 'clamp(48px,7vw,80px)', marginBottom: 40 }}>
            <div className="eyebrow">FAQ</div>
            <h2 className="sec-title">Câu hỏi <em>thường gặp</em></h2>
          </div>
          <div className="reveal">
            {faqs.map((f, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <div onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ padding: '16px 0', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', gap: 12, color: openFaq === i ? 'var(--accent)' : 'var(--text)' }}>
                  {f.q}
                  <span style={{ fontSize: 12, color: 'var(--text-3)', transition: 'transform .25s', transform: openFaq === i ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>▾</span>
                </div>
                {openFaq === i && <p style={{ fontSize: 14, fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.75, paddingBottom: 16 }}>{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
