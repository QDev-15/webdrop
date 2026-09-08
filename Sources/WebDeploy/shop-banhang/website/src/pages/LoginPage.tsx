import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../api/client'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface Shift { id: number }

export default function LoginPage() {
  useDocumentMeta({ title: 'Đăng nhập — POS Bán hàng', description: 'Đăng nhập hệ thống quản lý bán hàng POS.' })
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    redirectAfterLogin(user.role)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function redirectAfterLogin(role: string) {
    if (role === 'superadmin') {
      window.location.href = '/admin/'
      return
    }
    try {
      const shift = await api.get<Shift | null>('/shifts/current')
      navigate(shift ? '/pos' : '/ca-lam-viec', { replace: true })
    } catch {
      navigate('/ca-lam-viec', { replace: true })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Vui lòng nhập email và mật khẩu'); return }
    setLoading(true)
    try {
      const u = await login(email, password)
      await redirectAfterLogin(u.role)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Tên đăng nhập hoặc mật khẩu không chính xác')
    } finally { setLoading(false) }
  }

  return (
    <div className="bp-login-container">
      <div className="bp-login-box">
        <h1>POS Bán Hàng</h1>
        <form onSubmit={handleSubmit}>
          <div className="bp-form-group">
            <label htmlFor="loginEmail">Email đăng nhập</label>
            <input type="email" id="loginEmail" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Nhập email đăng nhập" autoComplete="username" />
          </div>
          <div className="bp-form-group">
            <label htmlFor="loginPassword">Mật khẩu</label>
            <input type="password" id="loginPassword" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Nhập mật khẩu" autoComplete="current-password" />
          </div>
          {error && <div className="bp-alert error show">{error}</div>}
          <button type="submit" className="bp-btn bp-btn-primary bp-btn-full" disabled={loading}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
          <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-2)' }}>
            <p><strong>Tài khoản demo:</strong></p>
            <p>Thu ngân: nv01@pos-banhang.local / 123456</p>
            <p>Quản lý: sysadmin@admin.com / 123456</p>
          </div>
        </form>
      </div>
    </div>
  )
}
