import { useState, type FormEvent } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../api/client'

export default function ProfilePage() {
  const { user } = useAuth()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(null)
    if (password.length < 6) { setMsg({ type: 'error', text: 'Mật khẩu phải có ít nhất 6 ký tự.' }); return }
    if (password !== confirm) { setMsg({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' }); return }
    setSaving(true)
    try {
      await api.post(`/users/${user!.id}/change-password`, { password })
      setMsg({ type: 'success', text: 'Đổi mật khẩu thành công!' })
      setPassword('')
      setConfirm('')
    } catch (err: unknown) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Đổi mật khẩu thất bại.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '32px 0' }}>
      <div className="page-header" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <div className="page-title">Tài khoản của tôi</div>
        <div className="page-subtitle">Thông tin tài khoản và đổi mật khẩu</div>
      </div>

      {/* Thông tin */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="section-divider">Thông tin tài khoản</div>
        <div style={{ display: 'grid', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '4px' }}>Họ tên</div>
            <div style={{ fontWeight: 500 }}>{user?.name}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '4px' }}>Email</div>
            <div style={{ fontWeight: 500 }}>{user?.email}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '4px' }}>Vai trò</div>
            <span className={`badge ${user?.role === 'superadmin' ? 'badge-published' : 'badge-draft'}`}>
              <span className="badge-dot" />
              {user?.role === 'superadmin' ? 'Quản trị viên' : 'Người dùng'}
            </span>
          </div>
        </div>
      </div>

      {/* Đổi mật khẩu */}
      <div className="card">
        <div className="section-divider">Đổi mật khẩu</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Mật khẩu mới</label>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} placeholder="Tối thiểu 6 ký tự" required />
          </div>
          <div className="form-group">
            <label className="form-label">Xác nhận mật khẩu</label>
            <input type="password" className="form-control" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Nhập lại mật khẩu mới" required />
          </div>
          {msg && (
            <div className={`alert alert-${msg.type}`}>{msg.text}</div>
          )}
          <button type="submit" className="btn-accent" disabled={saving}>
            {saving ? 'Đang lưu...' : 'Đổi mật khẩu'}
          </button>
        </form>
      </div>
    </div>
  )
}
