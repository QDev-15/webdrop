import { useState } from 'react'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

interface ContactForm { name: string; phone: string; email: string; subject: string; message: string }

const FAQS = [
  { q: 'Lần đầu đến khám có cần đặt lịch không?', a: 'Bạn nên đặt lịch trước để được bố trí thời gian tư vấn với bác sĩ đầy đủ nhất. Trường hợp khẩn cấp, chúng tôi vẫn tiếp nhận bệnh nhân walk-in.' },
  { q: 'Chi phí tư vấn lần đầu là bao nhiêu?', a: 'Tư vấn và khám da lần đầu hoàn toàn miễn phí. Bác sĩ sẽ phân tích da và đề xuất phác đồ, bạn quyết định có điều trị hay không.' },
  { q: 'Laser có đau không? Cần thời gian phục hồi bao lâu?', a: 'Cảm giác và thời gian phục hồi phụ thuộc vào loại laser và độ sâu xử lý. Bác sĩ sẽ giải thích chi tiết trước điều trị và cung cấp hướng dẫn chăm sóc hậu liệu.' },
  { q: 'Bao nhiêu buổi thì thấy kết quả?', a: 'Đa số bệnh nhân thấy cải thiện rõ sau 2–4 buổi. Kết quả tối ưu thường đạt sau toàn bộ liệu trình, tùy thuộc tình trạng da ban đầu và loại điều trị.' },
]

