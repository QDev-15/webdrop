'use client'
import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAccount } from '@/contexts/AccountContext'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid var(--border)',
  background: 'var(--bg)', fontSize: 14, fontFamily: 'var(--sans)', outline: 'none', boxSizing: 'border-box',
}

export default function LoginClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refresh } = useAccount()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true); setError('')
    try {
      const res = await fetch('/api/account/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Đăng nhập thất bại'); return }
      await refresh()
      router.push(searchParams.get('redirect') || '/account')
    } catch {
      setError('Lỗi kết nối, vui lòng thử lại')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="sec-pad">
      <div className="wd-container" style={{ maxWidth: 440 }}>
        <div className="text-center reveal" style={{ marginBottom: 32 }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Tài khoản</div>
          <h1 className="sec-title">Đăng nhập</h1>
        </div>

        <div className="reveal" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 'clamp(24px,4vw,36px)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="login-identifier" style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 5 }}>Email hoặc số điện thoại</label>
              <input id="login-identifier" value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder="email@example.com hoặc 09xxxxxxxx" style={inputStyle} required />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="login-password" style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 5 }}>Mật khẩu</label>
              <input id="login-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} required />
            </div>
            {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 13px', marginBottom: 16, fontSize: 13, color: '#dc2626' }}>{error}</div>}
            <button type="submit" disabled={submitting}
              style={{ width: '100%', padding: 13, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 500, fontFamily: 'var(--sans)', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? .7 : 1 }}>
              {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-2)', marginTop: 20 }}>
          Chưa có tài khoản? <Link href="/register" style={{ color: 'var(--accent)', fontWeight: 500 }}>Đăng ký ngay</Link>
        </p>
      </div>
    </section>
  )
}
