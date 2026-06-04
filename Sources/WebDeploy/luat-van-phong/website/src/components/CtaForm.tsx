import { useState } from 'react'
import { api } from '../api/client'

interface Props {
  heading?: string
  phone?: string
  subtext?: string
  buttonLabel?: string
}

export default function CtaForm({ heading, phone, subtext, buttonLabel = 'Đăng Ký Tư Vấn Ngay' }: Props) {
  const [form, setForm] = useState({ name: '', phone: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.phone) {
      setStatus('error'); setMsg('Vui lòng điền đầy đủ thông tin'); return
    }
    setStatus('loading')
    try {
      await api.post('/public/consultation', { ...form, source: 'cta' })
      setStatus('success'); setMsg('Đăng ký thành công! Chúng tôi sẽ liên hệ bạn sớm.')
      setForm({ name: '', phone: '' })
    } catch {
      setStatus('error'); setMsg('Có lỗi xảy ra. Vui lòng thử lại.')
    }
  }

  return (
    <section className="lv-cta-section">
      <div className="wd-container">
        <div className="row align-items-center g-5">
          <div className="col-lg-7">
            {heading && <h2 className="lv-cta-heading" dangerouslySetInnerHTML={{ __html: heading }} />}
            {phone   && <p className="lv-cta-phone">{phone}</p>}
          </div>
          <div className="col-lg-5">
            <form className="lv-cta-form" onSubmit={handleSubmit} noValidate>
              <input
                type="text"
                className="lv-cta-input"
                placeholder="Họ và tên"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
              <input
                type="tel"
                className="lv-cta-input"
                placeholder="Số điện thoại"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              />
              <button
                type="submit"
                className="lv-cta-submit"
                style={{ width: '100%', marginTop: '4px' }}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Đang gửi...' : buttonLabel}
              </button>
            </form>
            {status !== 'idle' && (
              <div className={status === 'success' ? 'form-success' : 'form-error'}>{msg}</div>
            )}
            {subtext && (
              <p style={{ fontFamily: 'var(--body-font)', fontSize: '11px', fontWeight: 300, color: 'rgba(255,255,255,.55)', marginTop: '12px' }}>
                {subtext}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
