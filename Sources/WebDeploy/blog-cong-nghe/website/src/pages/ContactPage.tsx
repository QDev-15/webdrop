import { useState } from 'react'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const SUBJECTS = [
  'Gửi bài viết cộng tác',
  'Đề xuất chủ đề bài viết',
  'Hợp tác review sản phẩm',
  'Hợp tác quảng cáo',
  'Báo lỗi nội dung',
  'Khác',
]

export default function ContactPage() {
  useDocumentMeta({
    title: 'Liên hệ — PIXEL. Blog Công Nghệ',
    description: 'Liên hệ PIXEL. để gửi bài viết, đề xuất chủ đề, hợp tác review sản phẩm hoặc quảng cáo.',
  })

  const { settings } = useSite()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setResult(null)
    try {
      const res = await api.post<{ message: string }>('/public/contact', form)
      setResult({ ok: true, text: res.message || 'Cảm ơn bạn đã liên hệ!' })
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      setResult({ ok: false, text: err instanceof Error ? err.message : 'Gửi liên hệ thất bại, vui lòng thử lại.' })
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <header className="bcn-page-hero">
        <div className="bcn-page-hero-grid" aria-hidden="true"></div>
        <div className="bcn-container bcn-page-hero-inner">
          <div className="bcn-hero-label" style={{ marginBottom: 18 }}>Kết nối</div>
          <h1>Liên hệ</h1>
          <p>Gửi bài viết, đề xuất chủ đề, hợp tác review sản phẩm hoặc quảng cáo — chúng tôi phản hồi trong 3-5 ngày làm việc.</p>
        </div>
      </header>

      <section className="bcn-sec">
        <div className="bcn-container">
          <div className="bcn-contact-grid">
            <div data-reveal>
              <div className="bcn-eyebrow">Gửi tin nhắn</div>
              <h2 className="bcn-sec-title">Bạn muốn trao đổi điều gì?</h2>
              <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="bcn-form-group">
                      <label htmlFor="bcnName">Họ và tên</label>
                      <input type="text" id="bcnName" name="name" required placeholder="Nguyễn Văn A"
                        value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="bcn-form-group">
                      <label htmlFor="bcnEmail">Email</label>
                      <input type="email" id="bcnEmail" name="email" required placeholder="ban@email.com"
                        value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                  </div>
                </div>
                <div className="bcn-form-group">
                  <label htmlFor="bcnSubject">Chủ đề</label>
                  <select id="bcnSubject" name="subject" required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                    <option value="">— Chọn chủ đề —</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="bcn-form-group">
                  <label htmlFor="bcnMessage">Nội dung</label>
                  <textarea id="bcnMessage" name="message" rows={5} required placeholder="Nội dung bạn muốn trao đổi với PIXEL...."
                    value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                </div>
                {result && (
                  <div style={{ marginBottom: 16, fontSize: 13.5, color: result.ok ? 'var(--accent-h)' : 'var(--danger)' }}>{result.text}</div>
                )}
                <button type="submit" className="bcn-btn bcn-btn-accent bcn-btn-full" disabled={sending}>
                  {sending ? 'Đang gửi...' : 'Gửi liên hệ'} <i className="bi bi-send"></i>
                </button>
              </form>
            </div>

            <div data-reveal data-delay="1">
              <div className="bcn-eyebrow">Thông tin</div>
              <h2 className="bcn-sec-title">Kênh liên hệ khác</h2>
              <div style={{ marginTop: 8 }}>
                <div className="bcn-contact-info-item">
                  <span className="bcn-contact-info-icon"><i className="bi bi-envelope"></i></span>
                  <div><h5>Email biên tập</h5><p>{settings.contact_email}</p></div>
                </div>
                <div className="bcn-contact-info-item">
                  <span className="bcn-contact-info-icon"><i className="bi bi-megaphone"></i></span>
                  <div><h5>Hợp tác quảng cáo</h5><p>{settings.contact_ads_email}</p></div>
                </div>
                <div className="bcn-contact-info-item">
                  <span className="bcn-contact-info-icon"><i className="bi bi-telephone"></i></span>
                  <div><h5>Hotline</h5><p>{settings.contact_hotline} ({settings.working_hours})</p></div>
                </div>
                <div className="bcn-contact-info-item">
                  <span className="bcn-contact-info-icon"><i className="bi bi-geo-alt"></i></span>
                  <div><h5>Văn phòng</h5><p>{settings.site_address}</p></div>
                </div>
                <div className="bcn-contact-info-item" style={{ borderBottom: 'none' }}>
                  <span className="bcn-contact-info-icon"><i className="bi bi-clock"></i></span>
                  <div><h5>Thời gian phản hồi</h5><p>{settings.contact_hours}</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
