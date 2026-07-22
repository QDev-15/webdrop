import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const FAQS = [
  {
    q: 'Máy ảnh mua tại đây có phải hàng chính hãng không?',
    a: 'Có. Mọi thiết bị đều nhập khẩu chính ngạch, có tem chống hàng giả và phiếu bảo hành điện tử kích hoạt ngay khi giao hàng — có thể tra cứu trực tuyến.',
  },
  {
    q: 'Thời gian bảo hành và phạm vi áp dụng?',
    a: 'Bảo hành chính hãng 24 tháng cho thân máy và ống kính, 12 tháng cho phụ kiện (flash, tripod, balo) — áp dụng lỗi do nhà sản xuất, không bao gồm va đập hoặc vào nước.',
  },
  {
    q: 'Có nhận sửa chữa máy không mua tại cửa hàng không?',
    a: 'Có. Xưởng kỹ thuật nhận sửa chữa, vệ sinh cảm biến và hiệu chỉnh lấy nét cho mọi dòng máy, kèm báo giá chi tiết trước khi tiến hành.',
  },
  {
    q: 'Chính sách đổi trả áp dụng như thế nào?',
    a: 'Đổi trả trong vòng 7 ngày kể từ ngày nhận hàng nếu thiết bị còn nguyên tem, đầy đủ phụ kiện và lỗi thuộc về nhà sản xuất.',
  },
  {
    q: 'Có hỗ trợ trả góp khi mua thân máy hoặc ống kính không?',
    a: 'Có. Hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng của các ngân hàng liên kết hoặc qua công ty tài chính, duyệt hồ sơ nhanh trong ngày.',
  },
]

