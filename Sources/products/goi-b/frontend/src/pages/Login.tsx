import { useState, FormEvent } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { user, loading, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail]     = useState('')
  const [password, setPass]   = useState('')
  const [error, setError]     = useState('')
  const [busy, setBusy]       = useState(false)

  if (!loading && user) return <Navigate to="/" replace />

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={submit}>
        <div className="login-logo">web<span>drop</span>.admin</div>

        {error && <div className="login-error">{error}</div>}

        <div style={{ marginBottom: 14 }}>
          <label className="login-label">Email</label>
          <input
            className="login-input"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label className="login-label">Mật khẩu</label>
          <input
            className="login-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPass(e.target.value)}
            required
          />
        </div>

        <button className="login-btn" type="submit" disabled={busy}>
          {busy ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  )
}
