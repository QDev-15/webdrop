import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ÄÄƒng nháº­p tháº¥t báº¡i')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-mark">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 21V9l9-6 9 6v12H3zM9 21V12h6v9" />
            </svg>
          </div>
          <div>
            <div className="login-title">Quáº£n trá»‹ viÃªn</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>CÃ´ng Ty XÃ¢y Dá»±ng</div>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email" type="email" className="form-input"
              placeholder="sysadmin@admin.com"
              value={email} onChange={e => setEmail(e.target.value)} required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Máº­t kháº©u</label>
            <input
              id="password" type="password" className="form-input"
              placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
              value={password} onChange={e => setPassword(e.target.value)} required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? 'Äang Ä‘Äƒng nháº­p...' : 'ÄÄƒng nháº­p'}
          </button>
        </form>

        <p style={{ marginTop: 20, fontSize: 12, color: 'var(--text-3)', textAlign: 'center' }}>
          Máº·c Ä‘á»‹nh: admin@congtyxaydung.vn / Admin@2026
        </p>
      </div>
    </div>
  )
}

