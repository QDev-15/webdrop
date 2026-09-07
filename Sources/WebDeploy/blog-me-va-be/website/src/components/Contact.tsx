import { useState } from 'react'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { renderEmphasis } from '../utils/renderEmphasis'
import { api } from '../api/client'

const SUBJECT_OPTIONS = [
  'Chia sẻ câu chuyện của mình',
  'Đóng góp bài viết',
  'Đề xuất hợp tác quảng cáo / review',
  'Góp ý cho blog',
  'Khác',
]

export default function Contact() {
  const { settings } = useSite()
  const [form, setForm] = useState({ name: '', email: '', subject: SUBJECT_OPTIONS[0], message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useDocumentMeta({
    title: `Liên hệ — ${settings.site_name || 'Cỏ Non Blog'}`,
    description: 'Liên hệ với Hạ Vy — Cỏ Non Blog để chia sẻ câu chuyện, đóng góp bài viết, hợp tác quảng cáo hoặc góp ý cho blog.',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.message.trim()) { setError('Vui lòng nhập họ tên và nội dung.'); return }
    setSending(true)
    try {
      await api.post('/public/contact', form)
      setSent(true)
      setForm({ name: '', email: '', subject: SUBJECT_OPTIONS[0], message: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gửi thất bại, vui lòng thử lại.')
    } finally {
      setSending(false)
    }
  }

  return (
    <main>
      <section className="bmb-sec bmb-center" style={{ paddingTop: 130, paddingBottom: 20 }}>
        <div className="bmb-container">
          <div className="bmb-eyebrow" data-reveal style={{ display: 'flex', justifyContent: 'center' }}>💌 Liên hệ</div>
          <h1 className="bmb-sec-title" data-reveal>{renderEmphasis(settings.contact_hero_title || 'Mình luôn sẵn sàng *lắng nghe*')}</h1>
          <p className="bmb-sec-sub" data-reveal>{settings.contact_hero_sub || ''}</p>
        </div>
      </section>

      <section className="bmb-sec" style={{ paddingTop: 24 }}>
        <div className="bmb-container">
          <div className="row g-5">
            <div className="col-lg-5" data-reveal>
              <div className="d-flex flex-column gap-3">
                <div className="bmb-contact-card">
                  <div className="bmb-contact-icon">✉️</div>
                  <div>
                    <h4>Email</h4>
                    <p>{settings.site_email}<br />Phản hồi trong 3-5 ngày làm việc</p>
                  </div>
                </div>
                <div className="bmb-contact-card">
                  <div className="bmb-contact-icon">💬</div>
                  <div>
                    <h4>Zalo / Điện thoại</h4>
                    <p>{settings.site_phone}<br />Từ 9:00 - 21:00 các ngày trong tuần</p>
                  </div>
                </div>
                <div className="bmb-contact-card">
                  <div className="bmb-contact-icon">👩‍👩‍👧‍👦</div>
                  <div>
                    <h4>Nhóm kín Facebook</h4>
                    <p>"{settings.fb_group_name}"<br />{settings.fb_group_members}</p>
                  </div>
                </div>
                <div className="bmb-contact-card">
                  <div className="bmb-contact-icon">📍</div>
                  <div>
                    <h4>Địa chỉ văn phòng</h4>
                    <p>{settings.site_address}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-7" data-reveal data-reveal-d1>
              {sent ? (
                <div className="bmb-contact-card" style={{ flexDirection: 'column', textAlign: 'center', gap: 14, padding: 40 }}>
                  <div style={{ fontSize: 32 }}>💌</div>
                  <h4>Cảm ơn bạn đã gửi tin nhắn!</h4>
                  <p>Hạ Vy sẽ đọc và phản hồi trong 3–5 ngày làm việc.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: 36 }}>
                  {error && <div style={{ marginBottom: 16, color: 'var(--danger)', fontSize: 13.5 }}>{error}</div>}
                  <div className="row g-3">
                    <div className="col-md-6 bmb-form-group">
                      <label className="bmb-form-label">Họ và tên</label>
                      <input type="text" className="bmb-form-input" placeholder="Nguyễn Thị A" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                    </div>
                    <div className="col-md-6 bmb-form-group">
                      <label className="bmb-form-label">Email</label>
                      <input type="email" className="bmb-form-input" placeholder="ban@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                    </div>
                    <div className="col-12 bmb-form-group">
                      <label className="bmb-form-label">Chủ đề</label>
                      <select className="bmb-form-input" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                        {SUBJECT_OPTIONS.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div className="col-12 bmb-form-group">
                      <label className="bmb-form-label">Nội dung</label>
                      <textarea className="bmb-form-textarea" placeholder="Viết nội dung bạn muốn chia sẻ..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="bmb-btn bmb-btn-primary" disabled={sending}>{sending ? 'Đang gửi...' : 'Gửi tin nhắn 💌'}</button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
