import { useState, FormEvent } from 'react'
import { post } from '../api/client'

interface Props { title?: string; subtitle?: string }

export default function ContactForm({ title, subtitle }: Props) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [busy, setBusy]     = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError]   = useState('')

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError(''); setBusy(true)
    try {
      const res = await post<{ message: string }>('/contact', form)
      setSuccess(res.message || 'Gửi thành công!')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gửi thất bại, vui lòng thử lại')
    } finally {
      setBusy(false)
    }
  }

  if (success) return (
    <div className="contact-form">
      {title && <h2 className="section-title text-center mb-2">{title}</h2>}
      <div className="form-success">{success}</div>
    </div>
  )

  return (
    <div className="contact-form">
      {title && <h2 className="section-title text-center mb-2">{title}</h2>}
      {subtitle && <p className="section-sub text-center mb-4">{subtitle}</p>}

      <form onSubmit={submit}>
        {error && <div className="form-error">{error}</div>}

        <div className="row g-3">
          <div className="col-md-6">
            <div className="form-field">
              <label>Họ tên *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Nguyễn Văn A" />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-field">
              <label>Số điện thoại</label>
              <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901 234 567" />
            </div>
          </div>
          <div className="col-12">
            <div className="form-field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
            </div>
          </div>
          <div className="col-12">
            <div className="form-field">
              <label>Chủ đề</label>
              <input value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="Tiêu đề tin nhắn" />
            </div>
          </div>
          <div className="col-12">
            <div className="form-field">
              <label>Nội dung *</label>
              <textarea value={form.message} onChange={e => set('message', e.target.value)} required placeholder="Nội dung tin nhắn..." />
            </div>
          </div>
        </div>

        <button className="btn-submit" type="submit" disabled={busy}>
          {busy ? 'Đang gửi...' : 'Gửi tin nhắn →'}
        </button>
      </form>
    </div>
  )
}
