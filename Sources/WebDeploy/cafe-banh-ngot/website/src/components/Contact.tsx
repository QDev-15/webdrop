import { useState } from 'react'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

interface ContactFormState {
  name: string
  phone: string
  email: string
  subject: string
  date: string
  detail: string
  message: string
}

const empty: ContactFormState = { name: '', phone: '', email: '', subject: '', date: '', detail: '', message: '' }

export default function Contact() {
  const { settings } = useSite()
  const [form, setForm] = useState<ContactFormState>(empty)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  function set<K extends keyof ContactFormState>(k: K, v: ContactFormState[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Vui lòng điền họ tên và số điện thoại.')
      return
    }
    setError(''); setSending(true)
    try {
      await api.post('/public/contact', form)
      setSent(true)
      setForm(empty)
      setTimeout(() => setSent(false), 6000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gửi thất bại, vui lòng thử lại.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="row g-5">
      <div className="col-lg-7 cbn-reveal">
        <div className="cbn-inline-form">
          <h3>Gửi yêu cầu đặt bánh / đặt chỗ</h3>
          {sent && <div className="alert alert-success" style={{ marginBottom: 16 }}>Cảm ơn bạn! Rosette sẽ liên hệ xác nhận trong vòng 15 phút.</div>}
          {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="cbn-form-label">Họ và tên</label>
                <input type="text" className="cbn-form-control" placeholder="Nguyễn Văn A" value={form.name} onChange={e => set('name', e.target.value)} required />
              </div>
              <div className="col-md-6">
                <label className="cbn-form-label">Số điện thoại</label>
                <input type="tel" className="cbn-form-control" placeholder="0901 234 567" value={form.phone} onChange={e => set('phone', e.target.value)} required />
              </div>
              <div className="col-md-6">
                <label className="cbn-form-label">Email</label>
                <input type="email" className="cbn-form-control" placeholder="email@domain.com" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div className="col-md-6">
                <label className="cbn-form-label">Nhu cầu</label>
                <select className="cbn-form-select" value={form.subject} onChange={e => set('subject', e.target.value)}>
                  <option value="">-- Chọn nhu cầu --</option>
                  <option>Đặt chỗ ngồi</option>
                  <option>Đặt bánh sinh nhật</option>
                  <option>Đặt tiệc trà nhóm</option>
                  <option>Góp ý / khác</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="cbn-form-label">Ngày mong muốn</label>
                <input type="date" className="cbn-form-control" value={form.date} onChange={e => set('date', e.target.value)} />
              </div>
              <div className="col-md-6">
                <label className="cbn-form-label">Số người / kích thước bánh</label>
                <input type="text" className="cbn-form-control" placeholder="VD: 4 người, hoặc bánh 1kg" value={form.detail} onChange={e => set('detail', e.target.value)} />
              </div>
              <div className="col-12">
                <label className="cbn-form-label">Nội dung chi tiết</label>
                <textarea className="cbn-form-control" rows={4} placeholder="Mô tả ý tưởng bánh, ghi chú thêm..." value={form.message} onChange={e => set('message', e.target.value)} />
              </div>
              <div className="col-12">
                <button type="submit" className="cbn-btn-accent w-100" style={{ padding: 14, fontSize: 14 }} disabled={sending}>
                  {sending ? 'Đang gửi...' : 'Gửi yêu cầu'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="col-lg-5 cbn-reveal cbn-reveal-d1">
        {settings.map_embed && (
          <iframe className="cbn-ft-map" style={{ height: '100%', minHeight: 340 }} src={settings.map_embed} loading="lazy" title="Bản đồ Rosette Bakery & Cafe" referrerPolicy="no-referrer-when-downgrade" />
        )}
        <div className="mt-4" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 20, padding: '22px 24px' }}>
          <div className="cbn-ft-col-title mb-2">Kết nối với chúng mình</div>
          <div className="cbn-ft-socials">
            <a href={settings.facebook_url || '#'} className="cbn-ft-soc fb" aria-label="Facebook" target="_blank" rel="noopener noreferrer">f</a>
            <a href={settings.instagram_url || '#'} className="cbn-ft-soc ig" aria-label="Instagram" target="_blank" rel="noopener noreferrer">ig</a>
            <a href={`https://zalo.me/${(settings.zalo_phone || '0901234567').replace(/\D/g, '')}`} className="cbn-ft-soc zl" aria-label="Zalo" target="_blank" rel="noopener noreferrer">zl</a>
            <a href={settings.tiktok_url || '#'} className="cbn-ft-soc tt" aria-label="TikTok" target="_blank" rel="noopener noreferrer">tt</a>
          </div>
        </div>
      </div>
    </div>
  )
}
