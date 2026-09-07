import { useState } from 'react'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface FormState {
  name: string
  phone: string
  email: string
  reason: string
  date: string
  people: string
  message: string
}

const REASONS = ['Đặt chỗ nhóm / phòng họp', 'Đặt tiệc công ty', 'Giao cà phê văn phòng', 'Mua hạt cà phê mang về', 'Hợp tác / khác']
const PEOPLE_OPTIONS = ['1 – 2 người', '3 – 6 người (phòng họp nhỏ)', '7 – 15 người', 'Trên 15 người (đặt tiệc)']

const emptyForm: FormState = { name: '', phone: '', email: '', reason: REASONS[0], date: '', people: PEOPLE_OPTIONS[0], message: '' }

export default function Contact() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Liên hệ — ${settings.site_name || 'MONO Coffee'}`,
    description: `Liên hệ ${settings.site_name || 'MONO Coffee'} để đặt chỗ nhóm, đặt tiệc công ty, giao cà phê văn phòng hoặc mua hạt cà phê rang mới mang về.`,
  })

  const [form, setForm] = useState<FormState>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) {
      setResult({ ok: false, message: 'Vui lòng nhập họ tên và số điện thoại.' })
      return
    }
    setSubmitting(true); setResult(null)
    try {
      const res = await api.post<{ ok: boolean; message: string }>('/public/contact', form)
      setResult({ ok: true, message: res.message })
      setForm(emptyForm)
    } catch (err) {
      setResult({ ok: false, message: err instanceof Error ? err.message : 'Gửi yêu cầu thất bại. Vui lòng thử lại.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="chd-quick-bar" style={{ marginTop: 72 }}>
        <div className="chd-container">
          <div className="chd-quick-item"><i>📱</i> Hotline: <strong>{settings.site_phone}</strong></div>
          <div className="chd-quick-item"><i>🕐</i> Mở cửa: <strong>{settings.working_hours}</strong></div>
          <div className="chd-quick-item"><i>📍</i> <strong>{settings.site_address}</strong></div>
        </div>
      </div>

      <section className="chd-sec">
        <div className="chd-container">
          <div className="chd-contact-grid">

            <div className="chd-contact-info" data-reveal>
              <h1>{settings.contact_intro_title || `Liên hệ với ${settings.site_name || 'MONO Coffee'}`}</h1>
              <p>{settings.contact_intro_text}</p>

              <div className="chd-contact-details">
                <div className="chd-contact-detail">
                  <div className="chd-contact-icon">📍</div>
                  <div className="chd-contact-detail-text"><strong>Địa chỉ</strong><p>{settings.site_address}</p></div>
                </div>
                <div className="chd-contact-detail">
                  <div className="chd-contact-icon">📱</div>
                  <div className="chd-contact-detail-text"><strong>Điện thoại</strong><p><a href={`tel:${(settings.site_phone || '').replace(/\s/g, '')}`}>{settings.site_phone}</a></p></div>
                </div>
                <div className="chd-contact-detail">
                  <div className="chd-contact-icon">✉️</div>
                  <div className="chd-contact-detail-text"><strong>Email</strong><p><a href={`mailto:${settings.site_email}`}>{settings.site_email}</a></p></div>
                </div>
                <div className="chd-contact-detail">
                  <div className="chd-contact-icon">🕐</div>
                  <div className="chd-contact-detail-text"><strong>Giờ mở cửa</strong><p>{settings.working_hours}</p></div>
                </div>
              </div>

              <div className="chd-contact-map">
                {settings.map_embed && <iframe src={settings.map_embed} loading="lazy" title={`Bản đồ ${settings.site_name || 'MONO Coffee'}`} allowFullScreen></iframe>}
              </div>
            </div>

            <div className="chd-contact-form" data-reveal data-delay="1">
              <h2>Gửi yêu cầu</h2>
              {result && (
                <div className={`chd-form-alert ${result.ok ? 'chd-form-alert-success' : 'chd-form-alert-error'}`}>{result.message}</div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="chd-form-row">
                  <div className="chd-form-group">
                    <label htmlFor="chdName">Họ và tên</label>
                    <input type="text" id="chdName" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Văn A" required />
                  </div>
                  <div className="chd-form-group">
                    <label htmlFor="chdPhone">Số điện thoại</label>
                    <input type="tel" id="chdPhone" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901 234 567" required />
                  </div>
                </div>
                <div className="chd-form-group">
                  <label htmlFor="chdReason">Loại yêu cầu</label>
                  <select id="chdReason" value={form.reason} onChange={e => set('reason', e.target.value)}>
                    {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="chd-form-row">
                  <div className="chd-form-group">
                    <label htmlFor="chdDate">Ngày mong muốn</label>
                    <input type="date" id="chdDate" value={form.date} onChange={e => set('date', e.target.value)} />
                  </div>
                  <div className="chd-form-group">
                    <label htmlFor="chdPeople">Số người</label>
                    <select id="chdPeople" value={form.people} onChange={e => set('people', e.target.value)}>
                      {PEOPLE_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div className="chd-form-group">
                  <label htmlFor="chdMsg">Nội dung</label>
                  <textarea id="chdMsg" value={form.message} onChange={e => set('message', e.target.value)} placeholder="Mô tả chi tiết yêu cầu của bạn..."></textarea>
                </div>
                <button type="submit" className="chd-btn chd-btn-accent chd-btn-full" disabled={submitting}>
                  {submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
