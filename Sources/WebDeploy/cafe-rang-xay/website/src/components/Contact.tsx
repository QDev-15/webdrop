import { useState } from 'react'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'

const TOPICS = ['Đặt hạt rang lẻ', 'Đặt sỉ / Bán buôn', 'Đặt lịch tham quan xưởng', 'Góp ý / Khiếu nại', 'Hợp tác khác']

export default function Contact() {
  const { settings } = useSite()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [topic, setTopic] = useState(TOPICS[0])
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const address = settings.contact_address || settings.site_address || 'Số nhà, Đường, Quận, TP.HCM'
  const phoneVal = settings.site_phone || '0901 234 567'
  const emailVal = settings.site_email || 'hello@mocrang.coffee'
  const hours = settings.working_hours || '7:00 – 21:00 hàng ngày (kể cả cuối tuần)'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) {
      setResult({ type: 'error', text: 'Vui lòng nhập họ tên và số điện thoại.' })
      return
    }
    setSubmitting(true); setResult(null)
    try {
      await api.post<{ message: string }>('/public/contact', {
        name,
        phone,
        email,
        subject: topic,
        message,
      })
      setResult({ type: 'success', text: 'Đã gửi — chúng tôi sẽ phản hồi trong vòng 30 phút giờ hành chính.' })
      setName(''); setPhone(''); setEmail(''); setTopic(TOPICS[0]); setMessage('')
    } catch (err: unknown) {
      setResult({ type: 'error', text: err instanceof Error ? err.message : 'Gửi thất bại, vui lòng thử lại.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="crx-sec-pad" style={{ background: 'var(--bg)' }}>
      <div className="crx-container">
        <div className="crx-contact-grid">
          <div className="crx-form-card" data-reveal>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: 19, fontWeight: 400, color: 'var(--text)', marginBottom: 22 }}>Gửi yêu cầu cho chúng tôi</h3>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="crx-form-group">
                    <label htmlFor="crxName">Họ và tên</label>
                    <input type="text" id="crxName" placeholder="Nguyễn Văn A" value={name} onChange={e => setName(e.target.value)} required />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="crx-form-group">
                    <label htmlFor="crxPhone">Số điện thoại</label>
                    <input type="tel" id="crxPhone" placeholder="0901 234 567" value={phone} onChange={e => setPhone(e.target.value)} required />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="crx-form-group">
                    <label htmlFor="crxEmail">Email</label>
                    <input type="email" id="crxEmail" placeholder="email@domain.com" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="crx-form-group">
                    <label htmlFor="crxTopic">Chủ đề</label>
                    <select id="crxTopic" value={topic} onChange={e => setTopic(e.target.value)}>
                      {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="col-12">
                  <div className="crx-form-group">
                    <label htmlFor="crxMsg">Nội dung</label>
                    <textarea id="crxMsg" placeholder="Bạn cần loại hạt nào, số lượng bao nhiêu, thời gian mong muốn..." value={message} onChange={e => setMessage(e.target.value)} />
                  </div>
                </div>
                {result && (
                  <div className="col-12">
                    <p style={{ fontSize: 13.5, color: result.type === 'success' ? 'var(--accent)' : 'var(--danger, #e24b4a)', margin: 0 }}>{result.text}</p>
                  </div>
                )}
                <div className="col-12">
                  <button type="submit" className="crx-btn crx-btn-accent crx-btn-block" disabled={submitting}>
                    {submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div data-reveal data-reveal-d1>
            <div className="crx-eyebrow">Thông tin liên hệ</div>
            <h2 className="crx-sec-title" style={{ marginBottom: 24 }}>Ghé xưởng <em>bất cứ lúc nào</em></h2>
            <div className="crx-info-item">
              <div className="crx-info-icon">📍</div>
              <div>
                <div className="crx-info-label">Địa chỉ</div>
                <div className="crx-info-value">{address}</div>
              </div>
            </div>
            <div className="crx-info-item">
              <div className="crx-info-icon">📱</div>
              <div>
                <div className="crx-info-label">Điện thoại / Zalo</div>
                <div className="crx-info-value"><a href={`tel:${phoneVal.replace(/\s/g, '')}`}>{phoneVal}</a></div>
              </div>
            </div>
            <div className="crx-info-item">
              <div className="crx-info-icon">✉️</div>
              <div>
                <div className="crx-info-label">Email</div>
                <div className="crx-info-value"><a href={`mailto:${emailVal}`}>{emailVal}</a></div>
              </div>
            </div>
            <div className="crx-info-item">
              <div className="crx-info-icon">🕐</div>
              <div>
                <div className="crx-info-label">Giờ mở cửa</div>
                <div className="crx-info-value">{hours}</div>
              </div>
            </div>
            <div className="crx-info-item">
              <div className="crx-info-icon">🚚</div>
              <div>
                <div className="crx-info-label">Giao hàng</div>
                <div className="crx-info-value">Nội thành trong ngày · Tỉnh khác qua GHN/GHTK</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
