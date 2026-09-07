import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../api/client'

export default function ProfilePage() {
  const { user } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    if (!currentPassword) { setMsg({ type: 'error', text: 'Vui lòng nhập mật khẩu hiện tại.' }); return }
    if (password.length < 6) { setMsg({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự.' }); return }
    if (password !== confirm) { setMsg({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' }); return }
    setSaving(true)
    try {
      await api.post(`/users/${user!.id}/change-password`, { current_password: currentPassword, password })
      setMsg({ type: 'success', text: 'Đổi mật khẩu thành công!' })
      setCurrentPassword(''); setPassword(''); setConfirm('')
    } catch (err: unknown) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Đổi mật khẩu thất bại.' })
    } finally { setSaving(false) }
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '32px 0' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '8px' }}>Tài khoản của tôi</h1>
      <p style={{ color: 'var(--text-2)', fontSize: '14px', marginBottom: '32px' }}>Thông tin tài khoản và đổi mật khẩu</p>

      <div style={{ padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '16px', background: 'var(--surface)' }}>
        <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Thông tin tài khoản</div>
        <div style={{ display: 'grid', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '4px' }}>Họ tên</div>
            <div style={{ fontWeight: '500' }}>{user?.name}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '4px' }}>Email</div>
            <div style={{ fontWeight: '500' }}>{user?.email}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '4px' }}>Vai trò</div>
            <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '20px', background: 'var(--accent-light)', color: 'var(--accent)', fontWeight: '600' }}>
              {user?.role === 'superadmin' ? 'Quản trị viên' : 'Người dùng'}
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Đổi mật khẩu</div>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label className="form-label">Mật khẩu hiện tại</label>
            <input type="password" className="form-control" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Nhập mật khẩu hiện tại" required />
          </div>
          <div>
            <label className="form-label">Mật khẩu mới</label>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} placeholder="Tối thiểu 6 ký tự" required />
          </div>
          <div>
            <label className="form-label">Xác nhận mật khẩu mới</label>
            <input type="password" className="form-control" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Nhập lại mật khẩu mới" required />
          </div>
          {msg && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', fontSize: '13px', background: msg.type === 'success' ? 'var(--accent-light)' : '#fff0f0', color: msg.type === 'success' ? 'var(--accent)' : 'var(--danger)', border: `1px solid ${msg.type === 'success' ? 'var(--accent-light)' : '#fdd'}` }}>
              {msg.text}
            </div>
          )}
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Đổi mật khẩu'}</button>
        </form>
      </div>
    </div>
  )
}
