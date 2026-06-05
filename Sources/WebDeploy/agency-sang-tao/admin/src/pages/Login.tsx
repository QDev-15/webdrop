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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ÄÄƒng nháº­p tháº¥t báº¡i')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">NOVA<span>.</span></div>
        <h1 className="login-title">ÄÄƒng nháº­p</h1>
        <p className="login-sub">Truy cáº­p trang quáº£n trá»‹ ná»™i dung</p>
        {error && <div className="login-err">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email" className="form-control"
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="sysadmin@admin.com"
              required autoFocus autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Máº­t kháº©u</label>
            <input
              type="password" className="form-control"
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
              required autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Äang Ä‘Äƒng nháº­p...' : 'ÄÄƒng nháº­p'}
          </button>
        </form>
        <p style={{ fontSize: '11px', color: 'var(--text-3)', textAlign: 'center', marginTop: '20px' }}>
          Máº·c Ä‘á»‹nh: admin@agency.vn / Admin@2026
        </p>
      </div>
    </div>
  )
}

