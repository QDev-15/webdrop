import { useState } from 'react'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { api } from '../api/client'
import { renderTitle } from '../utils/text'

interface FormState {
  name: string
  phone: string
  email: string
  need_type: string
  message: string
}

const emptyForm: FormState = { name: '', phone: '', email: '', need_type: '', message: '' }

export default function ContactPage() {
  const { settings } = useSite()
  const [form, setForm] = useState<FormState>(emptyForm)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useDocumentMeta({
    title: `Liên hệ — ${settings.site_name || 'Tuấn Đặng Studio'}`,
    description: settings.contact_hero_sub,
  })

  function set<K extends keyof FormState>(k: K, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setSent(false)
    if (!form.name.trim() || !form.phone.trim()) { setError('Họ tên và số điện thoại không được để trống.'); return }
    setSending(true)
    try {
      await api.post('/public/contact', form)
      setSent(true)
      setForm(emptyForm)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gửi thất bại, vui lòng thử lại.')
    } finally {
      setSending(false)
    }
  }

  return (
    <main>
      <section className="pkt-page-hero sec-light">
        <div className="pkt-container">
          <div className="pkt-eyebrow" data-reveal>Liên hệ</div>
          <h1 data-reveal>{renderTitle(settings.contact_hero_title || 'Kể cho chúng tôi nghe *về dự án của bạn*')}</h1>
          <p data-reveal data-reveal-d1>{settings.contact_hero_sub}</p>
        </div>
      </section>

      <section className="sec-pad sec-light" style={{ paddingTop: 0 }}>
        <div className="pkt-container">
          <div className="row g-5">
            <div className="col-lg-5" data-reveal>
              <div className="pkt-eyebrow">Thông tin liên hệ</div>
              <h2 className="pkt-sec-title" style={{ fontSize: 'clamp(24px,3vw,32px)' }}>Studio <em>{(settings.site_name || 'Tuấn Đặng Studio').replace(/\s*Studio$/i, '')}</em></h2>
              <ul className="pkt-info-list mt-4">
                <li>
                  <div className="pkt-info-label">Điện thoại</div>
                  <div className="pkt-info-value">{settings.site_phone}</div>
                </li>
                <li>
                  <div className="pkt-info-label">Email</div>
                  <div className="pkt-info-value">{settings.site_email}</div>
                </li>
                <li>
                  <div className="pkt-info-label">Địa chỉ studio</div>
                  <div className="pkt-info-value">{settings.site_address}</div>
                </li>
                <li>
                  <div className="pkt-info-label">Giờ làm việc</div>
                  <div className="pkt-info-value">{settings.working_hours}</div>
                </li>
              </ul>
            </div>
            <div className="col-lg-7" data-reveal data-reveal-d1>
              {sent && <div className="alert alert-success" style={{ marginBottom: 16 }}>Cảm ơn bạn đã gửi thông tin! Chúng tôi sẽ phản hồi trong vòng 24 giờ.</div>}
              {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-md-6 pkt-form-group">
                    <label className="pkt-form-label" htmlFor="cf-name">Họ và tên</label>
                    <input id="cf-name" type="text" className="pkt-form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Văn A" required />
                  </div>
                  <div className="col-md-6 pkt-form-group">
                    <label className="pkt-form-label" htmlFor="cf-phone">Số điện thoại</label>
                    <input id="cf-phone" type="tel" className="pkt-form-control" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="09xx xxx xxx" required />
                  </div>
                  <div className="col-md-6 pkt-form-group">
                    <label className="pkt-form-label" htmlFor="cf-email">Email</label>
                    <input id="cf-email" type="email" className="pkt-form-control" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
                  </div>
                  <div className="col-md-6 pkt-form-group">
                    <label className="pkt-form-label" htmlFor="cf-need-type">Loại nhu cầu</label>
                    <select id="cf-need-type" className="pkt-form-control" value={form.need_type} onChange={e => set('need_type', e.target.value)}>
                      <option value="">-- Chọn --</option>
                      <option>Thiết kế nhà mới</option>
                      <option>Cải tạo công trình cũ</option>
                      <option>Thiết kế nội thất</option>
                      <option>Khác</option>
                    </select>
                  </div>
                  <div className="col-12 pkt-form-group">
                    <label className="pkt-form-label" htmlFor="cf-message">Mô tả dự án</label>
                    <textarea id="cf-message" className="pkt-form-control" value={form.message} onChange={e => set('message', e.target.value)} placeholder="Diện tích đất, khu vực, ngân sách dự kiến, thời gian mong muốn khởi công..." />
                  </div>
                </div>
                <button type="submit" className="pkt-btn pkt-btn-accent mt-2" disabled={sending}>
                  {sending ? 'Đang gửi...' : 'Gửi yêu cầu tư vấn'}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {settings.map_embed && (
        <section className="sec-pad-sm sec-surface">
          <div className="pkt-container" data-reveal>
            <div style={{ height: 420, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
              <iframe src={settings.map_embed} loading="lazy" title="Bản đồ studio" style={{ width: '100%', height: '100%', border: 0 }} referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
