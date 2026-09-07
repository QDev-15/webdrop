import { useState } from 'react'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const SUBJECTS = [
  'Góp ý về một công thức',
  'Báo lỗi bài viết',
  'Hợp tác quảng cáo / review',
  'Gửi công thức đóng góp',
  'Khác',
]

export default function Contact() {
  const { settings } = useSite()
  useDocumentMeta({
    title: 'Liên hệ — Bếp Xanh',
    description: 'Liên hệ Bếp Xanh — góp ý công thức, báo lỗi bài viết, hoặc trao đổi hợp tác quảng cáo/review quán ăn.',
  })

  const [form, setForm] = useState({ name: '', email: '', subject: SUBJECTS[0], message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setSending(true)
    try {
      await api.post('/public/contact', form)
      setSent(true)
      setForm({ name: '', email: '', subject: SUBJECTS[0], message: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gửi thất bại, vui lòng thử lại.')
    } finally { setSending(false) }
  }

  return (
    <>
      <header className="bam-page-header">
        <div className="bam-container">
          <div className="bam-breadcrumb"><a href="/">Trang chủ</a> / Liên hệ</div>
          <h1 className="bam-page-title">Liên hệ với {settings.site_name || 'Bếp Xanh'}</h1>
          <p className="bam-page-sub">Góp ý công thức, báo lỗi bài viết, hay đơn giản là muốn chào hỏi — điền form bên dưới, tôi sẽ phản hồi trong 1-2 ngày làm việc.</p>
        </div>
      </header>

      <section className="bam-sec">
        <div className="bam-container">
          <div className="bam-contact-layout">
            <div data-reveal>
              <h2 className="bam-sec-title" style={{ marginBottom: 24 }}>Thông tin <em>liên hệ</em></h2>
              <div className="bam-info-item">
                <div className="bam-info-icon"><i className="bi bi-geo-alt" /></div>
                <div><div className="bam-info-label">Địa chỉ</div><div className="bam-info-value">{settings.site_address}</div></div>
              </div>
              <div className="bam-info-item">
                <div className="bam-info-icon"><i className="bi bi-telephone" /></div>
                <div><div className="bam-info-label">Điện thoại / Zalo</div><div className="bam-info-value">{settings.site_phone}</div></div>
              </div>
              <div className="bam-info-item">
                <div className="bam-info-icon"><i className="bi bi-envelope" /></div>
                <div><div className="bam-info-label">Email</div><div className="bam-info-value">{settings.site_email}</div></div>
              </div>
              <div className="bam-info-item">
                <div className="bam-info-icon"><i className="bi bi-clock" /></div>
                <div><div className="bam-info-label">Thời gian phản hồi</div><div className="bam-info-value">{settings.working_hours}</div></div>
              </div>
              <div className="bam-info-item">
                <div className="bam-info-icon"><i className="bi bi-briefcase" /></div>
                <div><div className="bam-info-label">Hợp tác quảng cáo/review</div><div className="bam-info-value">Vui lòng ghi rõ "Hợp tác" trong chủ đề form</div></div>
              </div>

              <div className="bam-footer-social" style={{ marginTop: 24 }}>
                <a href={settings.social_facebook || '#'} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="bi bi-facebook" /></a>
                <a href={settings.social_instagram || '#'} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="bi bi-instagram" /></a>
                <a href={settings.social_youtube || '#'} target="_blank" rel="noopener noreferrer" aria-label="Youtube"><i className="bi bi-youtube" /></a>
                <a href={settings.social_pinterest || '#'} target="_blank" rel="noopener noreferrer" aria-label="Pinterest"><i className="bi bi-pinterest" /></a>
              </div>
            </div>

            <div className="bam-form-card" data-reveal data-reveal-d1>
              {sent ? (
                <div className="alert alert-success" style={{ padding: 20, borderRadius: 12, background: 'var(--accent-light)', color: 'var(--accent-h)' }}>
                  Cảm ơn bạn đã liên hệ! Bếp Xanh sẽ phản hồi trong 1-2 ngày làm việc.
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="bam-form-group">
                        <label htmlFor="bamName">Họ và tên</label>
                        <input type="text" id="bamName" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nguyễn Văn A" required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="bam-form-group">
                        <label htmlFor="bamEmail">Email</label>
                        <input type="email" id="bamEmail" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@domain.com" required />
                      </div>
                    </div>
                  </div>
                  <div className="bam-form-group">
                    <label htmlFor="bamSubject">Chủ đề</label>
                    <select id="bamSubject" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                      {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="bam-form-group">
                    <label htmlFor="bamMsg">Nội dung</label>
                    <textarea id="bamMsg" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Bạn muốn chia sẻ điều gì với Bếp Xanh?" required />
                  </div>
                  {error && <div className="alert alert-error" style={{ marginBottom: 16, color: '#b91c1c' }}>{error}</div>}
                  <button type="submit" className="bam-btn bam-btn-primary" style={{ width: '100%' }} disabled={sending}>
                    {sending ? 'Đang gửi...' : <>Gửi liên hệ <i className="bi bi-send" /></>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
