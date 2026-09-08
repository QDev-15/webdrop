import { useState } from 'react'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const SUBJECTS = [
  'Câu hỏi chung',
  'Đóng góp bài viết',
  'Đề xuất hợp tác quảng cáo/tài trợ',
  'Báo lỗi nội dung bài viết',
  'Khác',
]

export default function Contact() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Liên hệ — ${settings.site_name || 'Xê Dịch'}`,
    description: settings.contact_hero_sub || 'Liên hệ Xê Dịch — góp ý bài viết, đóng góp nội dung hoặc trao đổi hợp tác quảng cáo.',
  })

  const [form, setForm] = useState({ name: '', email: '', subject: SUBJECTS[0], message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setStatus('sending')
    try {
      await api.post('/public/contact', form)
      setStatus('sent')
      setForm({ name: '', email: '', subject: SUBJECTS[0], message: '' })
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Gửi thất bại, vui lòng thử lại.')
    }
  }

  return (
    <>
      <header className="bdl-page-hero">
        <div className="bdl-container">
          <div className="bdl-eyebrow" style={{ color: '#e0b568' }}>Kết nối</div>
          <h1 className="bdl-ph-title">Liên hệ</h1>
          <p className="bdl-ph-sub">{settings.contact_hero_sub || 'Có câu hỏi, muốn đóng góp bài viết hay đề xuất hợp tác quảng cáo? Gửi tin nhắn cho tôi qua form bên dưới hoặc các kênh liên hệ trực tiếp.'}</p>
        </div>
      </header>

      <section className="bdl-sec-pad">
        <div className="bdl-container">
          <div className="bdl-contact-grid">
            <div data-reveal>
              <div className="bdl-form-card">
                {status === 'sent' ? (
                  <p style={{ color: 'var(--accent)', fontSize: 15, lineHeight: 1.7 }}>
                    Cảm ơn bạn đã gửi tin nhắn! Tôi sẽ phản hồi sớm nhất có thể qua email.
                  </p>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="bdl-form-group">
                      <label htmlFor="cf-name">Họ và tên</label>
                      <input type="text" id="cf-name" placeholder="Nguyễn Văn A" required
                        value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div className="bdl-form-group">
                      <label htmlFor="cf-email">Email</label>
                      <input type="email" id="cf-email" placeholder="ban@email.com" required
                        value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div className="bdl-form-group">
                      <label htmlFor="cf-subject">Chủ đề</label>
                      <select id="cf-subject" value={form.subject}
                        onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                        {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="bdl-form-group">
                      <label htmlFor="cf-message">Nội dung</label>
                      <textarea id="cf-message" placeholder="Nội dung bạn muốn gửi..." required
                        value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                    </div>
                    {error && <p style={{ color: '#b91c1c', marginBottom: 14, fontSize: 14 }}>{error}</p>}
                    <button type="submit" className="bdl-btn bdl-btn-accent bdl-btn-block" disabled={status === 'sending'}>
                      {status === 'sending' ? 'Đang gửi...' : 'Gửi tin nhắn'}
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div data-reveal data-reveal-d1>
              <div className="bdl-info-item">
                <div className="bdl-info-icon">✉</div>
                <div>
                  <div className="bdl-info-label">Email</div>
                  <div className="bdl-info-value">{settings.site_email || 'hello@xedich.vn'}</div>
                </div>
              </div>
              <div className="bdl-info-item">
                <div className="bdl-info-icon">📞</div>
                <div>
                  <div className="bdl-info-label">Điện thoại / Zalo</div>
                  <div className="bdl-info-value">{settings.site_phone || '0909 123 456'}</div>
                </div>
              </div>
              <div className="bdl-info-item">
                <div className="bdl-info-icon">📍</div>
                <div>
                  <div className="bdl-info-label">Văn phòng đại diện</div>
                  <div className="bdl-info-value">{settings.site_address || 'Phường 8, TP. Đà Lạt, tỉnh Lâm Đồng'}</div>
                </div>
              </div>
              <div className="bdl-info-item">
                <div className="bdl-info-icon">🕑</div>
                <div>
                  <div className="bdl-info-label">Thời gian phản hồi</div>
                  <div className="bdl-info-value">{settings.working_hours || 'Phản hồi email/Zalo trong vòng 24-48h'}</div>
                </div>
              </div>
              <div className="bdl-info-item">
                <div className="bdl-info-icon">🤝</div>
                <div>
                  <div className="bdl-info-label">Hợp tác quảng cáo/tài trợ</div>
                  <div className="bdl-info-value">{settings.contact_collab_note || 'Chọn chủ đề "Đề xuất hợp tác" ở form bên cạnh, tôi sẽ phản hồi trong vòng 3-5 ngày làm việc kèm bảng giá.'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
