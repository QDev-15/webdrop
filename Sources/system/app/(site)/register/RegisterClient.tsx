'use client'
import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAccount } from '@/contexts/AccountContext'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid var(--border)',
  background: 'var(--bg)', fontSize: 14, fontFamily: 'var(--sans)', outline: 'none', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 5 }

export default function RegisterClient() {
  const router = useRouter()
  const { refresh } = useAccount()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) { setError('Mật khẩu xác nhận không khớp'); return }

    setSubmitting(true)
    try {
      const res = await fetch('/api/account/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Đăng ký thất bại'); return }
      await refresh()
      router.push('/account')
    } catch {
      setError('Lỗi kết nối, vui lòng thử lại')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="sec-pad">
      <div className="wd-container" style={{ maxWidth: 460 }}>
        <div className="text-center reveal" style={{ marginBottom: 32 }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Tài khoản</div>
          <h1 className="sec-title">Đăng ký tài khoản</h1>
          <p className="sec-sub" style={{ margin: '10px auto 0' }}>Quản lý template, CV và website đã mua chỉ trong 1 tài khoản.</p>
        </div>

        <div className="reveal" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 'clamp(24px,4vw,36px)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label htmlFor="reg-name" style={labelStyle}>Họ và tên</label>
              <input id="reg-name" value={name} onChange={e => setName(e.target.value)} placeholder="Nguyễn Văn A" style={inputStyle} required />
            </div>
            <div className="row g-3" style={{ marginBottom: 14 }}>
              <div className="col-md-6">
                <label htmlFor="reg-email" style={labelStyle}>Email</label>
                <input id="reg-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" style={inputStyle} required />
              </div>
              <div className="col-md-6">
                <label htmlFor="reg-phone" style={labelStyle}>Số điện thoại</label>
                <input id="reg-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="09xxxxxxxx" style={inputStyle} required />
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label htmlFor="reg-password" style={labelStyle}>Mật khẩu</label>
              <input id="reg-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Tối thiểu 6 ký tự" style={inputStyle} required minLength={6} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="reg-confirm" style={labelStyle}>Xác nhận mật khẩu</label>
              <input id="reg-confirm" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Nhập lại mật khẩu" style={inputStyle} required minLength={6} />
            </div>
            {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 13px', marginBottom: 16, fontSize: 13, color: '#dc2626' }}>{error}</div>}
            <button type="submit" disabled={submitting}
              style={{ width: '100%', padding: 13, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 500, fontFamily: 'var(--sans)', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? .7 : 1 }}>
              {submitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-2)', marginTop: 20 }}>
          Đã có tài khoản? <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 500 }}>Đăng nhập</Link>
        </p>
      </div>
    </section>
  )
}
