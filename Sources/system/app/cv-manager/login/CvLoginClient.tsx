'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CvLoginClient() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/cv/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Đăng nhập thất bại'); return }
      router.push('/cv-manager/edit')
    } catch {
      setError('Lỗi kết nối, thử lại sau')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg, #faf9f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '0 20px' }}>
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8e5df', padding: '40px 36px' }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#0c0b09', marginBottom: 4 }}>
              webdrop<span style={{ color: '#4ade80' }}>.</span>store
            </div>
            <div style={{ fontSize: 14, color: '#6b6760' }}>Đăng nhập để chỉnh sửa CV của bạn</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#1a1917', marginBottom: 6 }}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                required autoFocus
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e8e5df', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                placeholder="email@example.com"
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#1a1917', marginBottom: 6 }}>Mật khẩu</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e8e5df', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                placeholder="••••••••"
              />
            </div>

            {error && <div style={{ fontSize: 13, color: '#e24b4a', marginBottom: 16, padding: '10px 12px', background: '#fef2f2', borderRadius: 8 }}>{error}</div>}

            <button
              type="submit" disabled={loading}
              style={{ width: '100%', padding: '11px', background: loading ? '#a09d97' : '#1a6b52', color: '#fff', border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'background .2s' }}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
