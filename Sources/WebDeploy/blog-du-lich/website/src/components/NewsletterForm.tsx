import { useState } from 'react'
import { api } from '../api/client'

interface Props {
  variant?: 'hero' | 'footer'
}

// Template gốc: form "onsubmit return false" (không làm gì cả) — cải tiến để thực sự hữu ích:
// gửi email đăng ký qua endpoint /public/contact (không đổi cấu trúc UI/behavior hiển thị).
export default function NewsletterForm({ variant = 'hero' }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('sending')
    try {
      await api.post('/public/contact', {
        name: 'Đăng ký bản tin',
        email,
        subject: 'Đăng ký nhận bản tin',
        message: `Yêu cầu đăng ký nhận bản tin từ website với email: ${email}`,
      })
      setStatus('done')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return <p style={{ color: variant === 'hero' ? '#e0b568' : 'inherit', fontSize: 14 }}>Cảm ơn bạn đã đăng ký! Hãy để ý hộp thư email nhé.</p>
  }

  return (
    <form className={variant === 'hero' ? 'bdl-newsletter-form' : 'bdl-footer-newsletter'} onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder={variant === 'hero' ? 'Nhập email của bạn' : 'Email của bạn'}
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button type="submit" disabled={status === 'sending'}>{status === 'sending' ? '...' : (variant === 'hero' ? 'Đăng ký' : 'Gửi')}</button>
    </form>
  )
}
