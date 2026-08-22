import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function ContactPage() {
  const { settings } = useSite()
  const [form, setForm] = useState({ name: '', email: '', phone: '', type: '', budget: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useDocumentMeta({
    title: `Liên hệ — ${settings.site_name || 'Lam Trúc Illustration'}`,
    description: settings.contact_hero_sub || 'Liên hệ Lam Trúc để trao đổi dự án minh họa, character design hoặc sách tranh thiếu nhi.',
  })

  function set(k: keyof typeof form, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.email.trim() || !form.type || !form.message.trim()) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc (*).')
      return
    }
    setSending(true)
    try {
      await api.post('/public/contact', form)
      setSent(true)
      setForm({ name: '', email: '', phone: '', type: '', budget: '', message: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gửi thất bại, vui lòng thử lại.')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <section className="pmh-page-hero">
        <div className="pmh-container inner">
          <div className="pmh-crumb"><Link to="/">Trang chủ</Link> / Liên hệ</div>
          <h1>Kể mình nghe <em>ý tưởng của bạn</em></h1>
          <p>{settings.contact_hero_sub}</p>
        </div>
      </section>

      <section className="pmh-sec">
        <div className="pmh-container">
          <div className="pmh-contact-grid">

            {sent ? (
              <div className="pmh-form" data-reveal>
                <div className="pmh-info-card" style={{ borderStyle: 'solid', borderColor: 'var(--accent)' }}>
                  <h4>Đã gửi thành công!</h4>
                  <p style={{ fontWeight: 400, fontSize: 15, color: 'var(--text-2)' }}>Cảm ơn bạn đã gửi thông tin. Lam Trúc sẽ liên hệ lại trong vòng 24-48h.</p>
                </div>
              </div>
            ) : (
              <form className="pmh-form" data-reveal onSubmit={handleSubmit}>
                {error && <div className="alert alert-error">{error}</div>}
                <div className="pmh-form-row">
                  <div className="pmh-field">
                    <label htmlFor="pmhName">Họ và tên *</label>
                    <input type="text" id="pmhName" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Văn A" required />
                  </div>
                  <div className="pmh-field">
                    <label htmlFor="pmhEmail">Email *</label>
                    <input type="email" id="pmhEmail" value={form.email} onChange={e => set('email', e.target.value)} placeholder="ban@email.com" required />
                  </div>
                </div>
                <div className="pmh-form-row">
                  <div className="pmh-field">
                    <label htmlFor="pmhPhone">Số điện thoại</label>
                    <input type="tel" id="pmhPhone" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0987 654 321" />
                  </div>
                  <div className="pmh-field">
                    <label htmlFor="pmhType">Loại dự án *</label>
                    <select id="pmhType" value={form.type} onChange={e => set('type', e.target.value)} required>
                      <option value="">— Chọn loại dự án —</option>
                      <option value="Sách tranh thiếu nhi">Sách tranh thiếu nhi</option>
                      <option value="Character Design / Bộ nhân vật">Character Design / Bộ nhân vật</option>
                      <option value="Editorial Illustration / Tạp chí">Editorial Illustration / Tạp chí</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>
                <div className="pmh-field">
                  <label htmlFor="pmhBudget">Ngân sách dự kiến</label>
                  <select id="pmhBudget" value={form.budget} onChange={e => set('budget', e.target.value)}>
                    <option value="">— Chọn khoảng ngân sách —</option>
                    <option value="Dưới 5 triệu">Dưới 5 triệu</option>
                    <option value="5 – 15 triệu">5 – 15 triệu</option>
                    <option value="15 – 25 triệu">15 – 25 triệu</option>
                    <option value="Trên 25 triệu">Trên 25 triệu</option>
                  </select>
                </div>
                <div className="pmh-field">
                  <label htmlFor="pmhMsg">Mô tả dự án *</label>
                  <textarea id="pmhMsg" value={form.message} onChange={e => set('message', e.target.value)} placeholder="Kể mình nghe về câu chuyện/dự án bạn đang ấp ủ, timeline mong muốn..." required></textarea>
                </div>
                <button type="submit" className="pmh-btn pmh-btn-primary" style={{ alignSelf: 'flex-start' }} disabled={sending}>{sending ? 'Đang gửi...' : 'Gửi yêu cầu'}</button>
              </form>
            )}

            <div className="pmh-contact-info" data-reveal>
              {settings.site_email && (
                <div className="pmh-info-card">
                  <h4>Email</h4>
                  <a href={`mailto:${settings.site_email}`}>{settings.site_email}</a>
                </div>
              )}
              {settings.site_phone && (
                <div className="pmh-info-card">
                  <h4>Điện thoại / Zalo</h4>
                  <a href={`tel:+84${settings.site_phone.replace(/\D/g, '').replace(/^0/, '')}`}>{settings.site_phone}</a>
                </div>
              )}
              {settings.service_area && (
                <div className="pmh-info-card">
                  <h4>Khu vực làm việc</h4>
                  <p>{settings.service_area}</p>
                </div>
              )}
              <div className="pmh-info-card">
                <h4>Mạng xã hội</h4>
                <div className="pmh-social-row">
                  {settings.instagram && <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">IG</a>}
                  {settings.behance && <a href={settings.behance} target="_blank" rel="noopener noreferrer" aria-label="Behance">Be</a>}
                  {settings.facebook && <a href={settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">FB</a>}
                </div>
              </div>
            </div>

          </div>

          {settings.map_embed && (
            <div className="pmh-map-embed" data-reveal>
              <iframe src={settings.map_embed} loading="lazy" title="Vị trí studio Lam Trúc trên Google Maps" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          )}
        </div>
      </section>
    </>
  )
}
