import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useAccount } from '../contexts/AccountContext'

export default function RegisterPage() {
  useDocumentMeta({ title: 'Đăng ký tài khoản | RaoNhà', description: 'Tạo tài khoản RaoNhà miễn phí để đăng tin, quản lý tin đăng và nâng cấp gói VIP khi cần bán/cho thuê nhanh hơn.' })
  const { register } = useAccount()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Mật khẩu tối thiểu 6 ký tự.'); return }
    if (password !== passwordConfirm) { setError('Mật khẩu xác nhận không khớp.'); return }
    if (!agree) { setError('Vui lòng đồng ý với Điều khoản sử dụng và Chính sách bảo mật.'); return }
    setLoading(true)
    try {
      await register({ name, email, phone, password })
      navigate('/tai-khoan')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại.')
    } finally { setLoading(false) }
  }

  return (
    <>
      <section className="rn-page-hero">
        <div className="rn-container">
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Tài khoản RaoNhà</div>
          <h1 className="sec-title">Đăng ký tài khoản</h1>
          <p className="sec-sub" style={{ margin: '0 auto' }}>Miễn phí, chỉ mất 1 phút — đăng tin ngay sau khi tạo tài khoản.</p>
        </div>
      </section>

      <section className="sec-pad" style={{ paddingTop: 40 }}>
        <div className="rn-container">
          <div className="rn-auth-wrap">
            <div className="rn-auth-card">
              <form onSubmit={submit}>
                {error && <div className="alert-danger" style={{ marginBottom: 16 }}>{error}</div>}
                <div className="rn-form-group">
                  <label htmlFor="register-name">Họ và tên</label>
                  <input id="register-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nguyễn Văn A" required />
                </div>
                <div className="row g-3">
                  <div className="col-md-6 rn-form-group">
                    <label htmlFor="register-email">Email</label>
                    <input id="register-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ban@email.com" required />
                  </div>
                  <div className="col-md-6 rn-form-group">
                    <label htmlFor="register-phone">Số điện thoại</label>
                    <input id="register-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="09xx xxx xxx" required />
                  </div>
                </div>
                <div className="rn-form-group">
                  <label htmlFor="register-password">Mật khẩu</label>
                  <input id="register-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Tối thiểu 6 ký tự" required minLength={6} />
                </div>
                <div className="rn-form-group">
                  <label htmlFor="register-password-confirm">Xác nhận mật khẩu</label>
                  <input id="register-password-confirm" type="password" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} placeholder="Nhập lại mật khẩu" required minLength={6} />
                </div>
                <div className="rn-form-group" style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <input type="checkbox" id="regAgree" checked={agree} onChange={e => setAgree(e.target.checked)} required style={{ marginTop: 4 }} />
                  <label htmlFor="regAgree" style={{ margin: 0, fontWeight: 400, fontSize: 13, color: 'var(--text-2)' }}>
                    Tôi đồng ý với <Link to="/dieu-khoan" style={{ color: 'var(--accent)' }}>Điều khoản sử dụng</Link> và <Link to="/chinh-sach-bao-mat" style={{ color: 'var(--accent)' }}>Chính sách bảo mật</Link> của RaoNhà.
                  </label>
                </div>
                <button type="submit" className="btn-rn btn-rn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
                  {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
                </button>
              </form>
            </div>
            <div className="rn-auth-foot">Đã có tài khoản? <Link to="/dang-nhap">Đăng nhập</Link></div>
          </div>
        </div>
      </section>
    </>
  )
}