export default function Contact() {
  useDocumentMeta({
    title: 'Liên Hệ — PhotoPro Máy Ảnh & Thiết Bị Nhiếp Ảnh',
    description: 'Liên hệ với PhotoPro — tư vấn chọn máy ảnh, ống kính, đặt lịch sửa chữa/vệ sinh cảm biến, hỗ trợ bảo hành.',
  })

  const { settings } = useSite()
  const val = (k: string, fallback = '') => settings[k] || fallback

  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: 'Tư vấn chọn máy / ống kính', message: '' })
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const [error, setError] = useState('')

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc')
      setStatus('error')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await api.post('/public/contact', form)
      setStatus('ok')
      setForm({ name: '', phone: '', email: '', subject: 'Tư vấn chọn máy / ống kính', message: '' })
      setTimeout(() => setStatus('idle'), 4000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gửi thất bại, vui lòng thử lại')
      setStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  const phone = val('site_phone', '0909 123 456')
  const phoneHref = phone.replace(/\s/g, '')
  const email = val('site_email', 'lienhe@photopro.vn')

  return (
    <>
      <div className="ma-quick-bar">
        <div className="ma-container">
          <div className="ma-quick-item"><i className="bi bi-telephone-fill" /> Hotline: <strong>{phone}</strong></div>
          <div className="ma-quick-item"><i className="bi bi-envelope-fill" /> <strong>{email}</strong></div>
          <div className="ma-quick-item"><i className="bi bi-clock-fill" /> {val('working_hours', '8:30 – 21:00, tất cả các ngày')}</div>
        </div>
      </div>

      <div className="ma-container ma-contact-wrap">
        <div className="ma-breadcrumb ma-on-light" style={{ marginBottom: 24 }}>
          <Link to="/">Trang chủ</Link><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /><span>Liên hệ</span>
        </div>

        <div className="ma-contact-grid">
          <div className="ma-contact-info" data-reveal>
            <h1>Cần tư vấn thiết bị? <em style={{ color: 'var(--accent)' }}>Chúng tôi ở đây</em></h1>
            <p>{val('contact_intro', 'Có câu hỏi về máy ảnh, ống kính hoặc muốn đặt lịch bảo trì, vệ sinh cảm biến? Gửi thông tin cho chúng tôi, kỹ thuật viên sẽ phản hồi trong vòng 2 giờ làm việc.')}</p>

            <div className="ma-contact-details">
              <div className="ma-contact-detail">
                <div className="ma-contact-icon"><i className="bi bi-geo-alt" /></div>
                <div className="ma-contact-detail-text">
                  <strong>Địa chỉ cửa hàng</strong>
                  <p>{val('site_address', '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM')}</p>
                </div>
              </div>
              <div className="ma-contact-detail">
                <div className="ma-contact-icon"><i className="bi bi-telephone" /></div>
                <div className="ma-contact-detail-text">
                  <strong>Hotline tư vấn</strong>
                  <p><a href={`tel:${phoneHref}`} style={{ color: 'var(--accent)' }}>{phone}</a> ({val('working_hours', '8:30 – 21:00')})</p>
                </div>
              </div>
              <div className="ma-contact-detail">
                <div className="ma-contact-icon"><i className="bi bi-envelope" /></div>
                <div className="ma-contact-detail-text">
                  <strong>Email hỗ trợ</strong>
                  <p>{email}</p>
                </div>
              </div>
              <div className="ma-contact-detail">
                <div className="ma-contact-icon"><i className="bi bi-wrench-adjustable" /></div>
                <div className="ma-contact-detail-text">
                  <strong>Xưởng kỹ thuật</strong>
                  <p>{val('contact_workshop_text', 'Nhận sửa chữa & vệ sinh cảm biến trong ngày, có lịch hẹn trước')}</p>
                </div>
              </div>
            </div>

            {val('map_embed') && (
              <div className="ma-contact-map">
                <iframe src={val('map_embed')} title="Bản đồ vị trí cửa hàng" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            )}
          </div>

          <div className="ma-contact-form" data-reveal data-delay="1">
            <h2>Gửi tin nhắn cho chúng tôi</h2>
            <form onSubmit={handleSubmit} noValidate>
              {status === 'ok' && <p style={{ color: 'var(--accent)', fontSize: 13, marginBottom: 14 }}>Đã gửi thành công! Chúng tôi sẽ liên hệ lại sớm nhất.</p>}
              {status === 'error' && error && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 14 }}>{error}</p>}
              <div className="ma-form-row">
                <div className="ma-form-group">
                  <label htmlFor="ma-name">Họ và tên</label>
                  <input type="text" id="ma-name" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Văn A" required />
                </div>
                <div className="ma-form-group">
                  <label htmlFor="ma-phone">Số điện thoại</label>
                  <input type="tel" id="ma-phone" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="09xx xxx xxx" required />
                </div>
              </div>
              <div className="ma-form-group">
                <label htmlFor="ma-email">Email</label>
                <input type="email" id="ma-email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="ban@email.com" />
              </div>
              <div className="ma-form-group">
                <label htmlFor="ma-subject">Chủ đề</label>
                <select id="ma-subject" value={form.subject} onChange={e => set('subject', e.target.value)}>
                  <option>Tư vấn chọn máy / ống kính</option>
                  <option>Hỏi về đơn hàng</option>
                  <option>Bảo hành / sửa chữa</option>
                  <option>Đặt lịch vệ sinh cảm biến</option>
                  <option>Khác</option>
                </select>
              </div>
              <div className="ma-form-group">
                <label htmlFor="ma-message">Nội dung</label>
                <textarea id="ma-message" value={form.message} onChange={e => set('message', e.target.value)} placeholder="Nội dung tin nhắn của bạn..." required />
              </div>
              <button type="submit" className="ma-btn ma-btn-primary ma-btn-full" disabled={submitting}>
                <i className="bi bi-send" /> {submitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <section className="ma-sec ma-faq-bg">
        <div className="ma-container">
          <div className="ma-sec-header ma-center" data-reveal>
            <div className="ma-eyebrow"><i className="bi bi-question-circle" /> Hỏi đáp</div>
            <h2 className="ma-sec-title">Câu hỏi <em>thường gặp</em></h2>
          </div>
          <div className="ma-faq-list" data-reveal>
            {FAQS.map((f, i) => (
              <div className={'ma-faq-item' + (openFaq === i ? ' open' : '')} key={f.q}>
                <button className="ma-faq-q" aria-expanded={openFaq === i} onClick={() => setOpenFaq(o => o === i ? null : i)}>
                  {f.q}
                  <span className="ma-faq-icon"><i className="bi bi-plus" /></span>
                </button>
                <div className="ma-faq-a">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ma-cta-dark">
        <div className="ma-container ma-cta-grid">
          <div className="ma-cta-content" data-reveal>
            <div className="ma-eyebrow"><i className="bi bi-camera-reels" /> Ghé thăm showroom</div>
            <h2>Trải nghiệm máy trực tiếp<br /><em>trước khi quyết định</em></h2>
            <p>Ghé showroom để cầm thử thân máy, so sánh ống kính và nhận tư vấn 1-1 từ kỹ thuật viên — không gian trưng bày mở cửa mỗi ngày.</p>
            <a href={val('map_embed') || '#'} className="ma-btn ma-btn-white ma-btn-lg" target={val('map_embed') ? '_blank' : undefined} rel="noopener noreferrer">
              <i className="bi bi-geo-alt" /> Xem chỉ đường đến showroom
            </a>
          </div>
          <div className="ma-cta-images" data-reveal data-delay="1">
            <img src="https://images.unsplash.com/photo-1550928431-ee0ec6db30d3?w=500&auto=format&fit=crop&q=80" alt="Không gian trưng bày thiết bị nhiếp ảnh" loading="lazy" />
            <img src="https://images.unsplash.com/photo-1552168324-d612d77725e3?w=500&auto=format&fit=crop&q=80" alt="Kỹ thuật viên tư vấn khách hàng chọn máy ảnh" loading="lazy" />
          </div>
        </div>
      </section>
    </>
  )
}
