import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'

const FAQS = [
  {
    q: 'Cửa hàng có hỗ trợ build PC theo yêu cầu không?',
    a: 'Có. Bạn có thể gửi yêu cầu cấu hình mong muốn hoặc để kỹ thuật viên tư vấn theo ngân sách và nhu cầu sử dụng cụ thể (văn phòng, gaming, đồ họa...).',
  },
  {
    q: 'Chính sách bảo hành như thế nào?',
    a: 'Bảo hành chính hãng từ 12–36 tháng tùy sản phẩm, 1 đổi 1 trong 30 ngày đầu nếu lỗi từ nhà sản xuất.',
  },
  {
    q: 'Thời gian giao hàng là bao lâu?',
    a: 'Nội thành: 1–2 ngày làm việc. Tỉnh thành khác: 2–4 ngày làm việc. PC build theo yêu cầu cần thêm 1–2 ngày lắp ráp và test.',
  },
  {
    q: 'Trả góp 0% áp dụng như thế nào?',
    a: 'Áp dụng cho đơn hàng từ 5.000.000đ qua thẻ tín dụng hoặc công ty tài chính liên kết, duyệt hồ sơ trong 15 phút.',
  },
  {
    q: 'Các phương thức thanh toán được chấp nhận?',
    a: 'Thanh toán khi nhận hàng (COD), chuyển khoản ngân hàng, ví điện tử (MoMo, ZaloPay), thẻ VISA/MasterCard, trả góp qua thẻ tín dụng.',
  },
]

