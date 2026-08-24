import { useState } from 'react'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { api } from '../api/client'

function renderEm(text: string) {
  const parts = (text || '').split(/(\*[^*]+\*)/g)
  return parts.map((part, i) => (part.startsWith('*') && part.endsWith('*')) ? <em key={i}>{part.slice(1, -1)}</em> : <span key={i}>{part}</span>)
}

interface FormState {
  fname: string
  fphone: string
  femail: string
  fdate: string
  fpackage: string
  flocation: string
  fmessage: string
}

const emptyForm: FormState = { fname: '', fphone: '', femail: '', fdate: '', fpackage: '', flocation: '', fmessage: '' }

export default function ContactPage() {
  const { settings } = useSite()
  const [form, setForm] = useState<FormState>(emptyForm)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useDocumentMeta({
    title: `Liên hệ — ${settings.site_name || 'Đăng Photography'}`,
    description: settings.contact_hero_sub,
  })

  function set<K extends keyof FormState>(k: K, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setSent(false)
    if (!form.fname.trim() || !form.fphone.trim()) { setError('Họ tên và số điện thoại không được để trống.'); return }
    setSending(true)
    try {
      await api.post('/public/contact', {
        name: form.fname, phone: form.fphone, email: form.femail,
        event_date: form.fdate, package: form.fpackage, location: form.flocation, message: form.fmessage,
      })
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
      <section className="pna-page-hero">
        <div className="wd-container">
          <div className="pna-ph-tag" data-reveal>Liên hệ</div>
          <h1 className="pna-ph-title" data-reveal>{renderEm(settings.contact_hero_title || 'Kể tôi nghe về ngày cưới của bạn')}</h1>
          <p className="pna-ph-sub" data-reveal>{settings.contact_hero_sub}</p>
        </div>
      </section>

      <section className="sec-pad" style={{ background: 'var(--surface)' }}>
        <div className="wd-container">
          <div className="pna-contact-grid">

            <form onSubmit={handleSubmit} data-reveal>
              {sent && <div className="alert alert-success" style={{ marginBottom: 16 }}>Cảm ơn bạn đã gửi thông tin! Đăng sẽ liên hệ lại trong vòng 24 giờ.</div>}
              {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}
              <div className="row">
                <div className="col-md-6">
                  <div className="pna-form-group">
                    <label htmlFor="fname">Họ tên cô dâu/chú rể *</label>
                    <input type="text" id="fname" value={form.fname} onChange={e => set('fname', e.target.value)} placeholder="VD: Nguyễn Thị Thảo" required />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="pna-form-group">
                    <label htmlFor="fphone">Số điện thoại *</label>
                    <input type="tel" id="fphone" value={form.fphone} onChange={e => set('fphone', e.target.value)} placeholder="09xxxxxxxx" required />
                  </div>
                </div>
              </div>
              <div className="pna-form-group">
                <label htmlFor="femail">Email</label>
                <input type="email" id="femail" value={form.femail} onChange={e => set('femail', e.target.value)} placeholder="ban@email.com" />
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="pna-form-group">
                    <label htmlFor="fdate">Ngày dự kiến tổ chức</label>
                    <input type="date" id="fdate" value={form.fdate} onChange={e => set('fdate', e.target.value)} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="pna-form-group">
                    <label htmlFor="fpackage">Gói dịch vụ quan tâm</label>
                    <select id="fpackage" value={form.fpackage} onChange={e => set('fpackage', e.target.value)}>
                      <option value="">— Chọn gói —</option>
                      <option value="co-ban">Gói Cơ Bản</option>
                      <option value="nang-cao">Gói Nâng Cao</option>
                      <option value="tron-goi">Gói Trọn Gói</option>
                      <option value="chua-ro">Chưa rõ, cần tư vấn</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="pna-form-group">
                <label htmlFor="flocation">Địa điểm tổ chức dự kiến</label>
                <input type="text" id="flocation" value={form.flocation} onChange={e => set('flocation', e.target.value)} placeholder="VD: Đà Lạt, Phú Quốc, Hội An..." />
              </div>
              <div className="pna-form-group">
                <label htmlFor="fmessage">Lời nhắn</label>
                <textarea id="fmessage" value={form.fmessage} onChange={e => set('fmessage', e.target.value)} placeholder="Kể tôi nghe thêm về lễ cưới của bạn — phong cách bạn thích, số lượng khách mời dự kiến..." />
              </div>
              <button type="submit" className="pna-btn pna-btn-accent" style={{ width: '100%', justifyContent: 'center' }} disabled={sending}>
                {sending ? 'Đang gửi...' : 'Gửi thông tin tư vấn'}
              </button>
            </form>

            <div data-reveal data-reveal-d1>
              <div className="pna-info-item">
                <div className="pna-info-icon">&#9742;</div>
                <div>
                  <div className="pna-info-label">Điện thoại / Zalo</div>
                  <div className="pna-info-value">{settings.site_phone}</div>
                </div>
              </div>
              <div className="pna-info-item">
                <div className="pna-info-icon">&#9993;</div>
                <div>
                  <div className="pna-info-label">Email</div>
                  <div className="pna-info-value">{settings.site_email}</div>
                </div>
              </div>
              <div className="pna-info-item">
                <div className="pna-info-icon">&#128205;</div>
                <div>
                  <div className="pna-info-label">Studio</div>
                  <div className="pna-info-value">{settings.site_address}</div>
                </div>
              </div>
              <div className="pna-info-item">
                <div className="pna-info-icon">&#128337;</div>
                <div>
                  <div className="pna-info-label">Giờ làm việc</div>
                  <div className="pna-info-value">{settings.working_hours}</div>
                </div>
              </div>
              <div className="pna-info-item" style={{ borderBottom: 'none' }}>
                <div className="pna-info-icon">&#128247;</div>
                <div>
                  <div className="pna-info-label">Khu vực phục vụ</div>
                  <div className="pna-info-value">{settings.service_area}</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {settings.map_embed && (
        <section className="sec-pad" style={{ background: 'var(--bg)', paddingTop: 0 }}>
          <div className="wd-container" data-reveal>
            <div style={{ width: '100%', height: 360, borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,.1)' }}>
              <iframe src={settings.map_embed} style={{ width: '100%', height: '100%', border: 0 }} loading="lazy" title="Bản đồ studio" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
