import { useState } from 'react'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const FAQS = [
  { q: 'Thời gian phản hồi của bạn là bao lâu?', a: 'Chúng tôi thường phản hồi trong vòng 24 giờ làm việc. Các yêu cầu khẩn cấp có thể được ưu tiên.' },
  { q: 'Bạn có cung cấp dịch vụ hỗ trợ 24/7 không?', a: 'Hiện tại chúng tôi hỗ trợ từ 7:00 - 22:00 hàng ngày. Hỗ trợ 24/7 sẽ có trong phiên bản nâng cấp tương lai.' },
  { q: 'Tôi có thể lập đơn hàng ngoài giờ làm việc được không?', a: 'Có, hệ thống POS hoạt động 24/7. Bạn có thể lập đơn bất kỳ lúc nào sau khi mở ca. Hỗ trợ kỹ thuật chỉ khả dụng trong giờ làm việc.' },
  { q: 'Bạn có cung cấp dịch vụ tư vấn không?', a: 'Có, chúng tôi cung cấp tư vấn miễn phí về cách sử dụng hệ thống. Vui lòng liên hệ với chúng tôi để sắp xếp.' },
]

export default function Contact() {
  useDocumentMeta({ title: 'Liên hệ — POS Bán hàng', description: 'Liên hệ với chúng tôi.' })
  const { settings } = useSite()
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [alertState, setAlertState] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  function set<K extends keyof typeof form>(k: K, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.subject || !form.message) {
      setAlertState({ type: 'error', message: 'Vui lòng điền đủ thông tin bắt buộc' })
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      setAlertState({ type: 'error', message: 'Email không hợp lệ' })
      return
    }
    try {
      await api.post('/public/contact', form)
      setAlertState({ type: 'success', message: 'Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất.' })
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err: unknown) {
      setAlertState({ type: 'error', message: err instanceof Error ? err.message : 'Gửi thất bại, vui lòng thử lại.' })
    }
  }

  return (
    <div className="bp-page-content">
      <div className="bp-container">
        <h1>Liên hệ</h1>
        <p>Vui lòng điền form dưới đây để liên hệ với chúng tôi. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', margin: '3rem 0' }}>
          <div className="bp-card">
            <h3>Gửi tin nhắn</h3>
            <form onSubmit={handleSubmit}>
              <div className="bp-input-group">
                <label htmlFor="contactName">Tên của bạn</label>
                <input type="text" id="contactName" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Nhập tên đầy đủ" />
              </div>
              <div className="bp-input-group">
                <label htmlFor="contactEmail">Email</label>
                <input type="email" id="contactEmail" value={form.email} onChange={e => set('email', e.target.value)} required placeholder="Nhập email của bạn" />
              </div>
              <div className="bp-input-group">
                <label htmlFor="contactPhone">Số điện thoại</label>
                <input type="tel" id="contactPhone" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="Nhập số điện thoại (tuỳ chọn)" />
              </div>
              <div className="bp-input-group">
                <label htmlFor="contactSubject">Tiêu đề</label>
                <input type="text" id="contactSubject" value={form.subject} onChange={e => set('subject', e.target.value)} required placeholder="Nhập tiêu đề" />
              </div>
              <div className="bp-input-group">
                <label htmlFor="contactMessage">Nội dung</label>
                <textarea id="contactMessage" value={form.message} onChange={e => set('message', e.target.value)} required placeholder="Nhập nội dung tin nhắn" rows={5} />
              </div>
              <button type="submit" className="bp-btn bp-btn-primary bp-btn-full">Gửi</button>
            </form>
            {alertState && <div className={`bp-alert ${alertState.type} show`} style={{ marginTop: '1rem' }}>{alertState.message}</div>}
          </div>

          <div>
            <div className="bp-card" style={{ marginBottom: '1rem' }}>
              <h3>Thông tin liên hệ</h3>
              <div style={{ margin: '1.5rem 0' }}>
                <div style={{ fontWeight: 500, marginBottom: '0.5rem' }}>📍 Địa chỉ</div>
                <p style={{ margin: 0, color: 'var(--text-2)' }}>{settings.site_address || '123 Đường Ví Dụ, Quận 1, TP.HCM, Việt Nam'}</p>
              </div>
              <div style={{ margin: '1.5rem 0' }}>
                <div style={{ fontWeight: 500, marginBottom: '0.5rem' }}>📞 Điện thoại</div>
                <p style={{ margin: 0, color: 'var(--text-2)' }}><a href={`tel:${settings.site_phone || '0900000000'}`} style={{ color: 'var(--accent)' }}>{settings.site_phone || '0900 000 000'}</a></p>
              </div>
              <div style={{ margin: '1.5rem 0' }}>
                <div style={{ fontWeight: 500, marginBottom: '0.5rem' }}>📧 Email</div>
                <p style={{ margin: 0, color: 'var(--text-2)' }}><a href={`mailto:${settings.site_email || 'info@pos-shop.com'}`} style={{ color: 'var(--accent)' }}>{settings.site_email || 'info@pos-shop.com'}</a></p>
              </div>
              <div style={{ margin: '1.5rem 0' }}>
                <div style={{ fontWeight: 500, marginBottom: '0.5rem' }}>🕐 Giờ làm việc</div>
                <p style={{ margin: 0, color: 'var(--text-2)' }}>{settings.working_hours || 'Thứ 2 - Thứ 7: 7:00 - 22:00. Chủ Nhật: 9:00 - 20:00'}</p>
              </div>
            </div>

            <div className="bp-card">
              <h3>Mạng xã hội</h3>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <a href={settings.facebook_url || '#'} className="bp-btn bp-btn-secondary bp-btn-sm">Facebook</a>
                <a href={settings.instagram_url || '#'} className="bp-btn bp-btn-secondary bp-btn-sm">Instagram</a>
                <a href={settings.zalo_url || '#'} className="bp-btn bp-btn-secondary bp-btn-sm">Zalo</a>
              </div>
            </div>
          </div>
        </div>

        <section className="bp-section">
          <h2>Câu hỏi thường gặp</h2>
          <div style={{ maxWidth: 600, margin: '2rem auto' }}>
            {FAQS.map(f => (
              <details key={f.q} style={{ marginBottom: '1rem' }}>
                <summary style={{ cursor: 'pointer', padding: '1rem', background: 'var(--bg)', borderRadius: 8, fontWeight: 500 }}>{f.q}</summary>
                <p style={{ padding: '1rem', background: 'var(--border-light)', borderRadius: '0 0 8px 8px', marginTop: -4 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
