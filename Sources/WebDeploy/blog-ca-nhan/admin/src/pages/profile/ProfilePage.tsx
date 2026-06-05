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
    if (password.length < 6) {
      setMsg({ type: 'error', text: 'Mật khẩu phải có ít nhất 6 ký tự.' })
      return
    }
    if (password !== confirm) {
      setMsg({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' })
      return
    }
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
      <div className="page-header">
        <div>
          <div className="page-title">Tài khoản của tôi</div>
          <div className="page-sub">Thông tin tài khoản và đổi mật khẩu</div>
        </div>
      </div>

      {/* Thông tin tài khoản */}
      <div className="form-card" style={{ marginBottom: '16px' }}>
        <div className="form-section-title">Thông tin tài khoản</div>
        <div style={{ display: 'grid', gap: '12px' }}>
          <div>
            <div className="form-label" style={{ marginBottom: '4px' }}>Họ tên</div>
            <div style={{ fontWeight: '500', color: 'var(--text)' }}>{user?.name}</div>
          </div>
          <div>
            <div className="form-label" style={{ marginBottom: '4px' }}>Email</div>
            <div style={{ fontWeight: '500', color: 'var(--text)' }}>{user?.email}</div>
          </div>
          <div>
            <div className="form-label" style={{ marginBottom: '4px' }}>Vai trò</div>
            <span className="badge badge-published">
              {user?.role === 'superadmin' ? 'Quản trị viên' : 'Người dùng'}
            </span>
          </div>
        </div>
      </div>

      {/* Đổi mật khẩu */}
      <div className="form-card">
        <div className="form-section-title">Đổi mật khẩu</div>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Mật khẩu mới <span className="req">*</span></label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự"
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Xác nhận mật khẩu <span className="req">*</span></label>
            <input
              type="password"
              className="form-control"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
              required
            />
          </div>
          {msg && (
            <div className={`alert alert-${msg.type}`}>{msg.text}</div>
          )}
          <button type="submit" className="btn btn-accent" disabled={saving}>
            {saving ? 'Đang lưu...' : 'Đổi mật khẩu'}
          </button>
        </form>
      </div>
    </div>
  )
}