export default function Contact() {
  const { settings } = useSite()
  const phone = settings['site_phone'] || '0901 234 567'
  const email = settings['site_email'] || 'info@dermacare.vn'
  const address = settings['site_address'] || '123 Nguyễn Huệ, Q.1, TP.HCM'
  const hours = settings['working_hours'] || 'Thứ 2 – Thứ 7: 8:00 – 18:00 | CN: 8:00 – 12:00'
  const mapEmbed = settings['map_embed'] || ''
  const zaloNumber = settings['zalo_number'] || '0901234567'

  const [form, setForm] = useState<ContactForm>({ name: '', phone: '', email: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  function set(field: keyof ContactForm) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) { setError('Vui lòng điền họ tên và số điện thoại.'); return }
    setSubmitting(true); setError('')
    try {
      await api.post('/public/contact', form)
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra.')
    } finally { setSubmitting(false) }
  }

  return (
    <>
      {/* Contact info + form */}
      <div className="row g-5 mb-5">
        <div className="col-md-5">
          <div className="csd-eyebrow" data-reveal>Liên hệ với chúng tôi</div>
          <h2 className="csd-title" data-reveal data-delay="1">Chúng tôi luôn sẵn sàng<br /><em>lắng nghe bạn</em></h2>
          <p className="csd-sub" data-reveal data-delay="2">Đặt câu hỏi, nhận tư vấn hoặc đặt lịch hẹn — hãy liên lạc ngay qua các kênh dưới đây.</p>

          <div className="mt-4" data-reveal data-delay="3">
            <div className="csd-contact-info-item">
              <div className="csd-ci-icon">📞</div>
              <div>
                <div className="csd-ci-label">Hotline</div>
                <div className="csd-ci-value"><a href={`tel:${phone.replace(/\s/g,'')}`}>{phone}</a></div>
                <div className="csd-ci-sub">Thứ 2 – CN, 8:00 – 18:00</div>
              </div>
            </div>
            <div className="csd-contact-info-item">
              <div className="csd-ci-icon">✉️</div>
              <div>
                <div className="csd-ci-label">Email</div>
                <div className="csd-ci-value"><a href={`mailto:${email}`}>{email}</a></div>
                <div className="csd-ci-sub">Phản hồi trong 24 giờ</div>
              </div>
            </div>
            <div className="csd-contact-info-item">
              <div className="csd-ci-icon">📍</div>
              <div>
                <div className="csd-ci-label">Địa chỉ</div>
                <div className="csd-ci-value">{address}</div>
              </div>
            </div>
            <div className="csd-contact-info-item">
              <div className="csd-ci-icon">⏰</div>
              <div>
                <div className="csd-ci-label">Giờ làm việc</div>
                <div className="csd-ci-value" style={{ fontSize: 14, fontWeight: 400 }}>{hours}</div>
              </div>
            </div>
            <div className="csd-contact-info-item">
              <div className="csd-ci-icon" style={{ background: '#e8f2ff' }}>💬</div>
              <div>
                <div className="csd-ci-label">Zalo</div>
                <div className="csd-ci-value">
                  <a href={`https://zalo.me/${zaloNumber}`} target="_blank" rel="noopener noreferrer">Nhắn Zalo ngay</a>
                </div>
                <div className="csd-ci-sub">Phản hồi nhanh nhất</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-7" data-reveal data-delay="2">
          {success ? (
            <div className="csd-form-card text-center">
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Gửi thành công!</h3>
              <p style={{ color: 'var(--text-2)', fontWeight: 300 }}>Chúng tôi sẽ liên hệ lại trong vòng 24 giờ. Cảm ơn bạn đã liên hệ!</p>
              <button className="csd-btn-ghost mt-3" onClick={() => { setSuccess(false); setForm({ name:'', phone:'', email:'', subject:'', message:'' }) }}>Gửi tin nhắn khác</button>
            </div>
          ) : (
            <form className="csd-form-card" onSubmit={handleSubmit}>
              <h3 className="csd-form-title">Gửi tin nhắn</h3>
              <p className="csd-form-sub">Điền thông tin và câu hỏi — chúng tôi sẽ phản hồi trong 24 giờ.</p>
              {error && <div className="csd-notice" style={{ marginBottom: 16, borderLeftColor: '#e24b4a' }}>{error}</div>}
              <div className="row g-3">
                <div className="col-md-6 csd-form-group">
                  <label className="csd-label">Họ và tên *</label>
                  <input type="text" className="csd-input" value={form.name} onChange={set('name')} placeholder="Nguyễn Thị Lan" required />
                </div>
                <div className="col-md-6 csd-form-group">
                  <label className="csd-label">Số điện thoại *</label>
                  <input type="tel" className="csd-input" value={form.phone} onChange={set('phone')} placeholder="09xx xxx xxx" required />
                </div>
              </div>
              <div className="csd-form-group">
                <label className="csd-label">Email</label>
                <input type="email" className="csd-input" value={form.email} onChange={set('email')} placeholder="email@example.com" />
              </div>
              <div className="csd-form-group">
                <label className="csd-label">Tiêu đề</label>
                <input type="text" className="csd-input" value={form.subject} onChange={set('subject')} placeholder="Hỏi về điều trị mụn" />
              </div>
              <div className="csd-form-group">
                <label className="csd-label">Nội dung</label>
                <textarea className="csd-input" rows={4} value={form.message} onChange={set('message')} placeholder="Mô tả tình trạng da hoặc câu hỏi của bạn..." />
              </div>
              <button type="submit" className="csd-btn-accent w-100" disabled={submitting}>
                {submitting ? 'Đang gửi...' : 'Gửi tin nhắn →'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Map */}
      {mapEmbed ? (
        <div className="csd-map-wrap mb-5" data-reveal>
          <iframe src={mapEmbed} width="100%" height="100%" style={{ border: 0, minHeight: 360 }} allowFullScreen loading="lazy" title="Bản đồ" />
        </div>
      ) : (
        <div className="csd-map-wrap mb-5" data-reveal>
          <div>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📍</div>
            <div>{address}</div>
          </div>
        </div>
      )}

      {/* FAQ */}
      <div data-reveal>
        <div className="text-center mb-4">
          <div className="csd-eyebrow">Câu hỏi thường gặp</div>
          <h2 className="csd-title">Bạn còn thắc mắc<br /><em>về điều trị?</em></h2>
        </div>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ borderBottom: '1px solid var(--border-light)', marginBottom: 0 }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: '100%', textAlign: 'left', background: 'none', border: 'none',
                  padding: '18px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 500, color: 'var(--text)',
                }}
              >
                {faq.q}
                <span style={{ fontSize: 20, color: 'var(--accent)', transition: 'transform .2s', transform: openFaq === i ? 'rotate(45deg)' : 'none', flexShrink: 0, marginLeft: 16 }}>+</span>
              </button>
              {openFaq === i && (
                <p style={{ fontSize: 14, fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.75, paddingBottom: 18, margin: 0 }}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
