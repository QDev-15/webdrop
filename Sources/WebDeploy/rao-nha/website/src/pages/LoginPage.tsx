import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useAccount } from '../contexts/AccountContext'

export default function LoginPage() {
  useDocumentMeta({ title: 'Đăng nhập | RaoNhà', description: 'Đăng nhập tài khoản RaoNhà để đăng tin, quản lý tin đăng và ví credit của bạn.' })
  const { login } = useAccount()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/tai-khoan')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại.')
    } finally { setLoading(false) }
  }

  return (
    <>
      <section className="rn-page-hero">
        <div className="rn-container">
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Tài khoản RaoNhà</div>
          <h1 className="sec-title">Đăng nhập</h1>
          <p className="sec-sub" style={{ margin: '0 auto' }}>Đăng nhập để đăng tin, quản lý tin đã đăng và ví credit của bạn.</p>
        </div>
      </section>

      <section className="sec-pad" style={{ paddingTop: 40 }}>
        <div className="rn-container">
          <div className="rn-auth-wrap">
            <div className="rn-auth-card">
              <form onSubmit={submit}>
                {error && <div className="alert-danger" style={{ marginBottom: 16 }}>{error}</div>}
                <div className="rn-form-group">
                  <label htmlFor="login-email">Email</label>
                  <input id="login-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ban@email.com" required />
                </div>
                <div className="rn-form-group">
                  <label htmlFor="login-password">Mật khẩu</label>
                  <input id="login-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                </div>
                <button type="submit" className="btn-rn btn-rn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
              </form>
            </div>
            <div className="rn-auth-foot">Chưa có tài khoản? <Link to="/dang-ky">Đăng ký ngay</Link></div>
          </div>
        </div>
      </section>
    </>
  )
}
