import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { api } from '../api/client'
import { renderTitle } from '../utils/text'

interface FormState {
  name: string
  phone: string
  email: string
  service: string
  message: string
}

const emptyForm: FormState = { name: '', phone: '', email: '', service: 'Brand Identity Design', message: '' }

export default function ContactPage() {
  const { settings } = useSite()
  const [form, setForm] = useState<FormState>(emptyForm)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useDocumentMeta({
    title: `Liên hệ — KHOA Design Studio`,
    description: settings.contact_hero_sub,
  })

  function set<K extends keyof FormState>(k: K, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setSent(false)
    if (!form.name.trim()) { setError('Họ tên không được để trống.'); return }
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
      <section className="ptk-page-hero">
        <div className="ptk-container">
          <div className="ptk-crumb"><Link to="/">Trang chủ</Link> / Liên hệ</div>
          <h1 className="ptk-page-title">{renderTitle(settings.contact_hero_title)}</h1>
          <p className="ptk-page-sub">{settings.contact_hero_sub}</p>
        </div>
      </section>

      <section className="ptk-sec">
        <div className="ptk-container">
          <div className="ptk-2col">
            <div data-reveal>
              <div className="ptk-eyebrow">{settings.contact_form_eyebrow}</div>
              <h2 className="ptk-title" style={{ marginBottom: 28 }}>{renderTitle(settings.contact_form_title)}</h2>

              {sent && <div className="alert alert-success" style={{ marginBottom: 16 }}>✓ Đã gửi — cảm ơn bạn! Mình sẽ phản hồi trong 24 giờ.</div>}
              {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

              <form className="ptk-form" onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="ptkName">Họ tên</label>
                    <input id="ptkName" type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Văn A" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="ptkPhone">Số điện thoại</label>
                    <input id="ptkPhone" type="tel" className="form-control" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="09xx xxx xxx" required />
                  </div>
                  <div className="col-12">
                    <label className="form-label" htmlFor="ptkEmail">Email</label>
                    <input id="ptkEmail" type="email" className="form-control" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" required />
                  </div>
                  <div className="col-12">
                    <label className="form-label" htmlFor="ptkService">Bạn cần dịch vụ gì?</label>
                    <select id="ptkService" className="form-select" value={form.service} onChange={e => set('service', e.target.value)}>
                      <option>Brand Identity Design</option>
                      <option>Packaging Design</option>
                      <option>Print &amp; Editorial Design</option>
                      <option>Brand Refresh / Tư vấn</option>
                      <option>Khác</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label" htmlFor="ptkMessage">Mô tả dự án</label>
                    <textarea id="ptkMessage" className="form-control" rows={5} value={form.message} onChange={e => set('message', e.target.value)} placeholder="Mô tả ngắn về thương hiệu, ngân sách dự kiến và thời gian mong muốn hoàn thành..." />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="ptk-btn ptk-btn-solid" style={{ width: '100%', justifyContent: 'center' }} disabled={sending}>
                      {sending ? 'Đang gửi...' : 'Gửi yêu cầu'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div data-reveal>
              <div className="ptk-eyebrow">{settings.contact_info_eyebrow}</div>
              <h2 className="ptk-title" style={{ marginBottom: 28 }}>{renderTitle(settings.contact_info_title)}</h2>
              <ul className="ptk-contact-info">
                {settings.site_email && (
                  <li>
                    <span className="ci-label">Email</span>
                    <span className="ci-val"><a href={`mailto:${settings.site_email}`}>{settings.site_email}</a></span>
                  </li>
                )}
                {settings.site_phone && (
                  <li>
                    <span className="ci-label">Điện thoại</span>
                    <span className="ci-val"><a href={`tel:${settings.site_phone}`}>{settings.site_phone}</a></span>
                  </li>
                )}
                {settings.zalo_phone && (
                  <li>
                    <span className="ci-label">Zalo</span>
                    <span className="ci-val"><a href={`https://zalo.me/${settings.zalo_phone}`} target="_blank" rel="noopener noreferrer">zalo.me/{settings.zalo_phone}</a></span>
                  </li>
                )}
                {settings.site_address && (
                  <li>
                    <span className="ci-label">Địa chỉ</span>
                    <span className="ci-val">{settings.site_address}</span>
                  </li>
                )}
                {settings.working_hours && (
                  <li>
                    <span className="ci-label">Giờ làm việc</span>
                    <span className="ci-val">{settings.working_hours}</span>
                  </li>
                )}
              </ul>
              {settings.map_embed && (
                <div className="ptk-footer-maps" style={{ marginTop: 32, filter: 'none', boxShadow: 'none', border: '1px solid var(--border)' }}>
                  <iframe src={settings.map_embed} loading="lazy" title="Vị trí studio KHOA Design tại TP.HCM" referrerPolicy="no-referrer-when-downgrade" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
