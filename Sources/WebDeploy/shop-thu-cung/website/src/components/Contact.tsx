import { useState } from 'react'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const MINI_FAQS = [
  { q: 'Thời gian phản hồi trung bình?', a: 'Trong vòng 24 giờ làm việc, thường phản hồi Zalo/hotline nhanh hơn email.' },
  { q: 'Có hỗ trợ tư vấn qua điện thoại không?', a: 'Có, gọi hotline trong giờ làm việc để được tư vấn trực tiếp về sản phẩm phù hợp cho thú cưng.' },
  { q: 'Tôi muốn trở thành đại lý phân phối?', a: 'Vui lòng chọn chủ đề "Hợp tác đại lý / bán sỉ" ở form bên cạnh, đội ngũ kinh doanh sẽ liên hệ báo giá riêng.' },
]

export default function Contact() {
  const { settings } = useSite()
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: 'Hỏi về sản phẩm', message: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useDocumentMeta({
    title: 'Liên hệ — Pet Haus',
    description: 'Liên hệ Pet Haus — cửa hàng thú cưng chính hãng. Gửi câu hỏi, hợp tác đại lý, hoặc phản hồi dịch vụ.',
  })

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await api.post('/public/contact', form)
      setSent(true)
      setForm({ name: '', phone: '', email: '', subject: 'Hỏi về sản phẩm', message: '' })
      setTimeout(() => setSent(false), 4000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gửi thất bại, vui lòng thử lại')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <section className="tc-page-header">
        <div className="tc-container tc-page-header-inner">
          <div className="tc-eyebrow">Chúng tôi luôn lắng nghe</div>
          <h1>Liên hệ với Pet Haus</h1>
          <p>Có câu hỏi về sản phẩm, đơn hàng, hoặc muốn hợp tác đại lý? Gửi cho chúng tôi, đội ngũ sẽ phản hồi trong ngày.</p>
        </div>
      </section>

      <section className="tc-sec">
        <div className="tc-container">
          <div className="row g-3 mb-5" data-reveal>
            <div className="col-md-4">
              <div className="tc-prod-card" style={{ padding: 26, borderTopColor: 'var(--accent)' }}>
                <div className="tc-feature-icon" style={{ marginBottom: 14 }}>📍</div>
                <h3 style={{ fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Địa chỉ cửa hàng</h3>
                <p style={{ fontSize: 13.5, color: 'var(--text-2)' }}>{settings.site_address || '52 Nguyễn Văn Trỗi, Phường 15, Quận Phú Nhuận, TP. Hồ Chí Minh'}</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="tc-prod-card" style={{ padding: 26, borderTopColor: 'var(--accent)' }}>
                <div className="tc-feature-icon" style={{ marginBottom: 14 }}>📞</div>
                <h3 style={{ fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Hotline</h3>
                <p style={{ fontSize: 13.5, color: 'var(--text-2)' }}>
                  <a href={`tel:${settings.site_phone || ''}`} style={{ color: 'inherit' }}>{settings.site_phone || '1900 636 963'}</a> · {settings.working_hours || 'T2–CN: 8:00–20:00'}
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="tc-prod-card" style={{ padding: 26, borderTopColor: 'var(--accent)' }}>
                <div className="tc-feature-icon" style={{ marginBottom: 14 }}>✉️</div>
                <h3 style={{ fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Email hỗ trợ</h3>
                <p style={{ fontSize: 13.5, color: 'var(--text-2)' }}>
                  <a href={`mailto:${settings.site_email || ''}`} style={{ color: 'inherit' }}>{settings.site_email || 'hello@pethaus.vn'}</a>
                </p>
              </div>
            </div>
          </div>

          <div className="row g-5">
            <div className="col-lg-7" data-reveal>
              <h2 className="tc-sec-title" style={{ fontSize: 24, marginBottom: 20 }}>Gửi tin nhắn cho chúng tôi</h2>
              <form onSubmit={handleSubmit}>
                {error && <p style={{ color: 'var(--danger)', fontSize: 13.5, marginBottom: 14 }}>{error}</p>}
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="tc-form-group">
                      <label htmlFor="tcName">Họ tên</label>
                      <input type="text" id="tcName" name="name" required placeholder="Nguyễn Văn A" value={form.name} onChange={e => set('name', e.target.value)} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="tc-form-group">
                      <label htmlFor="tcPhone">Số điện thoại</label>
                      <input type="tel" id="tcPhone" name="phone" required placeholder="09xx xxx xxx" value={form.phone} onChange={e => set('phone', e.target.value)} />
                    </div>
                  </div>
                </div>
                <div className="tc-form-group">
                  <label htmlFor="tcEmail">Email</label>
                  <input type="email" id="tcEmail" name="email" required placeholder="ban@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
                </div>
                <div className="tc-form-group">
                  <label htmlFor="tcSubject">Chủ đề</label>
                  <select id="tcSubject" name="subject" value={form.subject} onChange={e => set('subject', e.target.value)}>
                    <option>Hỏi về sản phẩm</option>
                    <option>Hỗ trợ đơn hàng</option>
                    <option>Hợp tác đại lý / bán sỉ</option>
                    <option>Góp ý dịch vụ</option>
                    <option>Khác</option>
                  </select>
                </div>
                <div className="tc-form-group">
                  <label htmlFor="tcMessage">Nội dung</label>
                  <textarea id="tcMessage" name="message" required placeholder="Nội dung bạn muốn gửi..." value={form.message} onChange={e => set('message', e.target.value)} />
                </div>
                <button type="submit" className="tc-btn tc-btn-primary tc-btn-lg" disabled={submitting}>{submitting ? 'Đang gửi...' : 'Gửi liên hệ'}</button>
                {sent && <p style={{ marginTop: 14, fontSize: 13.5, color: 'var(--accent-h)' }}>✓ Cảm ơn bạn! Chúng tôi sẽ phản hồi sớm nhất.</p>}
              </form>
            </div>
            <div className="col-lg-5" data-reveal data-delay="1">
              <div className="tc-faq" style={{ maxWidth: 'none' }}>
                {MINI_FAQS.map((item, i) => (
                  <div className={'tc-faq-item' + (openFaq === i ? ' open' : '')} key={item.q}>
                    <button className="tc-faq-q" onClick={() => setOpenFaq(o => o === i ? null : i)}>{item.q} <span className="tc-faq-icon">+</span></button>
                    <div className="tc-faq-a"><div className="tc-faq-a-inner">{item.a}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
