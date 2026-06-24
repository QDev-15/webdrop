import { useState } from 'react'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

interface ContactForm {
  name: string
  phone: string
  email: string
  subject: string
  message: string
}

export default function Contact() {
  const { settings } = useSite()
  const phone = settings.site_phone || '028 3812 7500'
  const address = settings.site_address || '45 Nguyen Dinh Chieu, Quan 3, TP.HCM'
  const email = settings.site_email || 'info@tamthumassage.vn'
  const hours = settings.working_hours || 'T2-T6: 9:00-21:00 | T7-CN: 8:00-22:00'
  const mapEmbed = settings.map_embed || ''

  const [form, setForm] = useState<ContactForm>({ name: '', phone: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  const set = (k: keyof ContactForm, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone) {
      setMsg('Vui lòng điền họ tên và số điện thoại.'); setStatus('error'); return
    }
    setStatus('loading'); setMsg('')
    try {
      await api.post('/public/contact', form)
      setStatus('success')
      setMsg('Cảm ơn bạn! Chúng tôi sẽ liên hệ trong vòng 24 giờ.')
      setForm({ name: '', phone: '', email: '', subject: '', message: '' })
    } catch (e) {
      setStatus('error')
      setMsg(e instanceof Error ? e.message : 'Có lỗi xảy ra, vui lòng thử lại.')
    }
  }

  return (
    <section className="sec-pad" style={{ background: 'var(--bg)' }}>
      <div className="wd-container">
        <div className="row g-5">
          <div className="col-lg-5" data-reveal>
            <div className="mrt-label">
              <span className="mrt-label-line" />
              Liên hệ
            </div>
            <h2 className="mrt-heading">Chúng tôi luôn <em>sẵn sàng</em> phục vụ bạn</h2>
            <p className="mrt-subtext" style={{ marginBottom: 28 }}>
              Hãy liên hệ với chúng tôi để được tư vấn và đặt lịch ngay hôm nay.
            </p>

            <div className="mrt-contact-box">
              <div className="mrt-contact-icon">📍</div>
              <div>
                <div className="mrt-contact-label">Địa chỉ</div>
                <div className="mrt-contact-val">{address}</div>
              </div>
            </div>
            <div className="mrt-contact-box">
              <div className="mrt-contact-icon">📞</div>
              <div>
                <div className="mrt-contact-label">Điện thoại</div>
                <div className="mrt-contact-val"><a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a></div>
              </div>
            </div>
            <div className="mrt-contact-box">
              <div className="mrt-contact-icon">✉️</div>
              <div>
                <div className="mrt-contact-label">Email</div>
                <div className="mrt-contact-val"><a href={`mailto:${email}`}>{email}</a></div>
              </div>
            </div>
            <div className="mrt-contact-box">
              <div className="mrt-contact-icon">🕐</div>
              <div>
                <div className="mrt-contact-label">Giờ làm việc</div>
                <div className="mrt-contact-val">{hours}</div>
              </div>
            </div>

            {mapEmbed && (
              <div className="mrt-map-wrap" style={{ marginTop: 20 }}>
                <iframe
                  src={mapEmbed}
                  title="Bản đồ"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>

          <div className="col-lg-7" data-reveal>
            <div className="mrt-form-card">
              <div className="mrt-form-title">Gửi tin nhắn cho chúng tôi</div>
              <div className="mrt-form-sub">Điền thông tin bên dưới — chúng tôi sẽ trả lời sớm nhất có thể.</div>

              {status === 'success' && (
                <div style={{ padding: '14px 18px', background: '#f0faf5', border: '1px solid #b6dfc9', borderRadius: 8, marginBottom: 20, fontSize: 14, color: 'var(--accent)' }}>
                  {msg}
                </div>
              )}
              {status === 'error' && (
                <div style={{ padding: '14px 18px', background: '#fff0f0', border: '1px solid #fdd', borderRadius: 8, marginBottom: 20, fontSize: 14, color: 'var(--danger)' }}>
                  {msg}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <div className="mrt-form-group">
                      <label className="mrt-form-label">Họ và tên <span>*</span></label>
                      <input type="text" className="mrt-form-control" placeholder="Nguyễn Văn A" value={form.name} onChange={e => set('name', e.target.value)} />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mrt-form-group">
                      <label className="mrt-form-label">Số điện thoại <span>*</span></label>
                      <input type="tel" className="mrt-form-control" placeholder="0901 234 567" value={form.phone} onChange={e => set('phone', e.target.value)} />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="mrt-form-group">
                      <label className="mrt-form-label">Email</label>
                      <input type="email" className="mrt-form-control" placeholder="email@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="mrt-form-group">
                      <label className="mrt-form-label">Tiêu đề</label>
                      <input type="text" className="mrt-form-control" placeholder="Chủ đề bạn muốn liên hệ" value={form.subject} onChange={e => set('subject', e.target.value)} />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="mrt-form-group">
                      <label className="mrt-form-label">Nội dung</label>
                      <textarea className="mrt-form-control" rows={5} placeholder="Nội dung tin nhắn..." value={form.message} onChange={e => set('message', e.target.value)} />
                    </div>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="mrt-form-submit" disabled={status === 'loading'}>
                      {status === 'loading' ? 'Đang gửi...' : 'Gửi tin nhắn →'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
