import { useEffect, useRef, useState } from 'react'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'

interface ContactForm {
  name: string
  phone: string
  message: string
}

export default function Contact() {
  const { settings } = useSite()
  const s = settings
  const [form, setForm] = useState<ContactForm>({ name: '', phone: '', message: '' })
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => {
      const els = ref.current?.querySelectorAll<HTMLElement>('[data-reveal]:not(.visible)')
      if (!els?.length) return
      const ro = new IntersectionObserver(entries =>
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      , { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(t)
  }, [])

  function set(key: keyof ContactForm, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) {
      setError('Vui lòng điền họ tên và nội dung.')
      return
    }
    setSending(true); setError(''); setSuccess('')
    try {
      const res = await api.post<{ ok: boolean; message: string }>('/public/contact', form)
      setSuccess(res.message || 'Tin nhắn của bạn đã được gửi. Chúng tôi sẽ phản hồi sớm nhất!')
      setForm({ name: '', phone: '', message: '' })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra. Vui lòng thử lại.')
    } finally { setSending(false) }
  }

  const phone = s.site_phone || '0901 234 567'
  const address = s.site_address || '123 Đường BBQ, Phường 5, Quận 3, TP.HCM'
  const email = s.site_email || 'info@bbqluahong.vn'

  return (
    <div ref={ref}>
      <div className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Liên hệ</div>
          <h1 className="ph-title">Tìm Đến <em>Chúng Tôi</em></h1>
          <p className="ph-sub">Địa chỉ, số điện thoại và bản đồ đường đến — chúng tôi luôn sẵn sàng đón tiếp bạn.</p>
        </div>
      </div>

      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="row g-5">
            <div className="col-lg-5">
              <div data-reveal style={{ marginBottom: 16 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Thông tin liên hệ</h2>
                <p style={{ fontSize: 14, color: 'var(--text-2)' }}>Liên hệ trực tiếp hoặc nhắn tin Zalo — chúng tôi phản hồi trong vài phút.</p>
              </div>

              <div className="booking-card" data-reveal>
                <div className="contact-item">
                  <div className="ci-icon">📍</div>
                  <div>
                    <div className="ci-label">Địa chỉ</div>
                    <div className="ci-value">{address}</div>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="ci-icon">📱</div>
                  <div>
                    <div className="ci-label">Điện thoại đặt bàn</div>
                    <div className="ci-value"><a href={`tel:${phone.replace(/\s/g,'')}`} style={{ color: 'var(--text)' }}>{phone}</a></div>
                    <div className="ci-sub">Gọi từ 17:00 – 23:00 hàng ngày</div>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="ci-icon">💬</div>
                  <div>
                    <div className="ci-label">Zalo</div>
                    <div className="ci-value">{phone}</div>
                    <div className="ci-sub">Nhắn Zalo — phản hồi nhanh nhất</div>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="ci-icon">✉️</div>
                  <div>
                    <div className="ci-label">Email</div>
                    <div className="ci-value"><a href={`mailto:${email}`} style={{ color: 'var(--text)' }}>{email}</a></div>
                    <div className="ci-sub">Phản hồi trong 24 giờ làm việc</div>
                  </div>
                </div>
              </div>

              <div className="booking-card mt-4" data-reveal>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>🕐 Giờ mở cửa</div>
                <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}><span>Thứ 2 – Thứ 6</span><span style={{ fontWeight: 600, color: 'var(--text)' }}>17:00 – 23:00</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}><span>Thứ 7</span><span style={{ fontWeight: 600, color: 'var(--text)' }}>11:00 – 23:00</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}><span>Chủ nhật</span><span style={{ fontWeight: 600, color: 'var(--text)' }}>11:00 – 22:00</span></div>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              {s.map_embed ? (
                <div data-reveal style={{ marginBottom: 16, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)' }} dangerouslySetInnerHTML={{ __html: s.map_embed }} />
              ) : (
                <div data-reveal style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--warm2)', height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  <div style={{ fontSize: 40 }}>📍</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Bản đồ Google Maps</div>
                  <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{address}</div>
                </div>
              )}

              <div className="booking-card" data-reveal>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Gửi tin nhắn cho chúng tôi</h3>
                <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 20 }}>Hỏi về thực đơn, đặt tiệc lớn, hoặc bất kỳ thắc mắc nào.</p>

                {success && <div className="form-success">{success}</div>}
                {error && <div className="form-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Họ và tên *</label>
                      <input type="text" className="form-control" placeholder="Nguyễn Văn A" value={form.name} onChange={e => set('name', e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Số điện thoại</label>
                      <input type="tel" className="form-control" placeholder="0901 234 567" value={form.phone} onChange={e => set('phone', e.target.value)} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nội dung *</label>
                    <textarea className="form-control" rows={4} placeholder="Tôi muốn hỏi về..." value={form.message} onChange={e => set('message', e.target.value)} required />
                  </div>
                  <button type="submit" className="btn-accent" style={{ width: '100%', textAlign: 'center', padding: 13, fontSize: 15 }} disabled={sending}>
                    {sending ? 'Đang gửi...' : 'Gửi tin nhắn →'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
