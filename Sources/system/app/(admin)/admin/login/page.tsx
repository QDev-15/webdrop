'use client'
import { useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Đăng nhập thất bại'); return }
      router.push(redirect)
      router.refresh()
    } catch {
      setError('Lỗi kết nối, vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--sans)', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 22, fontWeight: 600, color: '#fff', marginBottom: 6 }}>
            web<span style={{ color: '#4ade80' }}>drop</span>.vn
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,.4)', fontWeight: 300 }}>Đăng nhập quản trị</div>
        </div>

        <div style={{ background: 'var(--surface)', borderRadius: 14, padding: '28px 28px 24px', border: '1px solid var(--border)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                required autoFocus
                style={{ width: '100%', padding: '10px 13px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 14, fontFamily: 'var(--sans)', outline: 'none', color: 'var(--text)', boxSizing: 'border-box' }}
                placeholder="admin@webdrop.store"
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Mật khẩu</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 13px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 14, fontFamily: 'var(--sans)', outline: 'none', color: 'var(--text)', boxSizing: 'border-box' }}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 13px', marginBottom: 16, fontSize: 13, color: '#dc2626' }}>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              style={{ width: '100%', padding: '12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 500, fontFamily: 'var(--sans)', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .7 : 1, transition: 'all .2s' }}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