export default function Contact() {
  const { settings } = useSite()
  const val = (k: string, fallback = '') => settings[k] || fallback

  const [form, setForm] = useState({ name: '', phone: '', email: '', topic: '', message: '' })
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const [error, setError] = useState('')

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc (*)')
      setStatus('error')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await api.post('/public/contact', { name: form.name, phone: form.phone, email: form.email, subject: form.topic, message: form.message })
      setStatus('ok')
      setForm({ name: '', phone: '', email: '', topic: '', message: '' })
      setTimeout(() => setStatus('idle'), 4000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gửi thất bại, vui lòng thử lại')
      setStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  const phone = val('site_phone', '0900 123 456')
  const phoneHref = phone.replace(/\s/g, '')
  const email = val('site_email', 'cskh@novatech.vn')

  return (
    <>
      <div className="mt-page-header" style={{ paddingBottom: 52 }}>
        <div className="mt-container">
          <nav className="mt-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Trang chủ</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span><span>Liên hệ</span>
          </nav>
          <h1 className="mt-page-title">Liên hệ với chúng tôi</h1>
          <p className="mt-page-count" style={{ fontSize: 16 }}>Đội ngũ kỹ thuật viên luôn sẵn sàng tư vấn cấu hình và hỗ trợ bảo hành nhanh chóng</p>
        </div>
      </div>

      <div className="mt-quick-contact">
        <div className="mt-container">
          <div className="mt-quick-contact-inner">
            <a href={`tel:${phoneHref}`} className="mt-quick-contact-item">
              <div className="mt-quick-contact-icon"><i className="bi bi-telephone" /></div>
              <div><div className="mt-quick-contact-label">Hotline</div><div className="mt-quick-contact-value">{phone}</div></div>
            </a>
            <a href={`mailto:${email}`} className="mt-quick-contact-item">
              <div className="mt-quick-contact-icon"><i className="bi bi-envelope" /></div>
              <div><div className="mt-quick-contact-label">Email</div><div className="mt-quick-contact-value">{email}</div></div>
            </a>
            <div className="mt-quick-contact-item">
              <div className="mt-quick-contact-icon"><i className="bi bi-clock" /></div>
              <div><div className="mt-quick-contact-label">Giờ làm việc</div><div className="mt-quick-contact-value">{val('working_hours', '8:00 – 21:00 · Tất cả các ngày')}</div></div>
            </div>
          </div>
        </div>
      </div>

      <main>
        <section className="mt-contact-section">
          <div className="mt-container">
            <div className="mt-contact-grid">
              <div data-reveal>
                <h2>Ghé thăm <strong>showroom</strong></h2>
                <p>{val('contact_intro', 'Chúng tôi luôn chào đón bạn đến trực tiếp trải nghiệm sản phẩm và test cấu hình trước khi mua. Đội ngũ kỹ thuật viên sẽ tư vấn đúng nhu cầu sử dụng của bạn.')}</p>
                <div className="mt-contact-details">
                  <div className="mt-contact-detail">
                    <div className="mt-contact-icon"><i className="bi bi-geo-alt-fill" /></div>
                    <div className="mt-contact-detail-text"><strong>Địa chỉ showroom</strong><p>{val('site_address', '72 Nguyễn Văn Linh, Phường Tân Phong, Quận 7, TP. Hồ Chí Minh')}</p></div>
                  </div>
                  <div className="mt-contact-detail">
                    <div className="mt-contact-icon"><i className="bi bi-telephone-fill" /></div>
                    <div className="mt-contact-detail-text"><strong>Điện thoại / Zalo</strong><p><a href={`tel:${phoneHref}`} style={{ color: 'var(--accent)' }}>{phone}</a></p></div>
                  </div>
                  <div className="mt-contact-detail">
                    <div className="mt-contact-icon"><i className="bi bi-envelope-fill" /></div>
                    <div className="mt-contact-detail-text"><strong>Email</strong><p><a href={`mailto:${email}`} style={{ color: 'var(--accent)' }}>{email}</a></p></div>
                  </div>
                  <div className="mt-contact-detail">
                    <div className="mt-contact-icon"><i className="bi bi-clock-fill" /></div>
                    <div className="mt-contact-detail-text"><strong>Giờ mở cửa</strong><p>Tất cả các ngày: {val('working_hours', '8:00 – 21:00')}</p></div>
                  </div>
                </div>

                <div style={{ marginTop: 32 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '.06em' }}>Theo dõi chúng tôi</div>
                  <div className="mt-contact-social-row">
                    {val('facebook') && <a href={val('facebook')} className="mt-contact-social-btn" target="_blank" rel="noopener noreferrer"><i className="bi bi-facebook" style={{ color: '#1877f2' }} /> Facebook</a>}
                    {val('instagram') && <a href={val('instagram')} className="mt-contact-social-btn" target="_blank" rel="noopener noreferrer"><i className="bi bi-instagram" style={{ color: '#e1306c' }} /> Instagram</a>}
                    {val('youtube') && <a href={val('youtube')} className="mt-contact-social-btn" target="_blank" rel="noopener noreferrer"><i className="bi bi-youtube" style={{ color: '#ff0000' }} /> YouTube</a>}
                  </div>
                </div>

                {val('map_embed') && (
                  <div className="mt-contact-map" style={{ marginTop: 32 }} aria-label="Bản đồ vị trí showroom">
                    <iframe title={`Bản đồ vị trí ${val('site_name', 'NovaTech')}`} src={val('map_embed')} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
                  </div>
                )}
              </div>

              <div data-reveal data-delay="2">
                <div className="mt-contact-form">
                  <h3>Gửi yêu cầu tư vấn</h3>
                  <form onSubmit={handleSubmit} noValidate>
                    {status === 'ok' && <p style={{ color: 'var(--accent)', fontSize: 13, marginBottom: 14 }}>Đã gửi thành công! Chúng tôi sẽ liên hệ lại sớm nhất.</p>}
                    {status === 'error' && error && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 14 }}>{error}</p>}
                    <div className="mt-form-row">
                      <div className="mt-form-group"><label htmlFor="contact-name">Họ và tên <span style={{ color: 'var(--accent)' }}>*</span></label><input type="text" id="contact-name" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Văn A" required /></div>
                      <div className="mt-form-group"><label htmlFor="contact-phone">Số điện thoại <span style={{ color: 'var(--accent)' }}>*</span></label><input type="tel" id="contact-phone" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0900 123 456" required /></div>
                    </div>
                    <div className="mt-form-group"><label htmlFor="contact-email">Email</label><input type="email" id="contact-email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" /></div>
                    <div className="mt-form-group">
                      <label htmlFor="contact-topic">Chủ đề</label>
                      <select id="contact-topic" value={form.topic} onChange={e => set('topic', e.target.value)}>
                        <option value="">-- Chọn chủ đề --</option>
                        <option value="Tư vấn cấu hình">Tư vấn cấu hình</option>
                        <option value="Theo dõi đơn hàng">Theo dõi đơn hàng</option>
                        <option value="Bảo hành / Sửa chữa">Bảo hành / Sửa chữa</option>
                        <option value="Mua sỉ / Hợp tác">Mua sỉ / Hợp tác</option>
                        <option value="Vấn đề khác">Vấn đề khác</option>
                      </select>
                    </div>
                    <div className="mt-form-group"><label htmlFor="contact-message">Tin nhắn <span style={{ color: 'var(--accent)' }}>*</span></label><textarea id="contact-message" value={form.message} onChange={e => set('message', e.target.value)} placeholder="Mô tả nhu cầu sử dụng hoặc yêu cầu hỗ trợ của bạn..." rows={5} required /></div>
                    <button type="submit" className="mt-submit-btn" disabled={submitting}>
                      <i className="bi bi-send-fill" />{submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', padding: 'clamp(64px,8vw,100px) 0' }} aria-labelledby="faq-heading">
          <div className="mt-container-sm">
            <div className="text-center mb-5">
              <div className="mt-eyebrow" style={{ justifyContent: 'center' }} data-reveal>FAQ</div>
              <h2 className="mt-sec-title" id="faq-heading" data-reveal data-delay="1">Câu hỏi <strong>thường gặp</strong></h2>
            </div>
            <div className="mt-faq-list" data-reveal data-delay="2">
              {FAQS.map((f, i) => (
                <div className="mt-faq-item" key={f.q}>
                  <button className="mt-faq-btn" aria-expanded={openFaq === i} onClick={() => setOpenFaq(o => o === i ? null : i)}>
                    {f.q}
                    <i className="bi bi-plus-lg" style={{ transform: openFaq === i ? 'rotate(45deg)' : undefined }} />
                  </button>
                  <div className="mt-faq-content" style={{ display: openFaq === i ? 'block' : 'none' }}>{f.a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-cta-dark">
          <div className="mt-container">
            <div className="mt-cta-dark-grid">
              <div data-reveal>
                <div className="mt-eyebrow" style={{ color: 'var(--cyan)' }}>Bắt đầu ngay</div>
                <h2>Tìm cấu hình <strong>phù hợp với bạn</strong></h2>
                <p>Khám phá hàng trăm sản phẩm máy tính được chọn lọc kỹ lưỡng — từ văn phòng nhẹ nhàng đến gaming hiệu năng cao.</p>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <Link to="/san-pham" className="mt-btn mt-btn-primary"><i className="bi bi-cpu" />Khám phá sản phẩm</Link>
                  <Link to="/gio-hang" className="mt-btn mt-btn-glass">Xem giỏ hàng</Link>
                </div>
              </div>
              <div className="mt-cta-img-grid" data-reveal data-delay="2">
                <div><img src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&auto=format&fit=crop&q=80" alt="PC Gaming nổi bật" loading="lazy" /></div>
                <div><img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&auto=format&fit=crop&q=80" alt="Laptop mới" loading="lazy" /></div>
                <div><img src="https://images.unsplash.com/photo-1625842268584-8f3296236761?w=300&auto=format&fit=crop&q=80" alt="Card đồ họa" loading="lazy" /></div>
                <div><img src="https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=300&auto=format&fit=crop&q=80" alt="Gaming gear" loading="lazy" /></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
